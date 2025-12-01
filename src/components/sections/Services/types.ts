// ==========================================
// FILE: src/components/sections/Services/types.ts
// ==========================================
export interface PricingTier {
    title: string;
    price: string;
    regularPrice: string;
    description: string;
    features: string[];
    timeline: string;
    isPopular?: boolean;
    isBeta?: boolean;
}

export interface CarePlan {
    title: string;
    price: string;
    features: string[];
    isRecommended?: boolean;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface TrustBadge {
    icon: React.ReactElement;
    text: string;
}