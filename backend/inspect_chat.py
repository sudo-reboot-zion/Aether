
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.models import ChatSession, Message

# Use the same database URL as the app
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")

async def inspect_db():
    engine = create_async_engine(DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        print("--- Chat Sessions ---")
        result = await session.execute(select(ChatSession))
        sessions = result.scalars().all()
        for s in sessions:
            print(f"ID: {s.id} | BookingID: {s.booking_id} | Guest: {s.guest_address} | Host: {s.host_address} | Created: {s.created_at}")
            
            # Get messages for this session
            msg_result = await session.execute(select(Message).filter(Message.session_id == s.id))
            msgs = msg_result.scalars().all()
            for m in msgs:
                print(f"  - [{m.sender_address}] {m.content[:30]}... ({m.created_at})")
        
        if not sessions:
            print("No sessions found.")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(inspect_db())
