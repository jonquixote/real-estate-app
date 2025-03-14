import { useState } from 'react';
import Property from '@/models/Property';
import { connectToDatabase } from '@/lib/utils/db';

export interface RentalEstimate {
  estimatedRent: number;
  source: 'zillow' | 'custom';
  confidenceScore: number;
  comparableProperties?: Array<{
    address: string;
    rent: number;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    distance: number; // in miles
  }>;
}

export interface PropertyForEstimation {
  zpid?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt?: number;
  propertyType: string;
  latitude?: number;
  longitude?: number;
  zestimate?: number;
  rentZestimate?: number;
}

export const useRentalEstimator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<RentalEstimate | null>(null);
  
  /**
   * Get rental estimate for a property
   * Uses Zillow's rentZestimate if available, otherwise calculates a custom estimate
   */
  const estimateRent = async (property: PropertyForEstimation): Promise<RentalEstimate> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If property has a Zillow rent estimate, use it
      if (property.rentZestimate) {
        const estimate: RentalEstimate = {
          estimatedRent: property.rentZestimate,
          source: 'zillow',
          confidenceScore: 0.9, // Zillow estimates are generally reliable
          comparableProperties: [] // We'll still fetch comparables for reference
        };
        
        // Get comparable properties for reference
        const comparables = await findComparableProperties(property);
        if (comparables.length > 0) {
          estimate.comparableProperties = comparables;
          
          // Adjust confidence score based on how many comparables we found
          if (comparables.length >= 5) {
            estimate.confidenceScore = 0.95;
          } else if (comparables.length >= 3) {
            estimate.confidenceScore = 0.9;
          } else {
            estimate.confidenceScore = 0.85;
          }
        }
        
        setEstimate(estimate);
        return estimate;
      }
      
      // If no Zillow rent estimate, calculate a custom estimate
      const customEstimate = await calculateCustomRentEstimate(property);
      setEstimate(customEstimate);
      return customEstimate;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to estimate rent';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Find comparable properties within 0.5 mile radius
   */
  const findComparableProperties = async (property: PropertyForEstimation) => {
    try {
      await connectToDatabase();
      
      // If we don't have coordinates, we can't find comparables by distance
      if (!property.latitude || !property.longitude) {
        return [];
      }
      
      // Find properties within 0.5 mile radius (approximately 0.008 degrees)
      // that have similar characteristics and have a rentZestimate
      const comparableProperties = await Property.find({
        latitude: { $gte: property.latitude - 0.008, $lte: property.latitude + 0.008 },
        longitude: { $gte: property.longitude - 0.008, $lte: property.longitude + 0.008 },
        bedrooms: { $gte: property.bedrooms - 1, $lte: property.bedrooms + 1 },
        bathrooms: { $gte: property.bathrooms - 1, $lte: property.bathrooms + 1 },
        squareFootage: { $gte: property.squareFootage * 0.8, $lte: property.squareFootage * 1.2 },
        propertyType: property.propertyType,
        $or: [
          { rentZestimate: { $exists: true, $ne: null } },
          { customRentEstimate: { $exists: true, $ne: null } }
        ]
      }).limit(10);
      
      // Calculate distance and format results
      return comparableProperties.map(comp => {
        const distance = calculateDistance(
          property.latitude!,
          property.longitude!,
          comp.latitude,
          comp.longitude
        );
        
        return {
          address: comp.address,
          rent: comp.rentZestimate || comp.customRentEstimate,
          bedrooms: comp.bedrooms,
          bathrooms: comp.bathrooms,
          squareFootage: comp.squareFootage,
          distance
        };
      }).sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Error finding comparable properties:', error);
      return [];
    }
  };
  
  /**
   * Calculate custom rent estimate based on property details and comparables
   */
  const calculateCustomRentEstimate = async (property: PropertyForEstimation): Promise<RentalEstimate> => {
    // Find comparable properties
    const comparables = await findComparableProperties(property);
    
    // If we have comparables, use them to estimate rent
    if (comparables.length > 0) {
      // Calculate weighted average rent based on distance and similarity
      let totalWeight = 0;
      let weightedRentSum = 0;
      
      comparables.forEach(comp => {
        // Calculate similarity score (0-1) based on bedrooms, bathrooms, and square footage
        const bedroomSimilarity = 1 - Math.abs(property.bedrooms - comp.bedrooms) / 3;
        const bathroomSimilarity = 1 - Math.abs(property.bathrooms - comp.bathrooms) / 3;
        const sqftSimilarity = 1 - Math.abs(property.squareFootage - comp.squareFootage) / property.squareFootage;
        
        // Calculate distance weight (closer properties have higher weight)
        const distanceWeight = 1 / (1 + comp.distance * 5); // 0.5 miles away = weight of 0.29
        
        // Combined weight
        const weight = (bedroomSimilarity + bathroomSimilarity + sqftSimilarity) / 3 * distanceWeight;
        
        totalWeight += weight;
        weightedRentSum += comp.rent * weight;
      });
      
      // Calculate weighted average
      const estimatedRent = Math.round(weightedRentSum / totalWeight);
      
      // Calculate confidence score based on number and quality of comparables
      let confidenceScore = 0.5 + (comparables.length / 20); // Base confidence from 0.5 to 1.0
      
      // Adjust confidence based on average distance
      const avgDistance = comparables.reduce((sum, comp) => sum + comp.distance, 0) / comparables.length;
      if (avgDistance < 0.1) confidenceScore += 0.2;
      else if (avgDistance < 0.25) confidenceScore += 0.1;
      
      // Cap confidence score at 0.9 for custom estimates
      confidenceScore = Math.min(confidenceScore, 0.9);
      
      return {
        estimatedRent,
        source: 'custom',
        confidenceScore,
        comparableProperties: comparables
      };
    }
    
    // If no comparables, use a simple estimation model
    // This is a fallback method when we don't have good comparable data
    const estimatedRent = calculateSimpleRentEstimate(property);
    
    return {
      estimatedRent,
      source: 'custom',
      confidenceScore: 0.6, // Lower confidence without comparables
      comparableProperties: []
    };
  };
  
  /**
   * Simple rent estimation model based on property characteristics
   * This is a fallback when we don't have comparable properties
   */
  const calculateSimpleRentEstimate = (property: PropertyForEstimation): number => {
    // Base rent by property type
    let baseRent = 0;
    switch (property.propertyType) {
      case 'SINGLE_FAMILY':
        baseRent = 1500;
        break;
      case 'MULTI_FAMILY':
        baseRent = 1200;
        break;
      case 'CONDO':
        baseRent = 1300;
        break;
      case 'APARTMENT':
        baseRent = 1100;
        break;
      default:
        baseRent = 1200;
    }
    
    // Adjust for bedrooms
    baseRent += (property.bedrooms - 2) * 200; // $200 per bedroom above/below 2
    
    // Adjust for bathrooms
    baseRent += (property.bathrooms - 1) * 150; // $150 per bathroom above/below 1
    
    // Adjust for square footage
    const avgSqftPrice = 1.5; // $1.50 per sqft
    const avgSize = 1200; // Average size in sqft
    const sqftAdjustment = (property.squareFootage - avgSize) * avgSqftPrice / 100;
    baseRent += sqftAdjustment;
    
    // Adjust for property value if we have a zestimate
    if (property.zestimate) {
      // Typically, annual rent is 7-10% of property value
      const valueBasedRent = (property.zestimate * 0.08) / 12; // 8% annual, divided by 12 for monthly
      
      // Blend our base calculation with the value-based calculation
      baseRent = (baseRent + valueBasedRent) / 2;
    }
    
    return Math.round(baseRent);
  };
  
  /**
   * Calculate distance between two points using Haversine formula
   * Returns distance in miles
   */
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return parseFloat(distance.toFixed(2));
  };
  
  return {
    isLoading,
    error,
    estimate,
    estimateRent,
    findComparableProperties
  };
};
