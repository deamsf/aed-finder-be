import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AEDDevice } from '../types/aed';
import AEDPanel from './AEDPanel';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for AEDs
const publicIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const privateIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Default bounds for Belgium
const DEFAULT_BOUNDS = L.latLngBounds(
  [49.5, 2.5], // Southwest corner
  [51.5, 6.4]  // Northeast corner
);

// Map configuration
const MIN_ZOOM = 7;
const MAX_ZOOM = 18;

interface AEDMapProps {
  devices: AEDDevice[];
}

const AEDMap: React.FC<AEDMapProps> = ({ devices }) => {
  const [selectedAED, setSelectedAED] = useState<AEDDevice | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  // Set up map restrictions
  useEffect(() => {
    if (map) {
      // Restrict panning to Belgium
      map.setMaxBounds(DEFAULT_BOUNDS);
      
      // Add event listener to enforce bounds
      map.on('drag', () => {
        map.panInsideBounds(DEFAULT_BOUNDS, { animate: false });
      });
    }
  }, [map]);

  // Handle centering map to Belgium
  useEffect(() => {
    if (map) {
      const handleCenterBelgium = () => {
        map.fitBounds(DEFAULT_BOUNDS);
        setSelectedAED(null); // Close panel when centering map
      };

      window.addEventListener('centerMapBelgium', handleCenterBelgium);
      return () => {
        window.removeEventListener('centerMapBelgium', handleCenterBelgium);
      };
    }
  }, [map]);

  useEffect(() => {
    if (map && selectedAED) {
      const coords = [
        parseFloat(selectedAED.Latitude),
        parseFloat(selectedAED.Longitude)
      ] as [number, number];
      
      map.setView(coords, 18);
      
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [map, selectedAED]);

  useEffect(() => {
    if (map) {
      if (devices.length > 0) {
        try {
          const bounds = L.latLngBounds(
            devices.map(device => [
              parseFloat(device.Latitude),
              parseFloat(device.Longitude)
            ])
          );
          map.fitBounds(bounds);
        } catch (error) {
          console.warn('Could not fit to device bounds, using default bounds');
          map.fitBounds(DEFAULT_BOUNDS);
        }
      } else {
        map.fitBounds(DEFAULT_BOUNDS);
      }
    }
  }, [map, devices]);

  const handleMarkerClick = (device: AEDDevice) => {
    setSelectedAED(device);
  };

  const getDeviceIcon = (device: AEDDevice) => {
    if (selectedAED && device.Naam === selectedAED.Naam) {
      return selectedIcon;
    }
    return device.Toegankelijkheid === 'Private' ? privateIcon : publicIcon;
  };

  return (
    <div className="h-full flex overflow-hidden">
      <div className={`h-full ${selectedAED ? 'flex-1' : 'w-full'}`}>
        <MapContainer
          center={[50.8503, 4.3517]}
          zoom={8}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          maxBounds={DEFAULT_BOUNDS}
          maxBoundsViscosity={1.0}
          style={{ height: '100%', width: '100%' }}
          ref={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {devices.map((device, index) => (
            <Marker
              key={`${device.Naam}-${index}`}
              position={[parseFloat(device.Latitude), parseFloat(device.Longitude)]}
              icon={getDeviceIcon(device)}
              eventHandlers={{
                click: () => handleMarkerClick(device),
              }}
            />
          ))}
        </MapContainer>
      </div>
      
      {selectedAED && (
        <div className="w-96 overflow-hidden">
          <AEDPanel
            device={selectedAED}
            onClose={() => setSelectedAED(null)}
          />
        </div>
      )}
    </div>
  );
};

export default AEDMap;