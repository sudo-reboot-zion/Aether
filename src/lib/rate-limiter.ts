/**
 * Global Rate Limiter for Stacks API calls
 * Ensures that we don't hit the 429 Too Many Requests limit
 * by serializing requests and enforcing a delay between them.
 */

type RequestTask<T> = () => Promise<T>;

class GlobalRateLimiter {
    private queue: { task: RequestTask<any>; resolve: (value: any) => void; reject: (reason: any) => void }[] = [];
    private activeRequests = 0;
    private maxConcurrent = 1; // Strict sequential processing to avoid Hiro rate limits
    private lastRequestTime = 0;
    private minDelay = 500; // Increased to 500ms to be more conservative with Hiro limits

    /**
     * Add a request to the queue
     */
    async add<T>(task: RequestTask<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.processQueue();
        });
    }

    /**
     * Process the queue
     */
    private async processQueue() {
        if (this.activeRequests >= this.maxConcurrent || this.queue.length === 0) {
            return;
        }

        while (this.activeRequests < this.maxConcurrent && this.queue.length > 0) {
            const item = this.queue.shift();
            if (!item) break;

            this.activeRequests++;
            this.executeTask(item);
        }
    }

    /**
     * Execute a single task with rate limiting logic and recursive retries
     */
    private async executeTask(item: { task: RequestTask<any>; resolve: (value: any) => void; reject: (reason: any) => void }): Promise<void> {
        let retryCount = 0;
        const maxRetries = 3;

        try {
            while (true) {
                try {
                    const now = Date.now();
                    const timeSinceLastRequest = now - this.lastRequestTime;
                    const timeToWait = Math.max(0, this.minDelay - timeSinceLastRequest);

                    if (timeToWait > 0) {
                        await new Promise(resolve => setTimeout(resolve, timeToWait));
                    }

                    this.lastRequestTime = Date.now();

                    const result = await item.task();
                    item.resolve(result);
                    return; // Success, exit the loop
                } catch (error: any) {
                    const errorMessage = error?.message?.toLowerCase() || error?.toString().toLowerCase() || '';
                    const isRateLimit = errorMessage.includes('429') || errorMessage.includes('too many requests');
                    const isNetworkError = errorMessage.includes('failed to fetch') ||
                        errorMessage.includes('network error') ||
                        errorMessage.includes('aborted') ||
                        errorMessage.includes('name_not_resolved');

                    if (isRateLimit || isNetworkError) {
                        if (retryCount < maxRetries) {
                            retryCount++;
                            const delay = isRateLimit ? 3000 * Math.pow(2, retryCount - 1) : 1500 * Math.pow(2, retryCount - 1);

                            console.warn(`[RateLimiter] ${isRateLimit ? '429' : 'Network error'} detected: "${errorMessage}". Retrying in ${delay}ms (Attempt ${retryCount}/${maxRetries})`);

                            await new Promise(resolve => setTimeout(resolve, delay));
                            this.lastRequestTime = Date.now();
                            continue; // Retry the loop
                        } else {
                            console.error(`[RateLimiter] Max retries reached for error: ${errorMessage}`);
                            item.reject(error);
                            return;
                        }
                    } else {
                        // Non-retryable error
                        item.reject(error);
                        return;
                    }
                }
            }
        } finally {
            this.activeRequests--;
            this.processQueue();
        }
    }
}

export const rateLimiter = new GlobalRateLimiter();
