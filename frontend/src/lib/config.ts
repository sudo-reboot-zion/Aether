import { STACKS_TESTNET, STACKS_MAINNET } from "@stacks/network";
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STX_CONTRACT_ADDRESS || "ST34YG65NE0547H4GSNB00HKA2VGCWXDS5HJQ57C7";

export const NETWORK_TYPE = process.env.NEXT_PUBLIC_STX_NETWORK || 'testnet';
export const NETWORK = NETWORK_TYPE === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

// Stacks API base URL
export const STACKS_API_URL = NETWORK_TYPE === 'mainnet'
    ? 'https://api.mainnet.hiro.so'
    : 'https://api.testnet.hiro.so';


export const CONTRACTS = {
    BADGE: "badge",
    REPUTATION: "reputation",
    ESCROW: "escrow",
    DISPUTE: "dispute",
    PROFILE: "profile",
} as const;

export const APP_CONFIG = {
    POLL_INTERVAL_MS: 3000,
    MAX_PENDING_TIME_MS: 10 * 60 * 1000, // 10 minutes
    PLATFORM_FEE_PERCENT: 2,
} as const;

