import { useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { confirmTx, failTx, timeoutTx, PendingTx, removeTx } from '@/redux/slices/pendingTxSlice';
import { confirmOptimisticProperty, removeOptimisticProperty } from '@/redux/slices/propertiesSlice';
import { invalidateUserBadges } from '@/redux/slices/badgesSlice';
import { invalidateUserStats } from '@/redux/slices/reputationSlice';
import { useAuth } from './useAuth';
import { APP_CONFIG, STACKS_API_URL } from '@/lib/config';
import { rateLimiter } from '@/lib/rate-limiter';

export function useTxPoller() {
    const POLL_INTERVAL_MS = APP_CONFIG.POLL_INTERVAL_MS;
    const MAX_PENDING_TIME_MS = APP_CONFIG.MAX_PENDING_TIME_MS;
    const dispatch = useDispatch();
    const allTxs = useSelector((state: RootState) => state.pendingTx.transactions);
    const pendingTxs = useMemo(() => allTxs.filter(tx => tx.status === 'pending'), [allTxs]);
    const pollerRefs = useRef<Record<string, NodeJS.Timeout>>({});
    const { stxAddress } = useAuth();

    const pollTx = async (tx: PendingTx) => {
        // Stop if it's been pending too long
        if (Date.now() - tx.submittedAt > MAX_PENDING_TIME_MS) {
            console.warn(`🕒 Transaction ${tx.txId} timed out`);
            dispatch(timeoutTx(tx.txId));

            // Clean up optimistic property if it exists
            const tempId = tx.optimisticData?.tempId as number;
            if (tempId) {
                dispatch(removeOptimisticProperty(tempId));
            }
            return;
        }

        try {
            const data = await rateLimiter.add(async () => {
                const response = await fetch(`${STACKS_API_URL}/extended/v1/tx/${tx.txId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch tx: ${response.status}`);
                }
                return await response.json();
            });

            if (data.tx_status === 'success') {
                console.log(`Transaction ${tx.txId} confirmed!`);
                dispatch(confirmTx(tx.txId));

                if (tx.type === 'badge' && stxAddress) {
                    // Force a re-fetch of badges for the user
                    dispatch(invalidateUserBadges(stxAddress));
                }

                if (tx.type === 'review' && tx.optimisticData?.reviewee) {
                    // Force a re-fetch of stats for the host who was reviewed
                    dispatch(invalidateUserStats(tx.optimisticData.reviewee as string));
                }

                if (tx.type === 'listing' && tx.optimisticData?.tempId) {
                    // Note: Ideally we'd get the real ID from the transaction result/logs
                    // But for simple sync, we just mark it as not optimistic anymore
                    dispatch(confirmOptimisticProperty({
                        tempId: tx.optimisticData.tempId as number,
                        realId: 0 // We might not have the real index yet, but confirmOptimisticProperty needs one
                    }));
                }
            } else if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
                console.error(`Transaction ${tx.txId} failed:`, data.tx_status);
                dispatch(failTx(tx.txId));

                // Remove optimistic property on failure
                if (tx.optimisticData?.tempId) {
                    dispatch(removeOptimisticProperty(tx.optimisticData.tempId as number));
                }
            }
        } catch (error) {
            console.error(`Error polling tx ${tx.txId}:`, error);
        }
    };

    useEffect(() => {
        // Start pollers for new pending transactions
        pendingTxs.forEach(tx => {
            if (!pollerRefs.current[tx.txId]) {
                console.log(`Starting poller for tx: ${tx.txId}`);
                pollerRefs.current[tx.txId] = setInterval(() => pollTx(tx), POLL_INTERVAL_MS);
            }
        });

        // Cleanup pollers for transactions that are no longer pending
        Object.keys(pollerRefs.current).forEach(txId => {
            if (!pendingTxs.find(tx => tx.txId === txId)) {
                console.log(` Stopping poller for tx: ${txId}`);
                clearInterval(pollerRefs.current[txId]);
                delete pollerRefs.current[txId];
            }
        });

        return () => {
            // We don't want to clear all on unmount because the poller 
            // lives as long as the component using this hook.
            // If this is used in a global layout, it stays alive.
        };
    }, [pendingTxs]);
}
