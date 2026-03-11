import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface ChatMessagePayload {
    id?: number;
    sender_address: string;
    content: string;
    timestamp?: string;
}

export const useWebSocketChat = (bookingId: number | null, partnerAddress: string | null) => {
    const { userData, stxAddress: userAddress } = useAuth();

    const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const socketRef = useRef<WebSocket | null>(null);

    // Fetch history when bookingId or partnerAddress changes
    useEffect(() => {
        if (bookingId === null || !userAddress || !partnerAddress) return;
        console.log("[Chat Hook] Fetching history for bookingId:", bookingId, "partner:", partnerAddress);

        const fetchHistory = async () => {
            setIsLoadingHistory(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aether-ogor.onrender.com';
                // New isolated history endpoint
                const response = await fetch(`${apiUrl}/ws/chat/history/${bookingId}/${userAddress}/${partnerAddress}`);
                if (response.ok) {
                    const history: ChatMessagePayload[] = await response.json();
                    setMessages((prev) => {
                        const merged = [...history];
                        const existingIds = new Set(history.map(m => m.id).filter(id => id !== undefined));

                        prev.forEach(msg => {
                            if (msg.id === undefined || !existingIds.has(msg.id)) {
                                merged.push(msg);
                            }
                        });

                        return merged.sort((a, b) => {
                            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                            return timeA - timeB;
                        });
                    });
                }
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        fetchHistory();
    }, [bookingId, userAddress, partnerAddress]);

    // Manage WebSocket connection
    useEffect(() => {
        if (bookingId === null || !userAddress || !partnerAddress) {
            return;
        }

        // Cleanup existing socket
        if (socketRef.current) {
            socketRef.current.close();
        }

        const envWsUrl = process.env.NEXT_PUBLIC_WS_URL;
        const fallbackWsUrl = typeof window !== 'undefined'
            ? `wss://aether-ogor.onrender.com`
            : 'wss://aether-ogor.onrender.com';
        const wsUrl = envWsUrl || fallbackWsUrl;

        // URL format: /{booking_id}/{user_address}/{partner_address}
        const url = `${wsUrl}/ws/chat/${bookingId}/${userAddress}/${partnerAddress}`;
        console.log(`[Chat Hook] Connecting to: ${url}`);

        const ws = new WebSocket(url);

        ws.onopen = () => {
            setIsConnected(true);
            console.log("[Chat Hook] WebSocket Connected Successfully");
        };

        ws.onmessage = (event) => {
            try {
                const incomingMessage: ChatMessagePayload = JSON.parse(event.data);
                setMessages((prev) => [...prev, incomingMessage]);
            } catch (error) {
                console.error("[Chat Hook] Failed to parse incoming WS message:", error);
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
            console.log("WebSocket Disconnected");
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            setIsConnected(false);
        };

        socketRef.current = ws;

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [bookingId, userAddress, partnerAddress]);

    const sendMessage = useCallback((content: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && userAddress) {
            console.log("[Chat Hook] Sending string to WS:", content);
            socketRef.current.send(content);
        } else {
            console.warn("[Chat Hook] WebSocket is not connected or state is not OPEN. Message not sent.", {
                readyState: socketRef.current?.readyState,
                userAddress
            });
        }
    }, [userAddress]);

    return {
        messages,
        isConnected,
        isLoadingHistory,
        sendMessage,
        userAddress
    };
};
