import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    inputValue: string;
    setInputValue: (val: string) => void;
    handleSend: () => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    isConnected: boolean;
    isLoggedIn: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    inputValue,
    setInputValue,
    handleSend,
    handleKeyDown,
    isConnected,
    isLoggedIn,
    inputRef
}) => {
    return (
        <div className="px-6 py-5 shrink-0" style={{ borderTop: '1px solid rgba(27,64,102,0.08)', background: 'rgba(255,255,255,0.8)' }}>
            {!isLoggedIn ? (
                <div className="text-center font-sans text-xs py-2" style={{ color: '#5A7690' }}>
                    Connect your Stacks wallet to start chatting
                </div>
            ) : (
                <div className="flex items-center gap-3 bg-white rounded-2xl border p-2 pl-5 shadow-sm"
                    style={{ borderColor: 'rgba(27,64,102,0.15)' }}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isConnected ? "Type a message…" : "Type a message (will send when connected)…"}
                        className="flex-1 bg-transparent outline-none font-sans text-[15px] placeholder:opacity-40"
                        style={{ color: '#1B2A3D' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0"
                        style={inputValue.trim()
                            ? { background: 'linear-gradient(135deg, #3D7CB8, #1B4066)', color: 'white' }
                            : { background: 'rgba(27,64,102,0.06)', color: 'rgba(27,64,102,0.3)' }
                        }
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
            )}
        </div>
    );
};
