import React from 'react';
import { ShieldAlert, CreditCard, Clock, CheckCircle2, Check, X, Send, Sparkles } from 'lucide-react';
import { RequestCardProps } from '@/redux/slices/redux.types';
import Identicon from '../ui/Identicon';
import { CurrencyDisplay } from '../ui/CurrencyDisplay';


const RequestCard: React.FC<RequestCardProps> = ({
    user,
    type,
    details,
    quote,
    onAccept,
    onDecline,
    onReply,
    onRelease,
    onDispute,
    onResolveDispute,
    onReview
}) => {
    const isActionable = type === 'booking' || type === 'action_required' || type === 'completed';

    return (
        <div className={`p-5 rounded-[24px] shadow-[0_8px_32px_-4px_rgba(0,0,0,0.05)] flex flex-col gap-4 border border-[rgba(255,255,255,0.4)] transition-all
            ${type === 'question' ? 'bg-[rgba(255,255,255,0.4)]' : 'bg-[var(--c-white-glass)]'}`}>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white flex items-center justify-center bg-white/5">
                        <Identicon address={user} size={40} />
                    </div>
                    <div>
                        <div className="font-medium text-sm text-[var(--t-primary)] truncate max-w-[120px]">{user}</div>
                        <div className="text-[10px] text-[var(--t-secondary)] uppercase tracking-[0.1em] font-bold flex items-center gap-1.5 pt-0.5">
                            {type === 'question' ? (
                                <><Clock className="w-2.5 h-2.5 text-blue-400" /> Inquiry</>
                            ) : type === 'booking' ? (
                                <><CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> Active Booking</>
                            ) : type === 'action_required' ? (
                                <><CreditCard className="w-2.5 h-2.5 text-orange-400" /> Payment Pending</>
                            ) : type === 'completed' ? (
                                <><Check className="w-2.5 h-2.5 text-emerald-500" /> Stay Completed</>
                            ) : (
                                <><Sparkles className="w-2.5 h-2.5 text-purple-400" /> New Request</>
                            )}
                        </div>
                    </div>
                </div>
                {details?.status && (
                    <div className="px-2 py-1 rounded-md bg-white/50 text-[9px] font-bold uppercase tracking-wider text-[var(--t-secondary)] border border-black/5">
                        {details.status}
                    </div>
                )}
            </div>

            {type === 'inquiry' && details ? (
                <>
                    <div className="bg-[var(--c-cream)]/50 rounded-xl p-3 flex justify-between text-[11px] text-[var(--t-secondary)] font-medium border border-black/5">
                        <span>{details.dates}</span>
                        <span>{details.guests} Guests</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="flex-1 h-9 rounded-full bg-[var(--c-blue-deep)] text-white text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            onClick={onAccept}
                        >
                            <Check className="w-3 h-3" /> Accept
                        </button>
                        <button
                            className="flex-1 h-9 rounded-full border border-gray-100 bg-white text-[var(--t-secondary)] text-[10px] font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            onClick={onDecline}
                        >
                            <X className="w-3 h-3" /> Decline
                        </button>
                    </div>
                </>
            ) : isActionable && details ? (
                <>
                    <div className="bg-white/40 rounded-xl p-3 space-y-2 border border-black/5">
                        <div className="flex justify-between text-[11px] text-[var(--t-secondary)]">
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {details.dates}</span>
                            <span className="font-bold text-[var(--t-primary)]">
                                {details.price !== undefined && details.price !== null ? (
                                    typeof details.price === 'number' ? (
                                        <CurrencyDisplay amount={details.price} />
                                    ) : typeof details.price === 'string' ? (
                                        <CurrencyDisplay amount={parseFloat(details.price.replace(/[^0-9.]/g, '')) || 0} />
                                    ) : (
                                        details.price
                                    )
                                ) : (
                                    '--'
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {type === 'action_required' && (
                            <button
                                className="w-full h-10 rounded-full bg-[var(--c-blue-azure)] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-blue-500/10 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                onClick={onRelease}
                            >
                                <CreditCard className="w-3 h-3" /> Release Payment
                            </button>
                        )}
                        {type === 'completed' && onReview && (
                            <button
                                className="w-full h-10 rounded-full bg-[var(--c-blue-deep)] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                onClick={onReview}
                            >
                                <Sparkles className="w-3 h-3" /> Leave Review
                            </button>
                        )}
                        {type !== 'completed' && (
                            <button
                                className="w-full h-10 rounded-full bg-white border border-red-50 text-red-500 text-[10px] font-bold uppercase tracking-wider hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                onClick={onDispute}
                            >
                                <ShieldAlert className="w-3 h-3" /> Raise Dispute
                            </button>
                        )}
                        {details.status === 'disputed' && (
                            <button
                                className="w-full h-10 rounded-full bg-[var(--c-blue-deep)] text-white text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                onClick={onResolveDispute}
                            >
                                <CheckCircle2 className="w-3 h-3" /> Resolve Dispute
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="text-xs text-[var(--t-primary)] leading-relaxed italic opacity-80 px-1 border-l-2 border-[var(--c-blue-haze)] ml-1">
                        "{quote}"
                    </div>
                    <button
                        className="w-full h-9 rounded-full bg-white border border-black/5 text-[var(--t-primary)] text-[10px] font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        onClick={onReply}
                    >
                        <Send className="w-3 h-3" /> Send Message
                    </button>
                </>
            )}
        </div>
    );
};

export default RequestCard;
