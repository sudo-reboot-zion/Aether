from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Dict, List
import json

from app.database import get_db
from app.models import ChatSession, Message

router = APIRouter(prefix="/ws/chat", tags=["websocket-chat"])

class ConnectionManager:
    def __init__(self):
        # Maps booking_id to a list of active WebSocket connections
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, booking_id: int):
        await websocket.accept()
        if booking_id not in self.active_connections:
            self.active_connections[booking_id] = []
        self.active_connections[booking_id].append(websocket)

    def disconnect(self, websocket: WebSocket, booking_id: int):
        if booking_id in self.active_connections:
            self.active_connections[booking_id].remove(websocket)
            if not self.active_connections[booking_id]:
                del self.active_connections[booking_id]

    async def broadcast_to_room(self, booking_id: int, message: dict):
        if booking_id in self.active_connections:
            for connection in self.active_connections[booking_id]:
                await connection.send_json(message)

manager = ConnectionManager()

@router.websocket("/{booking_id}/{user_address}/{partner_address}")
async def websocket_endpoint(
    websocket: WebSocket, 
    booking_id: int, 
    user_address: str,
    partner_address: str, 
    db: AsyncSession = Depends(get_db)
):
    # 1. Verify or Create Chat Session
    # Negative booking IDs represent pre-booking property inquiries (e.g., -1 = property 0)
    is_inquiry = booking_id < 0
    
    # Room key for connection manager should be unique per session
    # We use a tuple (booking_id, guest, host) later, but for the manager, we need something comparable.
    # Actually, using a string concatenation or just the database session ID is better.
    
    if is_inquiry:
        # For inquiries, the room is unique to (Property, Guest, Host)
        # Note: If user_address is guest, partner is host. If user is host, partner is guest.
        # Re-calc guest/host more robustly:
        potential_guest = user_address if partner_address != "PENDING_HOST" else user_address
        potential_host = partner_address
        
        # Try to find existing session where these two are participants for this booking
        result = await db.execute(
            select(ChatSession).filter(
                ChatSession.booking_id == booking_id,
                ((ChatSession.guest_address == user_address) & (ChatSession.host_address == partner_address)) |
                ((ChatSession.guest_address == partner_address) & (ChatSession.host_address == user_address))
            )
        )
        session = result.scalars().first()
        
        if not session:
            # Create new uniquely for this inquiry
            # Guest is the one who initiated it (usually user_address if they hit the PropertyInfo button)
            session = ChatSession(
                booking_id=booking_id,
                guest_address=user_address,
                host_address=partner_address
            )
            db.add(session)
            await db.commit()
            await db.refresh(session)
            print(f"[Chat] New private inquiry session {session.id} for property {abs(booking_id)-1}")
    else:
        # For confirmed bookings, booking_id is already unique in the blockchain context
        result = await db.execute(select(ChatSession).filter(ChatSession.booking_id == booking_id))
        session = result.scalars().first()
        
        if not session:
            session = ChatSession(
                booking_id=booking_id,
                guest_address=user_address,
                host_address=partner_address
            )
            db.add(session)
            await db.commit()
            await db.refresh(session)

    # 2. Connect the socket — use the session.id as the room identifier for broadcast isolation
    room_id = session.id
    await manager.connect(websocket, room_id)
    print(f"[WS] User {user_address[:8]} connected to room {room_id}")
    try:
        while True:
            data = await websocket.receive_text()
            print(f"[WS] Received message from {user_address[:8]}: {data[:20]}...")
            
            # Save message
            new_message = Message(
                session_id=session.id,
                sender_address=user_address,
                content=data
            )
            db.add(new_message)
            await db.commit()
            await db.refresh(new_message)
            print(f"[WS] Message saved to DB (id: {new_message.id})")

            # Broadcast message to everyone in this session's room
            broadcast_payload = {
                "id": new_message.id,
                "booking_id": booking_id,
                "sender_address": user_address,
                "content": data,
                "timestamp": new_message.created_at.isoformat()
            }
            print(f"[WS] Broadcasting to room {room_id}...")
            await manager.broadcast_to_room(room_id, broadcast_payload)
            print(f"[WS] Broadcast complete for room {room_id}")

    except WebSocketDisconnect:
        print(f"[WS] User {user_address[:8]} disconnected from room {room_id}")
        manager.disconnect(websocket, room_id)
    except Exception as e:
        print(f"[WS] Error in websocket loop: {e}")
        manager.disconnect(websocket, room_id)


@router.get("/history/{booking_id}/{user_address}/{partner_address}")
async def get_chat_history(
    booking_id: int, 
    user_address: str, 
    partner_address: str, 
    db: AsyncSession = Depends(get_db)
):
    """Fetch previous chat history for a given booking and participant pair"""
    # Find session unique to this pair and booking
    result = await db.execute(
        select(ChatSession).filter(
            ChatSession.booking_id == booking_id,
            ((ChatSession.guest_address == user_address) & (ChatSession.host_address == partner_address)) |
            ((ChatSession.guest_address == partner_address) & (ChatSession.host_address == user_address))
        )
    )
    session = result.scalars().first()
    
    if not session:
        return []

    msg_result = await db.execute(
        select(Message)
        .filter(Message.session_id == session.id)
        .order_by(Message.created_at.asc())
    )
    messages = msg_result.scalars().all()
    
    return [
        {
            "id": msg.id,
            "sender_address": msg.sender_address,
            "content": msg.content,
            "timestamp": msg.created_at.isoformat()
        } for msg in messages
    ]
@router.get("/sessions/{user_address}")
async def get_user_sessions(user_address: str, db: AsyncSession = Depends(get_db)):
    """Fetch all chat sessions where the user is either guest or host"""
    # Find sessions where user is participant
    result = await db.execute(
        select(ChatSession)
        .filter((ChatSession.guest_address == user_address) | (ChatSession.host_address == user_address))
        .order_by(ChatSession.created_at.desc())
    )
    sessions = result.scalars().all()
    
    response = []
    for session in sessions:
        # Get last message for this session
        msg_result = await db.execute(
            select(Message)
            .filter(Message.session_id == session.id)
            .order_by(Message.created_at.desc())
            .limit(1)
        )
        last_msg = msg_result.scalars().first()
        
        # Determine partner address and inquiry status
        partner_address = session.host_address if session.guest_address == user_address else session.guest_address
        is_inquiry = session.booking_id < 0

        response.append({
            "id": session.id,
            "booking_id": session.booking_id,
            "guest_address": session.guest_address,
            "host_address": session.host_address,
            "partner_address": partner_address,
            "is_inquiry": is_inquiry,
            "created_at": session.created_at.isoformat(),
            "last_message": {
                "content": last_msg.content if last_msg else None,
                "timestamp": last_msg.created_at.isoformat() if last_msg else None,
                "sender": last_msg.sender_address if last_msg else None
            } if last_msg else None
        })
        
    return response
