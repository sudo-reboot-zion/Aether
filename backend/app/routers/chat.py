"""
RAG Chat Router - Smart Routing Agent
Handles both property search AND general Aether knowledge questions
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, TypedDict
import os
import asyncio
from dotenv import load_dotenv

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

from app.services.knowledge_store import knowledge_store

load_dotenv()

router = APIRouter(prefix="/api/chat", tags=["chat"])

# Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")


# ============================================
# PYDANTIC MODELS
# ============================================

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    response: str
    knowledge_snippets: List[Dict[str, Any]]
    conversation_id: str
    suggested_actions: List[str]


# ============================================
# LANGGRAPH AGENT STATE
# ============================================

class AgentState(TypedDict):
    """State for the smart routing agent"""
    messages: List[Any]
    user_query: str
    knowledge_results: List[Dict[str, Any]]
    final_response: str
    conversation_id: str


# ============================================
# LANGGRAPH NODES
# ============================================

# Node: No longer needed for property search/filters


async def search_knowledge_node(state: AgentState) -> Dict[str, Any]:
    """
    Search knowledge base for relevant information
    """
    try:
        results = await knowledge_store.search(
            query=state["user_query"],
            k=3
        )
        print(f"📚 Found {len(results)} knowledge snippets")
        return {"knowledge_results": results}
    except Exception as e:
        print(f"Error in knowledge search: {e}")
        return {"knowledge_results": []}


async def generate_response_node(state: AgentState) -> Dict[str, Any]:
    """
    Generate unified response based on query type
    """
    llm = ChatGroq(api_key=GROQ_API_KEY, model=LLM_MODEL, temperature=0.7)
    
    # Build context based on query type
    context = ""
    
    # Add knowledge context
    if state["knowledge_results"]:
        context += "**Aether Information:**\n\n"
        for i, chunk in enumerate(state["knowledge_results"], 1):
            context += f"{i}. **{chunk.get('title', 'Info')}**\n"
            content = chunk.get('content', '')[:500]  # Limit length
            context += f"{content}\n\n"
    
    # Handle no results
    if not state["knowledge_results"]:
        context = "I don't have specific information about that in my knowledge base."
    
    system_prompt = f"""You are a helpful assistant for Aether, a decentralized property rental platform.

The user asked: "{state['user_query']}"

Here's the relevant information from our knowledge base:

{context}

Provide a clear, helpful answer based on this information. Be conversational and friendly.
If the information doesn't fully answer their question, say so and suggest they contact support.
Keep your response concise (2-4 sentences max).
"""
    
    messages = state["messages"] + [
        SystemMessage(content=system_prompt),
        HumanMessage(content=state["user_query"])
    ]
    
    response = llm.invoke(messages)
    
    # Update conversation history
    updated_messages = state["messages"] + [
        HumanMessage(content=state["user_query"]),
        AIMessage(content=response.content)
    ]
    
    return {
        "final_response": response.content,
        "messages": updated_messages
    }


# ============================================
# BUILD LANGGRAPH
# ============================================

def create_smart_chat_graph():
    """Create the smart routing LangGraph agent"""
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("search_knowledge", search_knowledge_node)
    workflow.add_node("generate_response", generate_response_node)
    
    # Define edges
    workflow.set_entry_point("search_knowledge")
    workflow.add_edge("search_knowledge", "generate_response")
    workflow.add_edge("generate_response", END)
    
    # Compile with memory
    memory = MemorySaver()
    app = workflow.compile(checkpointer=memory)
    
    return app


# Create the graph
smart_chat_graph = create_smart_chat_graph()


# ============================================
# API ENDPOINTS
# ============================================

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Smart chat endpoint - handles both property search and knowledge questions
    """
    try:
        # Ensure stores are loaded (support async or sync load())

        if not knowledge_store.index:
            maybe_k = knowledge_store.load()
            if asyncio.iscoroutine(maybe_k):
                await maybe_k
        
        # Create conversation ID if not provided
        conversation_id = request.conversation_id or f"conv_{os.urandom(8).hex()}"
        
        # Create initial state
        initial_state: AgentState = {
            "user_query": request.message,
            "conversation_id": conversation_id,
            "messages": [],
            "knowledge_results": [],
            "final_response": ""
        }
        
        # Run the smart routing graph
        config = {"configurable": {"thread_id": conversation_id}}
        final_state = await smart_chat_graph.ainvoke(initial_state, config)
        
        # Extract results
        knowledge = final_state.get("knowledge_results", [])[:3]
        response_text = final_state.get("final_response", "I'm sorry, I couldn't process that request.")
        
        suggested_actions = [
            "How do I get started?",
            "What is Aether?",
            "Tell me about platform fees"
        ]
        
        return ChatResponse(
            response=response_text,
            knowledge_snippets=knowledge,
            conversation_id=conversation_id,
            suggested_actions=suggested_actions
        )
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Also handle requests without trailing slash explicitly
@router.post("", response_model=ChatResponse)
async def chat_no_slash(request: ChatRequest):
    """Smart chat endpoint (no trailing slash)"""
    return await chat(request)



@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "knowledge_store_loaded": knowledge_store.index is not None,
        "knowledge_chunks": len(knowledge_store.knowledge_chunks)
    }

