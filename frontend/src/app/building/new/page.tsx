'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import BuildingForm from '../../components/BuildingForm';

const Map = dynamic(() => import('../../components/Map'), {
  ssr: false,
  loading: () => <div className="h-64 w-full flex items-center justify-center">Loading map...</div>
});

const BuildingNewPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [formData, setFormData] = useState({
    gps: '',
    language: 'English',
    numberOfDoors: 1,
    addressInfo: ['']
  });

  useEffect(() => {
    if (latParam && lngParam) {
      const latFloat = parseFloat(latParam);
      const lngFloat = parseFloat(lngParam);
      setPosition([latFloat, lngFloat]);
      setFormData(prev => ({
        ...prev,
        gps: `${latFloat.toFixed(6)}, ${lngFloat.toFixed(6)}`
      }));
    }
  }, [latParam, lngParam]);

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    if (!position) return;
    const addressParams = formData.addressInfo
      .map((addr, i) => `address${i + 1}=${encodeURIComponent(addr)}`)
      .join('&');

    router.push(
      `/building/submit?lat=${position[0]}&lng=${position[1]}&doors=${formData.numberOfDoors}&${addressParams}&language=${encodeURIComponent(formData.language)}`
    );
  };

  const handleFormChange = (field: string, value: string | number, index?: number) => {
    if (field === 'addressInfo' && typeof index === 'number') {
      const newAddresses = [...formData.addressInfo];
      newAddresses[index] = value as string;
      setFormData(prev => ({
        ...prev,
        addressInfo: newAddresses
      }));
    } else if (field === 'numberOfDoors') {
      const newDoorCount = Number(value);
      const updatedAddresses = [...formData.addressInfo];
      while (updatedAddresses.length < newDoorCount) updatedAddresses.push('');
      while (updatedAddresses.length > newDoorCount) updatedAddresses.pop();
      setFormData(prev => ({
        ...prev,
        numberOfDoors: newDoorCount,
        addressInfo: updatedAddresses
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
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
      <div className="flex items-center p-2 bg-purple-300 shadow-sm">
        <button onClick={handleCancel} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
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
    </div>
  );
};

export default BuildingNewPage;
