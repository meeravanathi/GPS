import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../../components/Map'), {
  ssr: false,
  loading: () => <div className="h-screen w-full flex items-center justify-center">Loading map...</div>
});

const MapAddPage: React.FC = () => {
  const router = useRouter();
  const { lat, lng } = router.query;
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(2);
  const totalPages = 5;

  useEffect(() => {
    if (lat && lng) {
      setPosition([parseFloat(lat as string), parseFloat(lng as string)]);
    }
  }, [lat, lng]);

  const handlePinMove = (newPosition: [number, number]) => {
    setPosition(newPosition);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleConfirm = () => {
    if (position) {
      router.push({
        pathname: '/map/confirm',
        query: { lat: position[0], lng: position[1] }
      });
    }
  };

  if (!position) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen w-full relative">
      <div className="flex items-center justify-between p-2 bg-white shadow-sm">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        </div>
        <div className="text-lg font-semibold">Map</div>
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className="flex space-x-1 bg-white">
        <button className="flex-1 py-2 font-medium border-b-2 border-black">Map</button>
        <button className="flex-1 py-2 text-gray-500">Satellite</button>
      </div>
      
      <Map 
        center={position} 
        zoom={16} 
        draggable={true}
        onPositionChange={handlePinMove}
        showDraggablePin={true}
        instructionText="MOVE THE PIN TO CORRECT HOUSE"
      />
      
      <div className="absolute bottom-16 right-6 flex flex-col space-y-4">
        <button 
          onClick={handleConfirm} 
          className="w-12 h-12 rounded-full bg-green-100 text-green-800 flex items-center justify-center shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <button 
          onClick={handleCancel} 
          className="w-12 h-12 rounded-full bg-red-100 text-red-800 flex items-center justify-center shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full">
        {currentPage} / {totalPages}
      </div>
    </div>
  );
};

export default MapAddPage;