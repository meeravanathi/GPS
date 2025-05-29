'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Plus, MapPin, X, Eye } from 'lucide-react';

const MapWithNoSSR = dynamic(() => import('./components/Map'), { ssr: false });

interface LatestBuilding {
  id: number;
  lat: number;
  long: number;
  information: string;
  doorCount: number;
  language: string;
}

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [latestBuilding, setLatestBuilding] = useState<LatestBuilding | null>(null);
  const [showLatestGPS, setShowLatestGPS] = useState(false);
  const [loading, setLoading] = useState(false);

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

    // Fetch latest building data on component mount
    fetchLatestBuilding();
  }, []);

  const fetchLatestBuilding = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/door', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLatestBuilding(data.building);
      } else if (response.status !== 404) {
        console.error('Failed to fetch latest building');
      }
    } catch (error) {
      console.error('Error fetching latest building:', error);
    } finally {
      setLoading(false);
    }
  };

  const samplePins: { id: number; position: [number, number]; title: string }[] = [
    { id: 1, position: [13.0827, 80.2707], title: "Chennai" },
    { id: 2, position: [13.0500, 80.2824], title: "T Nagar" },
    // Add latest building as a pin if it exists
    ...(latestBuilding ? [{
      id: 999,
      position: [latestBuilding.lat, latestBuilding.long] as [number, number],
      title: `Latest: ${latestBuilding.information || 'New Building'}`
    }] : [])
  ];

  return (
    <main className="relative w-screen h-screen">
      <div className="flex items-center justify-between p-2 bg-white shadow-sm z-50 relative">
        <div className="text-xl font-bold text-purple-800">WELCOME TO GPS-V2R</div>
        <div className="flex items-center space-x-2">
          {/* Latest GPS Button */}
          {latestBuilding && (
            <button
              onClick={() => setShowLatestGPS(true)}
              className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition"
              title="View Latest GPS"
            >
              <Eye className="w-5 h-5 text-green-600" />
            </button>
          )}
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
      </div>

      <div className="flex space-x-1 bg-white z-50 relative">
        <button className="flex-1 py-2 font-medium border-b-2 border-black">Map</button>
        <button className="flex-1 py-2 text-gray-500">Satellite</button>
      </div>

      {isMounted && (
        <div className="absolute inset-0 z-0">
          <MapWithNoSSR
            pins={samplePins}
            center={latestBuilding ? [latestBuilding.lat, latestBuilding.long] : [13.0827, 80.2707]}
            zoom={25}
          />
        </div>
      )}

      {/* Latest GPS Info Popup */}
      {showLatestGPS && latestBuilding && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-purple-800">Latest Building GPS</h3>
              <button
                onClick={() => setShowLatestGPS(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-gray-700">GPS Coordinates:</span>
                <div className="text-purple-600 font-mono">
                  {latestBuilding.lat.toFixed(6)}, {latestBuilding.long.toFixed(6)}
                </div>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700">Address Info:</span>
                <div className="text-gray-800">
                  {latestBuilding.information || 'No information provided'}
                </div>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <span className="font-semibold text-gray-700">Doors:</span>
                  <span className="ml-2 text-gray-800">{latestBuilding.doorCount}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Language:</span>
                  <span className="ml-2 text-gray-800">{latestBuilding.language}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 pt-2 border-t">
                Building ID: {latestBuilding.id}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowLatestGPS(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Close
              </button>
            </div>
          </div>
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

      {/* Latest GPS Indicator */}
      {latestBuilding && (
        <div className="absolute top-20 left-4 z-10 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
          Latest GPS: {latestBuilding.lat.toFixed(4)}, {latestBuilding.long.toFixed(4)}
        </div>
      )}

      {/* Optional Bottom Nav / Label */}
      <div className="bg-white absolute bottom-0 inset-x-0 flex justify-center text-purple-800 text-sm font-medium">
        <p>24 H</p>
      </div>
    </main>
  );
}