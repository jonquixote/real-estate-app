import React, { useState, useEffect } from 'react';

interface Property {
  zpid: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  meetsRentOnePercentRule: boolean;
  meetsSqftOnePercentRule: boolean;
  rentToValueRatio: number;
  sqftToValueRatio: number;
}

interface SimpleMapProps {
  properties: Property[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (property: Property) => void;
}

const SimpleMap: React.FC<SimpleMapProps> = ({
  properties,
  center = { lat: 30.2672, lng: -97.7431 }, // Default to Austin, TX
  zoom = 10,
  onMarkerClick
}) => {
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // We're using a simple map implementation without Mapbox
  // This will render a basic map with property markers
  
  useEffect(() => {
    // In a real implementation, this would initialize a map library
    setMapInitialized(true);
  }, []);

  // Get marker color based on investment criteria
  const getMarkerColor = (property: Property) => {
    if (property.meetsRentOnePercentRule && property.meetsSqftOnePercentRule) {
      return '#10B981'; // Green
    } else if (property.meetsRentOnePercentRule || property.meetsSqftOnePercentRule) {
      return '#FBBF24'; // Yellow
    } else if (property.rentToValueRatio >= 0.5 || property.sqftToValueRatio >= 0.5) {
      return '#FCD34D'; // Light Yellow
    } else {
      return '#EF4444'; // Red
    }
  };

  if (!mapInitialized) {
    return (
      <div className="bg-gray-100 rounded-lg shadow-md p-4 h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Property Map</h2>
        <p className="text-sm text-gray-600">
          {properties.length} properties shown on map
        </p>
      </div>
      
      {/* Simple map visualization */}
      <div className="relative h-96 bg-blue-50">
        {/* Map container - in a real implementation, this would be replaced with a map library */}
        <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-gray-700 mb-4">
              Map visualization would display here with {properties.length} properties
            </p>
            <p className="text-sm text-gray-600 mb-2">Color Legend:</p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-1"></div>
                <span className="text-xs">Meets both rules</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-1"></div>
                <span className="text-xs">Meets one rule</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-1"></div>
                <span className="text-xs">Below threshold</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Property markers */}
        <div className="absolute inset-0 pointer-events-none">
          {properties.map((property) => (
            <div 
              key={property.zpid}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${Math.random() * 80 + 10}%`, 
                top: `${Math.random() * 80 + 10}%`,
                pointerEvents: 'auto'
              }}
              onClick={() => onMarkerClick && onMarkerClick(property)}
            >
              <div 
                className="w-4 h-4 rounded-full cursor-pointer hover:w-5 hover:h-5 transition-all duration-200"
                style={{ backgroundColor: getMarkerColor(property) }}
                title={`${property.address} - $${property.price.toLocaleString()}`}
              ></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex justify-between">
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            Zoom In
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            Zoom Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;
