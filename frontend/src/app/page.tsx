'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import the map components with no SSR
const MapWithNoSSR = dynamic(
  () => import('./components/Map'), // Correct import path
  { ssr: false }
);

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sample pins data - you can replace this with real data
  const samplePins: { id: number; position: [number, number]; title: string }[] = [
    { id: 1, position: [37.7749, -122.4194], title: "San Francisco" },
    { id: 2, position: [37.8044, -122.2712], title: "Oakland" }
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-purple-700">Welcome to GPSV2R</h1>
      <p className="text-lg text-gray-700 mb-8">Choose an action to get started:</p>

      {/* Mini Leaflet Map */}
      <div className="w-full max-w-xl h-224 mb-10 shadow-lg rounded-lg overflow-hidden">
        {isMounted && (
          <MapWithNoSSR
            pins={samplePins}
center={[13.0827, 80.2707]} // Chennai, Tamil Nadu, India
            zoom={12} // Example zoom level
          />
        )}
      </div>

      <div className="space-x-4">
        <Link href="/map"> 
          <button className="px-6 py-3 bg-purple-400 text-white  hover:bg-purple-700 transition">
            View Map
          </button>
        </Link>
        <Link href="/map/add"> 
          <button className="px-6 py-3 bg-purple-400 text-white hover:bg-purple-700 transition">
            Add New Pin
          </button>
        </Link>
        <Link href="/building/new"> 
          <button className="px-6 py-3 bg-purple-400 text-white  hover:bg-purple-700 transition">
            Add Building
          </button>
        </Link>
      </div>
    </main>
  );
}