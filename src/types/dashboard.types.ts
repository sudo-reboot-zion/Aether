export type Persona = 'GUEST' | 'HOST';

export interface DashboardContentProps {
    persona: Persona;
    myProperties: any[];
    myTrips: any[];
    isLoading?: boolean;
    userReviews?: any[];
}

export interface DashboardHeaderProps {
    persona: Persona;
    userName?: string;
}

export interface DashboardSidebarProps {
    persona: Persona;
    hostRequests: any[];
    myTrips: any[];
    handleRelease: (id: number) => void;
    handleDispute: (id: number) => void;
    handleResolveDispute: (bookingId: number) => void;
    handleReview?: (booking: any) => void;
    stats?: { totalReviews: number; averageRating: number } | null;
    badges?: any[];
    totalEarned?: number;
}

export interface DashboardStatsProps {
    persona: Persona;
    myProperties: any[];
    myTrips: any[];
    hostRequests?: any[];
    isLoading?: boolean;
    stats?: { totalReviews: number; averageRating: number } | null;
    badges?: any[];
}

export interface NavDockProps {
    activeItem: string;
    setActiveItem: (id: string) => void;
}

export interface StatCardProps {
    label: string;
    value: string;
    description: string;
    trend: 'up' | 'neutral' | 'down';
    trendValue: string;
}

export interface PropertyItemProps {
    id?: number;
    name: string;
    location: string;
    status: string;
    isActive: boolean;
    image: string;
    onToggle: () => void;
}

export interface RequestCardDetails {
    dates: string;
    guests: string;
    price?: string;
    status?: string;
}

export interface RequestCardProps {
    user: string;
    type: 'inquiry' | 'question' | 'booking' | 'action_required' | 'completed';
    details?: RequestCardDetails;
    quote?: string;
    onAccept?: () => void;
    onDecline?: () => void;
    onReply?: () => void;
    onRelease?: () => void;
    onDispute?: () => void;
    onResolveDispute?: () => void;
    onReview?: () => void;
}
