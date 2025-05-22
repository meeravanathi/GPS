'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Plus, MapPin } from 'lucide-react';

const MapWithNoSSR = dynamic(() => import('./components/Map'), { ssr: false });

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    setIsMounted(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  const samplePins: { id: number; position: [number, number]; title: string }[] = [

    { id: 1, position: [13.0827, 80.2707], title: "Chennai" },
    { id: 2, position: [13.0500, 80.2824], title: "T Nagar" },
  ];

  return (
    <main className="relative w-screen h-screen">
       <div className="flex items-center justify-between p-2 bg-white shadow-sm z-50 relative">
           <div className=" text-xl font-bold text-purple-800">WELCOME TO GPS-V2R</div>
          <button className="p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
     <div className="flex space-x-1 bg-white z-50 relative">
          <button className="flex-1 py-2 font-medium border-b-2 border-black">Map</button>
          <button className="flex-1 py-2 text-gray-500">Satellite</button>
        </div>

      {isMounted && (
        <div className="absolute inset-0 z-0">
          <MapWithNoSSR
            pins={samplePins}
            center={[13.0827, 80.2707]}
            zoom={25}
          />
        </div>
      )}

      {/* Floating Buttons */}
      <div className="absolute bottom-24 right-4 z-10 flex flex-col items-center space-y-4">
        {/* Add My Location Button */}
        {userLocation && (
          <Link href={`/building/new?lat=${userLocation[0]}&lng=${userLocation[1]}`}>
            <button className="w-14 h-14 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center hover:bg-purple-800 transition">
              <Plus size={28} />
            </button>
          </Link>
        )}

        {/* Add Any Location Button */}
        <Link href="/map/add">
          <button className="w-14 h-14 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center hover:bg-purple-800 transition">
            <MapPin size={24} />
          </button>
        </Link>
      </div>

      {/* Optional Bottom Nav / Label */}
      <div className=" bg-white absolute bottom-0 inset-x-0 flex justify-center text-purple-800 text-sm font-medium">
        <p>
          24 H 
           </p>
      </div>
    </main>
  );
}
