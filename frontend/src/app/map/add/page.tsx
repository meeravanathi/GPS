'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../../components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center">Loading map...</div>
  ),
});

const MapAddPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [position, setPosition] = useState<[number, number] | null>(null);
 
  useEffect(() => {
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');

    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      console.log('URL parameters found:', lat, lng);
      setPosition([lat, lng]);
    } else {
      console.log('No URL parameters found, trying to get current position');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(
              'Got user position:',
              position.coords.latitude,
              position.coords.longitude
            );
            setPosition([position.coords.latitude, position.coords.longitude]);
          },
          (error) => {
            console.error('Error getting position:', error);
            console.log('Using default coordinates');
            setPosition([13.0827, 80.2707]); // Default coordinates (Chennai)
          }
        );
      } else {
        console.log('Geolocation not supported, using default coordinates');
        setPosition([13.0827, 80.2707]); // Default coordinates
      }
    }
  }, [searchParams]);

  const handlePinMove = (newPosition: [number, number]) => {
    setPosition(newPosition);
  };

  const handleMapDoubleClick = (latlng: [number, number]) => {
    setPosition(latlng);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleConfirm = () => {
    if (position) {
      router.push(`/map/confirm?lat=${position[0]}&lng=${position[1]}`);
    }
  };

  useEffect(() => {
    console.log('Current position:', position);
  }, [position]);

  if (!position) {
    return (
      <div className="h-screen w-full flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .leaflet-container {
          z-index: 0 !important;
        }
      `}</style>

      <div className="h-screen w-full relative">
        <div className="flex items-center justify-between p-2 bg-white shadow-sm z-50 relative">
          <div className="flex items-center"></div>
        
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

        <div style={{ position: 'relative', zIndex: 1, height: 'calc(100% - 112px)' }}>
          <Map
            center={position}
            zoom={25}
            draggable={true}
            showDraggablePin={true}
            onPositionChange={handlePinMove}
            onMapDoubleClick={handleMapDoubleClick}
          />
        </div>

        <div
          className="absolute bottom-16 right-6 flex flex-col space-y-4"
          style={{ zIndex: 9999 }}
        >
          <button
            onClick={handleConfirm}
            className="w-12 h-12 rounded-full bg-green-100 text-green-800 flex items-center justify-center shadow-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={handleCancel}
            className="w-12 h-12 rounded-full bg-red-100 text-red-800 flex items-center justify-center shadow-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
       
      </div>
    </>
  );
};

export default MapAddPage;
