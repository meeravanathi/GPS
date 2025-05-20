import React from 'react';

interface BuildingFormProps {
  formData: {
    gps: string;
    language: string;
    numberOfDoors: number;
    addressInfo: string;
  };
  position: [number, number];
  onFormChange: (field: string, value: any) => void;
  onGpsChange: (gps: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const BuildingForm: React.FC<BuildingFormProps> = ({ 
  formData, 
  position, 
  onFormChange, 
  onGpsChange,
  onSave, 
  onCancel 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">GPS*</label>
        <div className="flex items-center">
          <input
            type="text"
            value={formData.gps}
            onChange={(e) => onGpsChange(e.target.value)}
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
      
      <div className="h-64 border rounded-md overflow-hidden shadow-sm">
        {/* Map will be dynamically rendered here by the parent component */}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Language*</label>
        <div className="relative">
          <select
            value={formData.language}
            onChange={(e) => onFormChange('language', e.target.value)}
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
      
      <div>
        <label className="block text-sm font-medium mb-1">number of doors*</label>
        <div className="flex items-center">
          <input
            type="text"
            value={formData.numberOfDoors}
            readOnly
            className="flex-1 p-2 border rounded-md"
          />
          <button 
            onClick={() => onFormChange('numberOfDoors', Math.max(0, formData.numberOfDoors - 1))}
            className="mx-2 p-1 border rounded-md"
          >
            −
          </button>
          <button 
            onClick={() => onFormChange('numberOfDoors', formData.numberOfDoors + 1)}
            className="p-1 border rounded-md"
          >
            +
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">address info & comments*</label>
        <input
          type="text"
          value={formData.addressInfo}
          onChange={(e) => onFormChange('addressInfo', e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="e.g. Left to No.4 1st floor"
        />
      </div>
      
      <div className="flex justify-end mt-6">
        <button 
          onClick={onCancel}
          className="px-4 py-2 mr-2 bg-gray-200 rounded-md"
        >
          Cancel
        </button>
        <button 
          onClick={onSave}
          className="px-4 py-2 bg-green-100 text-green-800 rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default BuildingForm;