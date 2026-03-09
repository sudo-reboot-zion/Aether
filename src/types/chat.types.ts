export interface KnowledgeSnippet {
    title?: string;
    content?: string;
    source?: string;
    match_score?: number;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    knowledgeSnippets?: KnowledgeSnippet[];
}

export interface ChatState {
    messages: ChatMessage[];
    isOpen: boolean;
    isLoading: boolean;
    conversationId: string | null;
    suggestedActions: string[];
    error: string | null;
}
