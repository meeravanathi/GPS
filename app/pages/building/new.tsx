import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import BuildingForm from '../../components/BuildingForm';

import Map from '../../components/Map';
const BuildingNewPage: React.FC = () => {
  const router = useRouter();
  const { lat, lng } = router.query;
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [formData, setFormData] = useState({
    gps: '',
    language: 'English',
    numberOfDoors: 0,
    addressInfo: ''
  });
  const [currentPage, setCurrentPage] = useState<number>(4);
  const totalPages = 5;

  useEffect(() => {
    if (lat && lng) {
      const latFloat = parseFloat(lat as string);
      const lngFloat = parseFloat(lng as string);
      setPosition([latFloat, lngFloat]);
      setFormData(prev => ({
        ...prev,
        gps: `${latFloat.toFixed(6)}, ${lngFloat.toFixed(6)}`
      }));
    }
  }, [lat, lng]);

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    // Save the data or send to API
    router.push({
      pathname: '/building/submit',
      query: { 
        lat: position?.[0], 
        lng: position?.[1],
        doors: formData.numberOfDoors,
        address: formData.addressInfo,
        language: formData.language
      }
    });
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGpsChange = (newGps: string) => {
    setFormData(prev => ({
      ...prev,
      gps: newGps
    }));
    
    const [newLat, newLng] = newGps.split(',').map(coord => parseFloat(coord.trim()));
    if (!isNaN(newLat) && !isNaN(newLng)) {
      setPosition([newLat, newLng]);
    }
  };

  if (!position) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="flex items-center p-2 bg-white shadow-sm">
        <button onClick={handleCancel} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="flex items-center mx-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        </div>
      </div>
      
      <div className="p-4">
        <BuildingForm 
          formData={formData}
          onFormChange={handleFormChange}
          onGpsChange={handleGpsChange}
          position={position}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
      
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full">
        {currentPage} / {totalPages}
      </div>
    </div>
  );
};

export default BuildingNewPage;