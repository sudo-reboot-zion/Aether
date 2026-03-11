import asyncio
from app.services.knowledge_store import knowledge_store

async def main():
    print("Forcing knowledge base re-index...")
    indexed_chunks = await knowledge_store.index_knowledge_base()
    print(f"Successfully indexed {indexed_chunks} chunks.")

if __name__ == "__main__":
    asyncio.run(main())
