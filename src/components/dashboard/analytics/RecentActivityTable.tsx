import React from 'react';
import { Award } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import type { RecentActivityTableProps } from '@/redux/slices/redux.types';

const RecentActivityTable: React.FC<RecentActivityTableProps> = ({ bookings }) => {
    return (
        <GlassPanel className="p-6">
            <div className="flex items-center gap-2 mb-5">
                <Award size={16} className="text-[var(--c-blue-azure)]" />
                <h3 className="text-base font-medium text-[var(--t-primary)]">Recent Booking Activity</h3>
            </div>
            {bookings.length === 0 ? (
                <div className="text-center py-12 text-[var(--t-secondary)] text-sm font-sans">
                    No booking activity yet. Once guests start booking, all history will appear here.
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-4 text-[10px] uppercase tracking-widest text-[var(--t-secondary)] font-sans pb-2 border-b border-black/5">
                        <span>Booking</span>
                        <span>Property</span>
                        <span>Payout (STX)</span>
                        <span>Status</span>
                    </div>
                    {bookings.slice(0, 8).map((b, i) => (
                        <div key={i} className="grid grid-cols-4 py-3 text-sm border-b border-black/5 last:border-0 items-center hover:bg-white/30 rounded-lg px-1 transition-colors">
                            <span className="font-mono text-xs text-[var(--t-secondary)]">#{String(i + 1).padStart(3, '0')}</span>
                            <span className="text-xs font-sans text-[var(--t-secondary)]">Property #{b.propertyId}</span>
                            <span className="font-medium">{(b.hostPayout / 1_000_000).toFixed(4)}</span>
                            <span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-sans ${b.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                                    b.status === 'confirmed' ? 'bg-[#EEF3F8] text-[var(--c-blue-deep)]' :
                                        b.status === 'cancelled' ? 'bg-rose-50 text-rose-600' :
                                            'bg-amber-50 text-amber-700'
                                    }`}>
                                    {b.status}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </GlassPanel>
    );
};

export default RecentActivityTable;
