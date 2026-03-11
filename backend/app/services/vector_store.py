"""
Vector Store Service - FAISS + Cohere Embeddings
Handles semantic search for generic chat information and conversational context.
"""
import os
import json
import faiss
import numpy as np
from typing import List, Dict, Any, Optional
from pathlib import Path
import cohere
from dotenv import load_dotenv

load_dotenv()

# Configuration
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
VECTOR_STORE_PATH = Path("data/vector_store")
FAISS_INDEX_FILE = VECTOR_STORE_PATH / "faiss_index.bin"
METADATA_FILE = VECTOR_STORE_PATH / "context_metadata.json"


class VectorStore:
    """FAISS vector store with Cohere embeddings for chat context and information"""
    
    def __init__(self):
        self.cohere_client = cohere.Client(COHERE_API_KEY) if COHERE_API_KEY else None
        self.index: Optional[faiss.Index] = None
        self.metadata: List[Dict[str, Any]] = []
        self.dimension = 1024  # Cohere embed-english-v3.0 dimension
        
        # Create data directory if it doesn't exist
        VECTOR_STORE_PATH.mkdir(parents=True, exist_ok=True)
    
    async def embed_texts(self, texts: List[str]) -> np.ndarray:
        """
        Generate embeddings using Cohere API
        """
        if not self.cohere_client:
            raise ValueError("Cohere API key not configured")
        
        try:
            response = self.cohere_client.embed(
                texts=texts,
                model="embed-english-v3.0",
                input_type="search_document"
            )
            
            embeddings = np.array(response.embeddings, dtype=np.float32)
            return embeddings
            
        except Exception as e:
            print(f"Error generating embeddings: {e}")
            raise
    
    async def embed_query(self, query: str) -> np.ndarray:
        """
        Generate embedding for search query
        """
        if not self.cohere_client:
            raise ValueError("Cohere API key not configured")
        
        try:
            response = self.cohere_client.embed(
                texts=[query],
                model="embed-english-v3.0",
                input_type="search_query"
            )
            
            embedding = np.array(response.embeddings[0], dtype=np.float32)
            return embedding
            
        except Exception as e:
            print(f"Error generating query embedding: {e}")
            raise
    
    async def index_information(self, documents: List[Dict[str, Any]]) -> int:
        """
        Index generic chatting information or context into FAISS.
        Expects documents to have a 'content' key containing the text to embed.
        """
        if not documents:
            print("⚠️ No documents to index")
            return 0
        
        print(f"📝 Indexing {len(documents)} chat info documents...")
        
        texts = [doc.get("content", "") for doc in documents if "content" in doc]
        if not texts:
            print("⚠️ No valid text chunks found safely.")
            return 0
        
        # Generate embeddings
        print("🔄 Generating embeddings with Cohere...")
        embeddings = await self.embed_texts(texts)
        
        # Create FAISS index
        self.dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(self.dimension)  # Inner product (cosine similarity)
        
        # Normalize embeddings for cosine similarity
        faiss.normalize_L2(embeddings)
        
        # Add to index
        self.index.add(embeddings)
        
        # Store metadata
        self.metadata = documents
        
        # Save to disk
        self.save()
        
        print(f"✅ Indexed {len(documents)} documents successfully!")
        return len(documents)
    
    async def search(
        self,
        query: str,
        k: int = 5,
        min_score: float = 0.0
    ) -> List[Dict[str, Any]]:
        """
        Semantic search for relevant chatting information
        """
        if not self.index or not self.metadata:
            print("⚠️ Index not loaded. Call load() or index_information() first.")
            return []
        
        # Generate query embedding
        query_embedding = await self.embed_query(query)
        query_embedding = query_embedding.reshape(1, -1)
        
        # Normalize for cosine similarity
        faiss.normalize_L2(query_embedding)
        
        # Search
        scores, indices = self.index.search(query_embedding, k)
        
        # Get results
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.metadata):
                info_data = self.metadata[idx].copy()
                info_data["match_score"] = float(scores[0][i])
                
                # Filter by score
                if info_data["match_score"] < min_score:
                    continue
                
                results.append(info_data)
        
        return results
    
    def save(self):
        """Save index and metadata to disk"""
        if self.index:
            faiss.write_index(self.index, str(FAISS_INDEX_FILE))
            print(f"💾 Saved FAISS index to {FAISS_INDEX_FILE}")
        
        if self.metadata:
            with open(METADATA_FILE, 'w') as f:
                json.dump(self.metadata, f, indent=2)
            print(f"💾 Saved metadata to {METADATA_FILE}")
    
    def load(self) -> bool:
        """Load index and metadata from disk"""
        try:
            if FAISS_INDEX_FILE.exists() and METADATA_FILE.exists():
                self.index = faiss.read_index(str(FAISS_INDEX_FILE))
                
                with open(METADATA_FILE, 'r') as f:
                    self.metadata = json.load(f)
                
                print(f"✅ Loaded {len(self.metadata)} chat info chunks from disk")
                return True
            else:
                print("⚠️ No saved index found")
                return False
                
        except Exception as e:
            print(f"❌ Error loading index: {e}")
            return False


# Singleton instance selection
vector_store = VectorStore()
