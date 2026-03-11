export interface NeighborhoodData {
    id: number;
    location: string;
    title: string;
    description: string;
    vibeTag: string;
    image: string;
    coordinates: [number, number];
}

export const NEIGHBORHOODS: Record<number, NeighborhoodData> = {
    1: {
        id: 1,
        location: "Paris, France",
        title: "The Haussmann Elegance",
        description: "Set within the iconic 8th Arrondissement, this sanctuary is surrounded by historic limestone facades and the whisper of the Seine. A domain where old-world majesty meets modern clarity.",
        vibeTag: "Chic Heritage",
        image: "/images/neighborhood-paris.jpg",
        coordinates: [48.8708, 2.3087] // 8th Arrondissement
    },
    2: {
        id: 2,
        location: "London, UK",
        title: "Mayfair Sophistication",
        description: "In the heart of London's most refined quarter. Garden squares, hidden galleries, and the pulse of the St. James's legacy define this urban sanctuary.",
        vibeTag: "Noble Urban",
        image: "/images/neighborhood-london.jpg",
        coordinates: [51.5100, -0.1442] // Mayfair
    },
    3: {
        id: 3,
        location: "New York, USA",
        title: "Tribeca Industrial Soul",
        description: "Where steel meets light. This sanctuary is nestled among the historic lofts and cobblestone streets of Lower Manhattan, offering a quiet pause in the world's most energetic city.",
        vibeTag: "Loft Serenity",
        image: "/images/neighborhood-nyc.jpg",
        coordinates: [40.7188, -74.0044] // Tribeca
    },
    4: {
        id: 4,
        location: "Tokyo, Japan",
        title: "The Neon Serenity",
        description: "A hidden corner of Shibuya where tradition remains untouched. This sanctuary is a masterclass in 'Ma'—the space between—balanced perfectly against the city's neon pulse.",
        vibeTag: "Zen Modernist",
        image: "/images/neighborhood-tokyo.jpg",
        coordinates: [35.6595, 139.7005] // Shibuya
    },
    5: {
        id: 5,
        location: "Bali, Indonesia",
        title: "Ubud Tropical Silence",
        description: "Rising above the Ayung River, this sanctuary is carved from the very spirit of the jungle. Bamboo architectures and the sound of falling water create a living meditation.",
        vibeTag: "Biophilic Retreat",
        image: "/images/neighborhood-bali.jpg",
        coordinates: [-8.5069, 115.2625] // Ubud
    },
    6: {
        id: 6,
        location: "Santorini, Greece",
        title: "The Cycladic Horizon",
        description: "Perched on the edge of the Oia caldera. A domain of white stone and endless blue, where the light of the Aegean defines every shadow and curve.",
        vibeTag: "Island Minimal",
        image: "/images/neighborhood-santorini.jpg",
        coordinates: [36.4618, 25.3753] // Oia
    },
    7: {
        id: 7,
        location: "Swiss Alps, Switzerland",
        title: "Alpine Respite",
        description: "High within the Zermatt peaks. This sanctuary offers a dialogue between raw granite and warm cedar, framed by the most silent horizon in Europe.",
        vibeTag: "Granite Luxury",
        image: "/images/neighborhood-alps.jpg",
        coordinates: [46.0207, 7.7491] // Zermatt
    },
    8: {
        id: 8,
        location: "Tulum, Mexico",
        title: "Mayan Riviera Soul",
        description: "A sanctuary where the jungle meets the Caribbean. Barefoot luxury defined by white sands, ancient ruins, and the soft pulse of the turquoise tide.",
        vibeTag: "Jungle Luxe",
        image: "/images/neighborhood-tulum.jpg",
        coordinates: [20.2114, -87.4654] // Tulum
    }
};

export function getNeighborhoodByLocationId(id: number): NeighborhoodData | null {
    return NEIGHBORHOODS[id] || null;
}
