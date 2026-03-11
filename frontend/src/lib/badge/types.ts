// Badge Types Constants (matching the contract)
export const BADGE_TYPES = {
    FIRST_BOOKING: 1,
    FIRST_LISTING: 2,
    SUPERHOST: 3,
    FREQUENT_TRAVELER: 4,
    EARLY_ADOPTER: 5,
    PERFECT_HOST: 6,
    GLOBE_TROTTER: 7,
    TOP_EARNER: 8,
} as const;

export type BadgeType = typeof BADGE_TYPES[keyof typeof BADGE_TYPES];

export interface BadgeMetadata {
    badgeType: number;
    owner: string;
    earnedAt: number;
    metadataUri: string;
}

export interface UserBadge {
    badgeId: number;
    earned: boolean;
}

export interface BadgeTypeInfo {
    name: string;
    description: string;
    imageUri: string;
    active: boolean;
}
