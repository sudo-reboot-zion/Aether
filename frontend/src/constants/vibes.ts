export const VIBES = [
    { id: 1, name: "Alpine", image: "/images/vibe-alpine.jpg", slug: "alpine" },
    { id: 2, name: "Coastal", image: "/images/trending-casa.jpg", slug: "coastal" },
    { id: 3, name: "Forest", image: "/images/vibe-forest.jpg", slug: "forest" },
    { id: 4, name: "Urban", image: "/images/vibe-urban.jpg", slug: "urban" },
    { id: 5, name: "Desert", image: "/images/hero-detail.jpg", slug: "desert" },
] as const;

export type VibeType = (typeof VIBES)[number]["slug"];

export function getVibeId(slug: string): number {
    const vibe = VIBES.find(v => v.slug === slug || v.name.toLowerCase() === slug.toLowerCase());
    return vibe ? vibe.id : 0;
}

export function getVibeName(id: number): string {
    const vibe = VIBES.find(v => v.id === id);
    return vibe ? vibe.name : "Unique Stays";
}
