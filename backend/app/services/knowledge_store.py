"""
Knowledge Store Service - FAQ and General Information
Handles indexing and searching StackNStay knowledge base
"""
import os
from typing import List, Dict, Any, Optional
from pathlib import Path
import cohere
import faiss
import numpy as np
import json
from dotenv import load_dotenv

load_dotenv()

# Configuration
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
KNOWLEDGE_DIR = Path(__file__).parent.parent / "data" / "knowledge"
KNOWLEDGE_STORE_PATH = Path("knowledge_store")
FAISS_INDEX_FILE = KNOWLEDGE_STORE_PATH / "knowledge_index.bin"
CHUNKS_FILE = KNOWLEDGE_STORE_PATH / "knowledge_chunks.json"


class KnowledgeStore:
    """Vector store for StackNStay knowledge base (FAQ, guides, etc.)"""
    
    def __init__(self):
        self.cohere_client = cohere.Client(COHERE_API_KEY) if COHERE_API_KEY else None
        self.index: Optional[faiss.Index] = None
        self.knowledge_chunks: List[Dict[str, Any]] = []
        self.dimension = 1024  # Cohere embed-english-v3.0
        
        # Create directory
        KNOWLEDGE_STORE_PATH.mkdir(parents=True, exist_ok=True)
    
    def _split_into_chunks(self, markdown_content: str) -> List[Dict[str, str]]:
        """
        Split markdown into semantic chunks (by sections)
        """
        chunks = []
        current_section = ""
        current_title = "Introduction"
        current_content = []
        
        lines = markdown_content.split('\n')
        
        for line in lines:
            # Detect section headers (## or ###)
            if line.startswith('## ') or line.startswith('### '):
                # Save previous section
                if current_content:
                    chunks.append({
                        "title": current_title,
                        "content": '\n'.join(current_content).strip(),
                        "section": current_section
                    })
                
                # Start new section
                if line.startswith('## '):
                    current_section = line.replace('## ', '').strip()
                    current_title = current_section
                else:
                    current_title = line.replace('### ', '').strip()
                
                current_content = []
            else:
                current_content.append(line)
        
        # Add last section
        if current_content:
            chunks.append({
                "title": current_title,
                "content": '\n'.join(current_content).strip(),
                "section": current_section
            })
        
        # Filter out empty chunks
        chunks = [c for c in chunks if c["content"].strip()]
        
        return chunks
    
    async def index_knowledge_base(self) -> int:
        """
        Index the knowledge base markdown files
        """
        if not KNOWLEDGE_DIR.exists():
            print(f"⚠️ Knowledge directory not found: {KNOWLEDGE_DIR}")
            return 0
        
        print("📚 Loading knowledge base...")
        all_chunks = []
        
        for md_file in KNOWLEDGE_DIR.glob("*.md"):
            print(f"📄 Processing {md_file.name}...")
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Split into chunks
            chunks = self._split_into_chunks(content)
            
            # Add source metadata
            for chunk in chunks:
                chunk["source"] = md_file.name
                
            all_chunks.extend(chunks)
            
        if not all_chunks:
            print("⚠️ No knowledge base chunks could be extracted.")
            return 0
            
        print(f"✂️ Created {len(all_chunks)} total knowledge chunks")
        
        # Create searchable texts
        texts = []
        for chunk in all_chunks:
            # Combine title and content for better search
            text = f"Source: {chunk.get('source', '')}\n{chunk['section']} - {chunk['title']}\n\n{chunk['content']}"
            texts.append(text)
        
        # Generate embeddings
        print("🔄 Generating embeddings with Cohere...")
        embeddings = await self._embed_texts(texts)
        
        # Create FAISS index
        self.dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(self.dimension)
        
        # Normalize for cosine similarity
        faiss.normalize_L2(embeddings)
        
        # Add to index
        self.index.add(embeddings)
        
        # Store chunks
        self.knowledge_chunks = all_chunks
        
        # Save to disk
        self.save()
        
        print(f"✅ Indexed {len(all_chunks)} knowledge chunks!")
        return len(all_chunks)
    
    async def _embed_texts(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings using Cohere"""
        if not self.cohere_client:
            raise ValueError("Cohere API key not configured")
        
        try:
            response = self.cohere_client.embed(
                texts=texts,
                model="embed-english-v3.0",
                input_type="search_document"
            )
            return np.array(response.embeddings, dtype=np.float32)
        except Exception as e:
            print(f"Error generating embeddings: {e}")
            raise
    
    async def _embed_query(self, query: str) -> np.ndarray:
        """Generate embedding for search query"""
        if not self.cohere_client:
            raise ValueError("Cohere API key not configured")
        
        try:
            response = self.cohere_client.embed(
                texts=[query],
                model="embed-english-v3.0",
                input_type="search_query"
            )
            return np.array(response.embeddings[0], dtype=np.float32)
        except Exception as e:
            print(f"Error generating query embedding: {e}")
            raise
    
    async def search(self, query: str, k: int = 3) -> List[Dict[str, Any]]:
        """
        Search knowledge base for relevant information
        """
        if not self.index or not self.knowledge_chunks:
            print("⚠️ Knowledge store not loaded")
            return []
        
        # Generate query embedding
        query_embedding = await self._embed_query(query)
        query_embedding = query_embedding.reshape(1, -1)
        
        # Normalize
        faiss.normalize_L2(query_embedding)
        
        # Search
        scores, indices = self.index.search(query_embedding, k)
        
        # Get results
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.knowledge_chunks):
                chunk = self.knowledge_chunks[idx].copy()
                chunk["match_score"] = float(scores[0][i])
                results.append(chunk)
        
        return results
    
    def save(self):
        """Save index and chunks to disk"""
        if self.index:
            faiss.write_index(self.index, str(FAISS_INDEX_FILE))
            print(f"💾 Saved knowledge index to {FAISS_INDEX_FILE}")
        
        if self.knowledge_chunks:
            with open(CHUNKS_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.knowledge_chunks, f, indent=2, ensure_ascii=False)
            print(f"💾 Saved knowledge chunks to {CHUNKS_FILE}")
    
    def load(self) -> bool:
        """Load index and chunks from disk"""
        try:
            if FAISS_INDEX_FILE.exists() and CHUNKS_FILE.exists():
                self.index = faiss.read_index(str(FAISS_INDEX_FILE))
                
                with open(CHUNKS_FILE, 'r', encoding='utf-8') as f:
                    self.knowledge_chunks = json.load(f)
                
                print(f"✅ Loaded {len(self.knowledge_chunks)} knowledge chunks from disk")
                return True
            else:
                print("⚠️ No saved knowledge index found")
                return False
        except Exception as e:
            print(f"❌ Error loading knowledge index: {e}")
            return False


# Singleton instance
knowledge_store = KnowledgeStore()
