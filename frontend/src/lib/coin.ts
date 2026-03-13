/**
 * Service for fetching and caching STX price from CoinGecko
 */

const STX_COINGECKO_ID = 'blockstack';
const PRICE_CACHE_KEY = 'aether_stx_price';
const PRICE_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CachedPrice {
    usd: number;
    timestamp: number;
}

export async function fetchSTXPrice(): Promise<number> {
    // 1. Check local cache
    try {
        const cached = localStorage.getItem(PRICE_CACHE_KEY);
        if (cached) {
            const { usd, timestamp }: CachedPrice = JSON.parse(cached);
            if (Date.now() - timestamp < PRICE_CACHE_EXPIRY) {
                return usd;
            }
        }
    } catch (e) {
        console.warn('Failed to read price cache:', e);
    }

    // 2. Fetch from CoinGecko
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${STX_COINGECKO_ID}&vs_currencies=usd`
        );

        if (!response.ok) {
            throw new Error('CoinGecko API failure');
        }

        const data = await response.json();
        const price = data[STX_COINGECKO_ID].usd;

        // 3. Update cache
        localStorage.setItem(
            PRICE_CACHE_KEY,
            JSON.stringify({ usd: price, timestamp: Date.now() })
        );

        return price;
    } catch (error) {
        console.error('Error fetching STX price:', error);

        // Fallback to cached price if available, even if expired
        try {
            const cached = localStorage.getItem(PRICE_CACHE_KEY);
            if (cached) {
                return JSON.parse(cached).usd;
            }
        } catch (e) { }

        // Absolute fallback (conservative estimate)
        return 2.50;
    }
}
