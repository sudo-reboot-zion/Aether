"use client";
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/index';
import { fetchSessions, openBookingChat, ChatSession } from '../../redux/slices/bookingChatSlice';
import { useAuth } from '../../hooks/useAuth';
import { MessageSquare, Clock, User, Home, Loader2 } from 'lucide-react';

import { useSearchParams } from 'next/navigation';

export const ChatInbox: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { stxAddress: userAddress } = useAuth();
    const { sessions, isFetchingSessions } = useSelector((state: RootState) => state.bookingChat);
    const searchParams = useSearchParams();
    const hasAutoOpened = useRef(false);

    useEffect(() => {
        if (userAddress) {
            dispatch(fetchSessions(userAddress));
        }
    }, [dispatch, userAddress]);

    // Auto-open chat if directed from elsewhere (e.g. Confirmation page)
    useEffect(() => {
        if (!isFetchingSessions && sessions.length > 0 && !hasAutoOpened.current) {
            const bookingId = searchParams.get('bookingId');
            const partnerParam = searchParams.get('partner');

            if (bookingId || partnerParam) {
                const session = sessions.find(s =>
                    (bookingId && s.booking_id.toString() === bookingId) ||
                    (partnerParam && s.partner_address.toLowerCase() === partnerParam.toLowerCase())
                );

                if (session) {
                    dispatch(openBookingChat({
                        bookingId: session.booking_id,
                        partnerAddress: session.partner_address
                    }));
                    hasAutoOpened.current = true;
                }
            }
        }
    }, [sessions, isFetchingSessions, searchParams, dispatch]);

    if (!userAddress) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white/50 rounded-3xl border border-black/5">
                <div className="w-16 h-16 rounded-2xl bg-[var(--c-blue-deep)]/5 flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-[var(--c-blue-deep)] opacity-20" />
                </div>
                <h3 className="text-xl font-serif text-[var(--t-primary)] mb-2">Connect Your Wallet</h3>
                <p className="text-sm text-[var(--t-secondary)] max-w-xs">Please connect your wallet to view your messages and inquiries.</p>
            </div>
        );
    }

    if (isFetchingSessions && sessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-24 text-[var(--t-secondary)]">
                <Loader2 className="w-8 h-8 animate-spin opacity-20 mb-3" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Synchronizing Inbox...</span>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white/50 rounded-3xl border border-black/5">
                <div className="w-16 h-16 rounded-2xl bg-[var(--c-blue-deep)]/5 flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-[var(--c-blue-deep)] opacity-20" />
                </div>
                <h3 className="text-xl font-serif text-[var(--t-primary)] mb-2">No messages yet</h3>
                <p className="text-sm text-[var(--t-secondary)] max-w-xs">When you message a host or receive an inquiry, they'll show up here.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {sessions.map((session) => {
                const isInquiry = session.is_inquiry;
                const partnerAddress = session.partner_address;
                const displayPartner = partnerAddress === 'PENDING_HOST'
                    ? 'Awaiting Host'
                    : `${partnerAddress.slice(0, 6)}...${partnerAddress.slice(-4)}`;
                const lastMsg = session.last_message;

                return (
                    <button
                        key={session.id}
                        onClick={() => dispatch(openBookingChat({
                            bookingId: session.booking_id,
                            partnerAddress: partnerAddress
                        }))}
                        className="group flex flex-col md:flex-row md:items-center gap-4 p-5 text-left bg-white border border-black/5 rounded-2xl hover:border-[var(--c-blue-azure)]/30 hover:shadow-xl hover:shadow-[var(--c-blue-deep)]/5 transition-all duration-300"
                    >
                        <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-white
                            ${isInquiry ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-[var(--c-blue-azure)] to-[var(--c-blue-deep)]'}`}>
                            {isInquiry ? <Home className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-widest
                                    ${isInquiry ? 'text-amber-600' : 'text-[var(--c-blue-deep)]'}`}>
                                    {isInquiry ? 'Property Inquiry' : `Booking #${session.booking_id}`}
                                </span>
                                {lastMsg?.timestamp && (
                                    <span className="text-[10px] text-[var(--t-secondary)] opacity-50">
                                        {new Date(lastMsg.timestamp).toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            <h4 className="text-[var(--t-primary)] font-medium text-sm mb-1 flex items-center gap-2">
                                <span className="opacity-60 text-xs">With</span>
                                {displayPartner}
                            </h4>

                            <p className="text-xs text-[var(--t-secondary)] truncate opacity-80 group-hover:opacity-100 transition-opacity">
                                {lastMsg ? lastMsg.content : 'No messages yet in this conversation.'}
                            </p>
                        </div>

                        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                            <div className="w-8 h-8 rounded-full bg-[var(--c-blue-azure)]/10 flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-[var(--c-blue-deep)]" />
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
