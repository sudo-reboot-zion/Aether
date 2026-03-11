"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
const DefaultIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div class="w-4 h-4 bg-[var(--c-blue-deep)] rounded-full border-2 border-white shadow-[0_0_15px_rgba(27,64,102,0.6)] animate-pulse"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

interface MapLocationProps {
    coordinates: [number, number];
    zoom?: number;
}

// Helper to update map view when coordinates change
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

const MapLocation: React.FC<MapLocationProps> = ({ coordinates, zoom = 13 }) => {
    return (
        <div className="w-full h-full relative group">
            <MapContainer
                center={coordinates}
                zoom={zoom}
                scrollWheelZoom={false}
                zoomControl={false}
                className="w-full h-full grayscale-[0.2] contrast-[1.1]"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <ChangeView center={coordinates} />
                <Marker position={coordinates} icon={DefaultIcon} />
            </MapContainer>

            {/* Premium Overlay for aesthetic matching */}
            <div className="absolute inset-0 pointer-events-none border-inset border-[20px] border-white/5 bg-gradient-to-b from-transparent via-transparent to-black/5 z-[400]"></div>

            {/* Subtle blueprint grid overlay similar to original design */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-[401]">
                <svg width="100%" height="100%">
                    <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#mapGrid)" />
                </svg>
            </div>
        </div>
    );
};

export default MapLocation;
