export const LOCATIONS = [
    { id: 1, name: "Paris, France" },
    { id: 2, name: "London, UK" },
    { id: 3, name: "New York, USA" },
    { id: 4, name: "Tokyo, Japan" },
    { id: 5, name: "Bali, Indonesia" },
    { id: 6, name: "Santorini, Greece" },
    { id: 7, name: "Swiss Alps, Switzerland" },
    { id: 8, name: "Tulum, Mexico" },
] as const;

export function getLocationId(name: string): number {
    const loc = LOCATIONS.find(l => l.name.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(l.name.toLowerCase()));
    return loc ? loc.id : 0; // 0 as fallback
}

export function getLocationName(id: number): string {
    const loc = LOCATIONS.find(l => l.id === id);
    return loc ? loc.name : "Unknown Location";
}
