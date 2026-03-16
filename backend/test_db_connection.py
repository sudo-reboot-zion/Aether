
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv

load_dotenv()

async def test_connection():
    db_url = os.getenv("DATABASE_URL")
    print(f"Testing connection to: {db_url}")
    
    # Try with different SSL settings if it fails
    engines_to_test = [
        create_async_engine(db_url, echo=True),
        create_async_engine(db_url, echo=True, connect_args={"ssl": "require"})
    ]
    
    for i, engine in enumerate(engines_to_test):
        print(f"\n--- Testing Engine {i+1} ---")
        try:
            async with engine.connect() as conn:
                result = await conn.execute("SELECT 1")
                print(f"Success! Result: {result.scalar()}")
                return
        except Exception as e:
            print(f"Failed with error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            await engine.dispose()

if __name__ == "__main__":
    asyncio.run(test_connection())
