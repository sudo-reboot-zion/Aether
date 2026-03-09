import React from 'react';
import { Loader2, WifiOff } from 'lucide-react';
import { AetherLogo } from './AetherLogo';
import { ChatMessagePayload } from '../../hooks/useWebSocketChat';

interface MessageAreaProps {
    messages: ChatMessagePayload[];
    isLoggedIn: boolean;
    isLoadingHistory: boolean;
    isConnected: boolean;
    isInquiry: boolean;
    userAddress: string | null;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageArea: React.FC<MessageAreaProps> = ({
    messages,
    isLoggedIn,
    isLoadingHistory,
    isConnected,
    isInquiry,
    userAddress,
    messagesEndRef
}) => {
    return (
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">
            {!isLoggedIn ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-8">
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-2" style={{ background: 'rgba(27,64,102,0.06)' }}>
                        <AetherLogo className="w-9 h-9 text-[#3D7CB8]" />
                    </div>
                    <p className="font-serif text-2xl" style={{ color: '#1B4066' }}>Connect your wallet</p>
                    <p className="font-sans text-sm max-w-xs" style={{ color: '#5A7690' }}>Connect your Stacks wallet to send messages to the host.</p>
                </div>
            ) : isLoadingHistory ? (
                <div className="h-full flex flex-col items-center justify-center gap-3" style={{ color: '#5A7690' }}>
                    <Loader2 className="w-8 h-8 animate-spin opacity-50" />
                    <span className="font-sans text-xs uppercase tracking-widest">Loading messages…</span>
                </div>
            ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-8">
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5" style={{ background: 'rgba(27,64,102,0.05)' }}>
                        <AetherLogo className="w-9 h-9 text-[#3D7CB8]" />
                    </div>
                    <p className="font-serif text-2xl font-medium" style={{ color: '#1B4066' }}>Start the conversation</p>
                    <p className="font-sans text-sm mt-2 max-w-xs" style={{ color: '#5A7690' }}>
                        {isInquiry
                            ? "Ask the host any question before you book your stay."
                            : "Send a message to coordinate your upcoming stay."}
                    </p>
                    {!isConnected && (
                        <div className="mt-4 flex items-center gap-2 text-[11px] font-sans text-amber-600 bg-amber-50 border border-amber-100 px-4 py-2 rounded-full">
                            <WifiOff className="w-3 h-3" />
                            Connecting to server… you can still start typing.
                        </div>
                    )}
                </div>
            ) : (
                messages.map((msg, idx) => {
                    const isMe = msg.sender_address === userAddress;
                    return (
                        <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {!isMe && (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 font-sans text-[10px] font-bold text-white"
                                    style={{ background: 'linear-gradient(135deg, #3D7CB8, #1B4066)' }}>
                                    H
                                </div>
                            )}
                            <div className="max-w-[70%]">
                                <div
                                    className={`p-4 text-[15px] font-sans leading-relaxed ${isMe ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'}`}
                                    style={isMe
                                        ? { background: 'linear-gradient(135deg, #2457A4, #1B4066)', color: 'white' }
                                        : { background: 'rgba(27,64,102,0.05)', color: '#1B2A3D', border: '1px solid rgba(27,64,102,0.08)' }
                                    }
                                >
                                    {msg.content}
                                </div>
                                {msg.timestamp && (
                                    <div className={`text-[10px] mt-1.5 font-sans opacity-50 ${isMe ? 'text-right' : 'text-left'}`}
                                        style={{ color: '#5A7690' }}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};
