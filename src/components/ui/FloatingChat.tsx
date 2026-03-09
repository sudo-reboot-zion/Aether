'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/index';
import { toggleChat, addUserMessage, sendMessageAPI } from '../../redux/slices/chatSlice';
import GlassPanel from './GlassPanel';

const FloatingChat = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isOpen, messages, isLoading, suggestedActions } = useSelector((state: RootState) => state.chat);

    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isLoading]);

    const handleSend = () => {
        if (!inputValue.trim() || isLoading) return;

        // Dispatch to add the user message locally right away
        const messageText = inputValue;
        dispatch(addUserMessage(messageText));
        setInputValue('');

        // Dispatch the API thunk
        dispatch(sendMessageAPI(messageText));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const handleSuggestedAction = (action: string) => {
        if (isLoading) return;
        dispatch(addUserMessage(action));
        dispatch(sendMessageAPI(action));
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {/* FAB Button */}
            <button
                className="bg-white/45 backdrop-blur-[24px] border border-white/40 w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all duration-300 group"
                onClick={() => dispatch(toggleChat())}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#1B4066]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#1B4066] group-hover:text-[#3D7CB8] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                )}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <GlassPanel className="absolute bottom-20 right-0 w-80 h-[500px] shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-black/5 bg-white/30 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3D7CB8] to-[#1B4066] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-serif text-base text-[#1B4066]">Aether Assistant</div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="font-sans text-[10px] uppercase tracking-wider text-[#5A7690]">Online</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                        {messages.map((msg, index) => (
                            <div key={msg.id || index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm font-sans leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-[#3D7CB8] to-[#1B4066] text-white rounded-tr-none'
                                    : 'bg-white/60 border border-white/40 text-[#1B4066] rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[85%] rounded-2xl rounded-tl-none p-3 bg-white/60 border border-white/40 text-[#1B4066] text-sm shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-[#1B4066]/50 animate-bounce"></div>
                                        <div className="w-2 h-2 rounded-full bg-[#1B4066]/50 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-[#1B4066]/50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested Actions (Shows only when not loading, user hasn't typed anything, and at bottom) */}
                    {!isLoading && suggestedActions.length > 0 && messages[messages.length - 1]?.role !== 'user' && (
                        <div className="px-4 pb-2 flex flex-col gap-2">
                            {suggestedActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSuggestedAction(action)}
                                    className="bg-white/45 backdrop-blur-[24px] border border-[#3D7CB8]/20 px-3 py-1.5 rounded-lg text-xs font-sans text-[#1B4066] hover:bg-[#3D7CB8]/10 hover:border-[#3D7CB8]/50 transition-all text-left font-medium line-clamp-1"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-3 border-t border-black/5 bg-white/30 backdrop-blur-md">
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                placeholder="Ask about properties, fees..."
                                className="w-full bg-white/60 border border-white/40 rounded-xl pl-4 pr-10 py-2 text-sm text-[#1B4066] placeholder:text-[#5A7690]/60 focus:outline-none focus:ring-1 focus:ring-[#3D7CB8]/50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !inputValue.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#3D7CB8] hover:text-[#1B4066] disabled:opacity-50 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </GlassPanel>
            )}
        </div>
    );
};

export default FloatingChat;
