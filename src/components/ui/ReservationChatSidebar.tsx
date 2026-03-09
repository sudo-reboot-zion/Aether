"use client";
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/index';
import { closeBookingChat } from '../../redux/slices/bookingChatSlice';
import { useWebSocketChat } from '../../hooks/useWebSocketChat';
import { useAuth } from '../../hooks/useAuth';
import { encodePropertyId } from '@/lib/urls';

// Subcomponents
import { ChatHeader } from '../chat/ChatHeader';
import { MessageArea } from '../chat/MessageArea';
import { ChatInput } from '../chat/ChatInput';

const ReservationChatSidebar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { userData } = useAuth();
    const { isOpen, activeBookingId, partnerAddress } = useSelector(
        (state: RootState) => state.bookingChat
    );

    const { messages, isConnected, isLoadingHistory, sendMessage, userAddress } =
        useWebSocketChat(isOpen ? activeBookingId : null, isOpen ? partnerAddress : null);

    const [inputValue, setInputValue] = useState('');
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            console.log("[Chat Sidebar] Opened with:", { activeBookingId, partnerAddress, userData });
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen, activeBookingId, partnerAddress, userData]);

    const isInquiry = activeBookingId !== null && activeBookingId < 0;
    const sessionLabel = isInquiry
        ? `Property #${encodePropertyId(Math.abs(activeBookingId ?? 0) - 1)}`
        : activeBookingId !== null ? `Booking #${activeBookingId}` : 'Chat';
    const statusLabel = isInquiry ? 'Pre-Booking Inquiry' : 'Direct Message';
    const displayPartner = partnerAddress ? `${partnerAddress.slice(0, 6)}...${partnerAddress.slice(-4)}` : 'Host';
    const isLoggedIn = !!userData;

    useEffect(() => {
        if (isConnected && pendingMessage) {
            sendMessage(pendingMessage);
            setPendingMessage(null);
        }
    }, [isConnected, pendingMessage, sendMessage]);

    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isLoadingHistory]);

    const handleSend = useCallback(() => {
        const text = inputValue.trim();
        if (!text || !isLoggedIn) return;
        setInputValue('');
        if (isConnected) sendMessage(text);
        else setPendingMessage(text);
    }, [inputValue, isConnected, isLoggedIn, sendMessage]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => dispatch(closeBookingChat())}
                        className="fixed inset-0 z-[100]"
                        style={{ background: 'rgba(10,18,30,0.55)', backdropFilter: 'blur(8px)' }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', damping: 28 }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="pointer-events-auto w-full max-w-2xl h-[80vh] max-h-[700px] rounded-[28px] overflow-hidden flex flex-col shadow-2xl"
                            style={{
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(245,248,255,0.98) 100%)',
                                border: '1px solid rgba(27,64,102,0.12)'
                            }}>
                            <ChatHeader
                                sessionLabel={sessionLabel} statusLabel={statusLabel}
                                isConnected={isConnected} isLoggedIn={isLoggedIn}
                                displayPartner={displayPartner} onClose={() => dispatch(closeBookingChat())}
                            />
                            <MessageArea
                                messages={messages} isLoggedIn={isLoggedIn}
                                isLoadingHistory={isLoadingHistory} isConnected={isConnected}
                                isInquiry={isInquiry} userAddress={userAddress}
                                messagesEndRef={messagesEndRef}
                            />
                            <ChatInput
                                inputValue={inputValue} setInputValue={setInputValue}
                                handleSend={handleSend} handleKeyDown={handleKeyDown}
                                isConnected={isConnected} isLoggedIn={isLoggedIn}
                                inputRef={inputRef}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ReservationChatSidebar;

