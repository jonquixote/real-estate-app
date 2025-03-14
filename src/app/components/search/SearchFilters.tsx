import React, { useState } from 'react';
import { PropertyFilters, InvestmentCriteria } from '@/lib/hooks/usePropertyFilters';

interface SearchFiltersProps {
  filters: PropertyFilters;
  investmentCriteria: InvestmentCriteria;
  onUpdateFilters: (filters: Partial<PropertyFilters>) => void;
  onUpdateInvestmentCriteria: (criteria: Partial<InvestmentCriteria>) => void;
  onResetFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  investmentCriteria,
  onUpdateFilters,
  onUpdateInvestmentCriteria,
  onResetFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const propertyTypes = [
    { value: 'SINGLE_FAMILY', label: 'Single Family' },
    { value: 'MULTI_FAMILY', label: 'Multi Family' },
    { value: 'CONDO', label: 'Condo' },
    { value: 'TOWNHOUSE', label: 'Townhouse' },
    { value: 'APARTMENT', label: 'Apartment' },
  ];

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    
    const currentTypes = filters.propertyType || [];
    let newTypes;
    
    if (isChecked) {
      newTypes = [...currentTypes, value];
    } else {
      newTypes = currentTypes.filter(type => type !== value);
    }
    
    onUpdateFilters({ propertyType: newTypes });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <div className="mb-4">
        <h3 className="font-medium text-gray-700 mb-2">Investment Criteria</h3>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={investmentCriteria.rentOnePercentRule}
              onChange={(e) => onUpdateInvestmentCriteria({ rentOnePercentRule: e.target.checked })}
            />
            <span className="ml-2 text-gray-700">Rent 1% Rule</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={investmentCriteria.sqftOnePercentRule}
              onChange={(e) => onUpdateInvestmentCriteria({ sqftOnePercentRule: e.target.checked })}
            />
            <span className="ml-2 text-gray-700">Sqft 1% Rule</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={investmentCriteria.combinedRules}
              onChange={(e) => onUpdateInvestmentCriteria({ combinedRules: e.target.checked })}
            />
            <span className="ml-2 text-gray-700">Either Rule (Combined)</span>
          </label>
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Property Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {propertyTypes.map((type) => (
                <label key={type.value} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    value={type.value}
                    checked={filters.propertyType?.includes(type.value) || false}
                    onChange={handlePropertyTypeChange}
                  />
                  <span className="ml-2 text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Price Range</h3>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Min</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Min Price"
                    value={filters.price?.min || ''}
                    onChange={(e) => onUpdateFilters({ price: { ...filters.price, min: e.target.value ? Number(e.target.value) : undefined } })}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Max</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Max Price"
                    value={filters.price?.max || ''}
                    onChange={(e) => onUpdateFilters({ price: { ...filters.price, max: e.target.value ? Number(e.target.value) : undefined } })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Bedrooms</h3>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Min</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Min Beds"
                    value={filters.bedrooms?.min || ''}
                    onChange={(e) => onUpdateFilters({ bedrooms: { ...filters.bedrooms, min: e.target.value ? Number(e.target.value) : undefined } })}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Max</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Max Beds"
                    value={filters.bedrooms?.max || ''}
                    onChange={(e) => onUpdateFilters({ bedrooms: { ...filters.bedrooms, max: e.target.value ? Number(e.target.value) : undefined } })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Bathrooms</h3>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Min</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Min Baths"
                    value={filters.bathrooms?.min || ''}
                    onChange={(e) => onUpdateFilters({ bathrooms: { ...filters.bathrooms, min: e.target.value ? Number(e.target.value) : undefined } })}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Max</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Max Baths"
                    value={filters.bathrooms?.max || ''}
                    onChange={(e) => onUpdateFilters({ bathrooms: { ...filters.bathrooms, max: e.target.value ? Number(e.target.value) : undefined } })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Square Footage</h3>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Min</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Min Sqft"
                    value={filters.squareFootage?.min || ''}
                    onChange={(e) => onUpdateFilters({ squareFootage: { ...filters.squareFootage, min: e.target.value ? Number(e.target.value) : undefined } })}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Max</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Max Sqft"
                    value={filters.squareFootage?.max || ''}
                    onChange={(e) => onUpdateFilters({ squareFootage: { ...filters.squareFootage, max: e.target.value ? Number(e.target.value) : undefined } })}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <button
          onClick={onResetFilters}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
        >
          Reset
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
