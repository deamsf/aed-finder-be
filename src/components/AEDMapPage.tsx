import { useState, useEffect } from 'react';
import AEDMap, { AEDDevice } from './AEDMap';

// Sample data fetching function
const fetchAEDData = async (): Promise<AEDDevice[]> => {
  try {
    // Replace with your actual data source
    const response = await fetch('/api/aed-devices');
    if (!response.ok) {
      throw new Error('Failed to fetch AED data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching AED data:', error);
    // Return empty array or sample data for testing
    return [
      {
        "Naam": "Antwerpen Haven 50",
        "Latitude": "50.296479",
        "Longitude": "4.081347",
        "Batterijstatus (%)": "38",
        "Laatste Onderhoud": "22/02/2024",
        "Toegankelijkheid": "Private"
      },
      {
        "Naam": "Charleroi Ziekenhuis 16",
        "Latitude": "50.863507",
        "Longitude": "3.653104",
        "Batterijstatus (%)": "91",
        "Laatste Onderhoud": "29/07/2024",
        "Toegankelijkheid": "Public"
      }
    ];
  }
};

const AEDMapPage: React.FC = () => {
  const [devices, setDevices] = useState<AEDDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAEDData();
        setDevices(data);
        setError(null);
      } catch (err) {
        setError('Failed to load AED devices. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">AED Map Belgium</h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Filter:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Devices</option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
            </select>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg max-w-md">
              <p className="text-lg font-semibold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <AEDMap devices={devices} filterType={filterType} />
        )}
      </main>

      <footer className="bg-gray-100 p-3 text-center text-gray-600 text-sm">
        <p>AED Registry &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default AEDMapPage;