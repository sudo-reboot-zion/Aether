import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import select
import json

# Import models from the app
from app.models import Base, ChatSession, Message
from app.routers.chat_ws import get_user_sessions

async def verify_sessions():
    # 1. Setup in-memory SQLite for testing
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as db:
        # 2. Seed data
        user_guest = "GUEST_ADDR"
        user_host = "HOST_ADDR"
        
        # Session 1: Booking (booking_id > 0)
        s1 = ChatSession(booking_id=123, guest_address=user_guest, host_address=user_host)
        db.add(s1)
        await db.commit()
        await db.refresh(s1)
        
        m1 = Message(session_id=s1.id, sender_address=user_guest, content="Hello Host!")
        db.add(m1)
        
        # Session 2: Inquiry (booking_id < 0)
        s2 = ChatSession(booking_id=-456, guest_address=user_guest, host_address="PENDING_HOST")
        db.add(s2)
        await db.commit()
        await db.refresh(s2)
        
        m2 = Message(session_id=s2.id, sender_address=user_guest, content="Is this available?")
        db.add(m2)
        await db.commit()

        print("--- Testing Guest Perspective ---")
        sessions = await get_user_sessions(user_guest, db)
        for s in sessions:
            print(f"ID: {s['booking_id']}, Partner: {s['partner_address']}, Inquiry: {s['is_inquiry']}, Last: {s['last_message']['content']}")
            
            # Assertions
            if s['booking_id'] == 123:
                assert s['partner_address'] == user_host
                assert s['is_inquiry'] == False
            if s['booking_id'] == -456:
                assert s['partner_address'] == "PENDING_HOST"
                assert s['is_inquiry'] == True

        print("\n--- Testing Host Perspective ---")
        sessions = await get_user_sessions(user_host, db)
        for s in sessions:
            print(f"ID: {s['booking_id']}, Partner: {s['partner_address']}, Inquiry: {s['is_inquiry']}, Last: {s['last_message']['content']}")
            
            # Assertions
            if s['booking_id'] == 123:
                assert s['partner_address'] == user_guest
                assert s['is_inquiry'] == False

        print("\n✅ Verification successful! New fields partner_address and is_inquiry are correct.")

if __name__ == "__main__":
    asyncio.run(verify_sessions())
