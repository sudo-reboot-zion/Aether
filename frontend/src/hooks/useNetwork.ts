import { useState, useEffect } from 'react';
import { getCurrentBlockHeight } from '@/lib/network';

export function useNetwork() {
    const [blockHeight, setBlockHeight] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHeight = async () => {
            const height = await getCurrentBlockHeight();
            setBlockHeight(height);
            setIsLoading(false);
        };

        fetchHeight();
        // Refresh every minute
        const interval = setInterval(fetchHeight, 60000);
        return () => clearInterval(interval);
    }, []);

    return { blockHeight, isLoading };
}
