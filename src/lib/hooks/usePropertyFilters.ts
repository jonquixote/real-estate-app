import { useState } from 'react';

interface FilterRange {
  min?: number;
  max?: number;
}

export interface PropertyFilters {
  propertyType?: string[];
  bedrooms?: FilterRange;
  bathrooms?: FilterRange;
  price?: FilterRange;
  squareFootage?: FilterRange;
  yearBuilt?: FilterRange;
  additionalFeatures?: string[];
}

export interface InvestmentCriteria {
  rentOnePercentRule: boolean;
  sqftOnePercentRule: boolean;
  combinedRules: boolean;
  thresholdApproaching: boolean;
  thresholdQuantity: number;
}

interface UsePropertyFiltersProps {
  initialFilters?: PropertyFilters;
  initialInvestmentCriteria?: InvestmentCriteria;
}

export const usePropertyFilters = ({
  initialFilters = {},
  initialInvestmentCriteria = {
    rentOnePercentRule: true,
    sqftOnePercentRule: false,
    combinedRules: false,
    thresholdApproaching: false,
    thresholdQuantity: 25
  }
}: UsePropertyFiltersProps = {}) => {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const [investmentCriteria, setInvestmentCriteria] = useState<InvestmentCriteria>(initialInvestmentCriteria);
  
  const updatePropertyType = (propertyTypes: string[]) => {
    setFilters(prev => ({
      ...prev,
      propertyType: propertyTypes
    }));
  };
  
  const updateBedroomRange = (range: FilterRange) => {
    setFilters(prev => ({
      ...prev,
      bedrooms: range
    }));
  };
  
  const updateBathroomRange = (range: FilterRange) => {
    setFilters(prev => ({
      ...prev,
      bathrooms: range
    }));
  };
  
  const updatePriceRange = (range: FilterRange) => {
    setFilters(prev => ({
      ...prev,
      price: range
    }));
  };
  
  const updateSquareFootageRange = (range: FilterRange) => {
    setFilters(prev => ({
      ...prev,
      squareFootage: range
    }));
  };
  
  const updateYearBuiltRange = (range: FilterRange) => {
    setFilters(prev => ({
      ...prev,
      yearBuilt: range
    }));
  };
  
  const updateAdditionalFeatures = (features: string[]) => {
    setFilters(prev => ({
      ...prev,
      additionalFeatures: features
    }));
  };
  
  const updateInvestmentCriteria = (criteria: Partial<InvestmentCriteria>) => {
    setInvestmentCriteria(prev => ({
      ...prev,
      ...criteria
    }));
  };
  
  const resetFilters = () => {
    setFilters({});
  };
  
  const resetInvestmentCriteria = () => {
    setInvestmentCriteria({
      rentOnePercentRule: true,
      sqftOnePercentRule: false,
      combinedRules: false,
      thresholdApproaching: false,
      thresholdQuantity: 25
    });
  };
  
  const resetAll = () => {
    resetFilters();
    resetInvestmentCriteria();
  };
  
  return {
    filters,
    investmentCriteria,
    updatePropertyType,
    updateBedroomRange,
    updateBathroomRange,
    updatePriceRange,
    updateSquareFootageRange,
    updateYearBuiltRange,
    updateAdditionalFeatures,
    updateInvestmentCriteria,
    resetFilters,
    resetInvestmentCriteria,
    resetAll
  };
};
