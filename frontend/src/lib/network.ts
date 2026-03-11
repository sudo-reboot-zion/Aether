import { STACKS_API_URL } from './config';

export async function getCurrentBlockHeight(): Promise<number> {
    try {
        const response = await fetch(`${STACKS_API_URL}/extended/v1/block?limit=1`);
        if (!response.ok) return 0;
        const data = await response.json();
        return data.results[0]?.height || 0;
    } catch (error) {
        console.error("Error fetching block height:", error);
        return 0;
    }
}

export async function getNetworkStatus() {
    try {
        const response = await fetch(`${STACKS_API_URL}/v2/info`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching network status:", error);
        return null;
    }
}
