"""
Aether Backend API
FastAPI application with RAG chatbot and property recommendations
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routers import chat, chat_ws
from app.services.knowledge_store import knowledge_store
from app.database import engine, Base
import app.models
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown events
    """
    # Startup
    print("🚀 Starting Aether API...")
    try:
        # Initialize Database Tables
        print("💽 Initializing PostgreSQL tables...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        # Index Knowledge Base
        print("📚 Indexing knowledge base...")
        await knowledge_store.index_knowledge_base()
    except Exception as e:
        print(f"❌ Error during startup: {e}")
    
    yield
    
    # Shutdown
    print("👋 Shutting down Aether API...")


# Create FastAPI app
app = FastAPI(
    title="Aether API",
    description="Decentralized property rental platform with AI-powered search",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=False  # Disable automatic trailing slash redirects
)

# Configure CORS - Allow all origins for Vercel preview deployments
# Note: Using "*" is safe here because:
# 1. The API doesn't use authentication cookies
# 2. All property data is public blockchain data
# 3. Vercel creates many preview URLs that are hard to whitelist
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=False,  # Must be False when using "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router)
app.include_router(chat_ws.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Aether API",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/chat",
            "index": "/api/index",
            "docs": "/docs"
        }
    }


@app.post("/api/index")
async def trigger_indexing():
    """Trigger re-indexing of properties and knowledge base"""
    try:
        print("🔄 Manual re-indexing triggered...")
        
        # Index Knowledge Base
        kb_count = await knowledge_store.index_knowledge_base()
        
        return {
            "status": "success",
            "message": "Re-indexing completed",
            "knowledge_chunks_indexed": kb_count
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "knowledge_store_loaded": knowledge_store.index is not None,
        "knowledge_chunks": len(knowledge_store.knowledge_chunks)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)