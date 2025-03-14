import React from 'react';

interface PropertyCardProps {
  property: {
    zpid: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    images: string[];
    rentToValueRatio: number;
    sqftToValueRatio: number;
    meetsRentOnePercentRule: boolean;
    meetsSqftOnePercentRule: boolean;
  };
  onClick?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  // Determine color based on investment criteria
  const getStatusColor = () => {
    if (property.meetsRentOnePercentRule && property.meetsSqftOnePercentRule) {
      return 'bg-green-100 border-green-500';
    } else if (property.meetsRentOnePercentRule || property.meetsSqftOnePercentRule) {
      return 'bg-yellow-100 border-yellow-500';
    } else if (property.rentToValueRatio >= 0.5 || property.sqftToValueRatio >= 0.5) {
      return 'bg-yellow-50 border-yellow-300';
    } else {
      return 'bg-red-50 border-red-300';
    }
  };

  return (
    <div 
      className={`rounded-lg shadow-md overflow-hidden border-2 ${getStatusColor()} hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div className="relative h-48">
        <img 
          src={property.images[0] || '/placeholder-property.jpg'} 
          alt={property.address}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
          <p className="text-white font-bold text-lg">${property.price.toLocaleString()}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 truncate">{property.address}</h3>
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span>{property.bedrooms} bd</span>
          <span>{property.bathrooms} ba</span>
          <span>{property.squareFootage.toLocaleString()} sqft</span>
        </div>
        <div className="flex justify-between text-xs">
          <div className={`px-2 py-1 rounded ${property.meetsRentOnePercentRule ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            Rent: {(property.rentToValueRatio).toFixed(2)}%
          </div>
          <div className={`px-2 py-1 rounded ${property.meetsSqftOnePercentRule ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            Sqft: {(property.sqftToValueRatio).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
