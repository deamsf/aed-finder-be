import React, { useState } from 'react';
import AEDMap from './components/AEDMap';
import aedData from './data/aed_data.json';
import { MapPin, Map, AlertCircle } from 'lucide-react';

type FilterType = 'all' | 'public' | 'private';

function App() {
  const [filterType, setFilterType] = useState<FilterType>('all');

  const filteredDevices = aedData.devices.filter(device => {
    if (filterType === 'all') return true;
    if (filterType === 'private') return device.Toegankelijkheid === 'Private';
    if (filterType === 'public') return device.Toegankelijkheid === 'Public';
    return true;
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm p-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">AED Finder</h1>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-md border border-amber-200">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">POC met dummy data</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Alle AEDs</option>
              <option value="public">Alleen publiek</option>
              <option value="private">Alleen privaat</option>
            </select>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('centerMapBelgium'))}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Map className="w-4 h-4" />
              <span>Centreer kaart</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <AEDMap devices={filteredDevices} />
      </main>
    </div>
  );
}

export default App;