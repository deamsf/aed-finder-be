import React from 'react';
import { X, Navigation2 } from 'lucide-react';
import { AEDDevice } from '../types/aed';

interface AEDPanelProps {
  device: AEDDevice;
  onClose: () => void;
}

const AEDPanel: React.FC<AEDPanelProps> = ({ device, onClose }) => {
  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${device.Latitude},${device.Longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="h-full bg-white shadow-lg p-6 overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">{device.Naam}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Batterij Status</p>
          <p className="font-medium">{device['Batterijstatus (%)']}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Laatste Onderhoud</p>
          <p className="font-medium">{device['Laatste Onderhoud']}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Toegankelijkheid</p>
          <p className={`font-medium ${device['niet publiek'] === true ? 'text-red-600' : 'text-green-600'}`}>
            {device['niet publiek'] === true ? 'Privaat' : 'Publiek'}
          </p>
        </div>
      </div>

      <button
        onClick={handleNavigate}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
      >
        <Navigation2 className="w-5 h-5" />
        Navigeer hier naartoe
      </button>
    </div>
  );
};

export default AEDPanel;