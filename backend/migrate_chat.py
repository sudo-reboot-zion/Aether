
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, update
from app.models import ChatSession

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")

async def migrate():
    engine = create_async_engine(DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession)

    async with async_session() as session:
        # Find all sessions with PENDING_HOST
        result = await session.execute(select(ChatSession).filter(ChatSession.host_address == "PENDING_HOST"))
        sessions = result.scalars().all()
        
        if not sessions:
            print("No PENDING_HOST sessions found.")
            return

        print(f"Found {len(sessions)} sessions to migrate.")
        
        # Mapping properties to hosts (This is hardcoded for the current test environment)
        # Property 0 host is ST14H34NPZFH4D1W12AR910ZFX6JB4G9WMGTYZTPZ
        HOST_MAP = {
            0: "ST14H34NPZFH4D1W12AR910ZFX6JB4G9WMGTYZTPZ",
            -1: "ST14H34NPZFH4D1W12AR910ZFX6JB4G9WMGTYZTPZ", # -1 usually maps to property 0 inquiry
        }

        for s in sessions:
            # Try to infer property ID from booking_id
            # If booking_id < 0, property_id = abs(booking_id) - 1
            # If booking_id == 0, it might have been an old inquiry format for property 0
            prop_id = 0
            if s.booking_id < 0:
                prop_id = abs(s.booking_id) - 1
            elif s.booking_id == 0:
                prop_id = 0
            
            new_host = HOST_MAP.get(prop_id) or HOST_MAP.get(s.booking_id)
            if new_host:
                print(f"Migrating Session {s.id} (Booking {s.booking_id}) to Host {new_host}")
                s.host_address = new_host
                # Also ensure booking_id is in the new negative format if it was 0
                if s.booking_id == 0:
                    s.booking_id = -1
            else:
                print(f"Could not find host for Session {s.id} (Booking {s.booking_id})")

        await session.commit()
        print("Migration complete.")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(migrate())
