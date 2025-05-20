import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <div className="h-64 w-full flex items-center justify-center">Loading map...</div>
});

const BuildingSubmitPage: React.FC = () => {
  const router = useRouter();
  const { lat, lng, doors, address, language } = router.query;
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [formData, setFormData] = useState({
    gps: '',
    language: '',
    numberOfDoors: 0,
    addressInfo: ''
  });
  const [currentPage, setCurrentPage] = useState<number>(5);
  const totalPages = 5;
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (lat && lng) {
      const latFloat = parseFloat(lat as string);
      const lngFloat = parseFloat(lng as string);
      setPosition([latFloat, lngFloat]);
      
      setFormData({
        gps: `${latFloat.toFixed(6)}, ${lngFloat.toFixed(6)}`,
        language: (language as string) || 'English',
        numberOfDoors: parseInt((doors as string) || '0', 10),
        addressInfo: (address as string) || ''
      });
    }
  }, [lat, lng, doors, address, language]);

  const handleReturnToHome = () => {
    router.push('/map');
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

  const handleSave = () => {
    // Here you would normally send data to your backend
    // For now, let's just show a success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      router.push('/map');
    }, 2000);
  };

  if (!position) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="flex items-center p-2 bg-white shadow-sm">
        <button onClick={handleReturnToHome} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="flex items-center mx-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        </div>
        <div className="text-red-500 font-semibold ml-2">
          EDIT GPS during 24 hours possible
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">GPS*</label>
          <div className="flex items-center">
            <input
              type="text"
              value={formData.gps}
              onChange={(e) => handleGpsChange(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <div className="ml-2">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="mb-4 border rounded-md overflow-hidden">
          {position && (
            <Map 
              center={position} 
              zoom={16}
              height="200px"
              draggable={true}
              showMarker={true}
              markerPosition={position}
              onPositionChange={(pos) => {
                setPosition(pos);
                setFormData(prev => ({
                  ...prev,
                  gps: `${pos[0].toFixed(6)}, ${pos[1].toFixed(6)}`
                }));
              }}
            />
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Language*</label>
          <div className="relative">
            <select
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              className="w-full p-2 border rounded-md appearance-none"
            >
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
              <option value="Hindi">Hindi</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">number of doors*</label>
          <div className="flex items-center">
            <input
              type="text"
              value={formData.numberOfDoors}
              readOnly
              className="flex-1 p-2 border rounded-md"
            />
            <button 
              onClick={() => setFormData(prev => ({ ...prev, numberOfDoors: Math.max(0, prev.numberOfDoors - 1) }))}
              className="mx-2 p-1 border rounded-md"
            >
              −
            </button>
            <button 
              onClick={() => setFormData(prev => ({ ...prev, numberOfDoors: prev.numberOfDoors + 1 }))}
              className="p-1 border rounded-md"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">address info & comments*</label>
          <input
            type="text"
            value={formData.addressInfo}
            onChange={(e) => setFormData(prev => ({ ...prev, addressInfo: e.target.value }))}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div className="flex justify-end mt-6">
          <button onClick={handleReturnToHome} className="px-4 py-2 mr-2 bg-gray-200 rounded-md">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-100 text-green-800 rounded-md">
            Save
          </button>
        </div>
      </div>
      
      {showSuccessMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <p className="text-green-600 font-bold">Building saved successfully!</p>
          </div>
        </div>
      )}
      
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full">
        {currentPage} / {totalPages}
      </div>
    </div>
  );
};

export default BuildingSubmitPage;