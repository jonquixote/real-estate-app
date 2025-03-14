import React, { useState } from 'react';
import PropertyCard from '../property/PropertyCard';

interface PropertyListProps {
  properties: Array<{
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
  }>;
  loading?: boolean;
  onPropertyClick?: (property: any) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  loading = false,
  onPropertyClick 
}) => {
  const [sortBy, setSortBy] = useState<string>('rentToValueRatio');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedProperties = [...properties].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'price') {
      comparison = a.price - b.price;
    } else if (sortBy === 'bedrooms') {
      comparison = a.bedrooms - b.bedrooms;
    } else if (sortBy === 'bathrooms') {
      comparison = a.bathrooms - b.bathrooms;
    } else if (sortBy === 'squareFootage') {
      comparison = a.squareFootage - b.squareFootage;
    } else if (sortBy === 'rentToValueRatio') {
      comparison = a.rentToValueRatio - b.rentToValueRatio;
    } else if (sortBy === 'sqftToValueRatio') {
      comparison = a.sqftToValueRatio - b.sqftToValueRatio;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or location.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {properties.length} Properties Found
        </h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
          <select
            id="sort"
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="rentToValueRatio">Rent Ratio</option>
            <option value="sqftToValueRatio">Sqft Ratio</option>
            <option value="price">Price</option>
            <option value="bedrooms">Bedrooms</option>
            <option value="bathrooms">Bathrooms</option>
            <option value="squareFootage">Square Footage</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProperties.map((property) => (
          <PropertyCard
            key={property.zpid}
            property={property}
            onClick={() => onPropertyClick && onPropertyClick(property)}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
