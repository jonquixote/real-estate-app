import Property from '@/models/Property';
import { connectToDatabase } from '@/lib/utils/db';

/**
 * Database operations for properties
 */
export const propertyOperations = {
  /**
   * Save a property to the database
   * If the property already exists, update it
   */
  async saveProperty(propertyData: any) {
    try {
      await connectToDatabase();
      
      const {
        zpid,
        price,
        rentZestimate,
        customRentEstimate,
        squareFootage
      } = propertyData;
      
      // Calculate investment metrics
      const rentEstimate = rentZestimate || customRentEstimate;
      const estimateSource = rentZestimate ? 'zillow' : 'custom';
      
      // Calculate ratios and rules
      const rentToValueRatio = rentEstimate ? (rentEstimate / price) * 100 : 0;
      const sqftToValueRatio = (squareFootage / price) * 100;
      const meetsRentOnePercentRule = rentToValueRatio >= 1.0;
      const meetsSqftOnePercentRule = sqftToValueRatio >= 1.0;
      const meetsCombinedRules = meetsRentOnePercentRule && meetsSqftOnePercentRule;
      
      // Add calculated fields to property data
      const enrichedPropertyData = {
        ...propertyData,
        estimateSource,
        rentToValueRatio,
        sqftToValueRatio,
        meetsRentOnePercentRule,
        meetsSqftOnePercentRule,
        meetsCombinedRules,
        lastUpdated: new Date()
      };
      
      // Update or create property
      const property = await Property.findOneAndUpdate(
        { zpid },
        enrichedPropertyData,
        { upsert: true, new: true }
      );
      
      return property;
    } catch (error) {
      console.error('Error saving property:', error);
      throw error;
    }
  },
  
  /**
   * Get a property by zpid
   */
  async getPropertyByZpid(zpid: string) {
    try {
      await connectToDatabase();
      return await Property.findOne({ zpid });
    } catch (error) {
      console.error('Error getting property by zpid:', error);
      throw error;
    }
  },
  
  /**
   * Get properties by investment criteria
   */
  async getPropertiesByInvestmentCriteria({
    rentOnePercentRule = false,
    sqftOnePercentRule = false,
    combinedRules = false,
    limit = 50,
    skip = 0
  }) {
    try {
      await connectToDatabase();
      
      let query = {};
      
      if (combinedRules) {
        query = { meetsCombinedRules: true };
      } else if (rentOnePercentRule && sqftOnePercentRule) {
        query = { 
          $or: [
            { meetsRentOnePercentRule: true },
            { meetsSqftOnePercentRule: true }
          ]
        };
      } else if (rentOnePercentRule) {
        query = { meetsRentOnePercentRule: true };
      } else if (sqftOnePercentRule) {
        query = { meetsSqftOnePercentRule: true };
      }
      
      return await Property.find(query)
        .sort({ rentToValueRatio: -1 })
        .skip(skip)
        .limit(limit);
    } catch (error) {
      console.error('Error getting properties by investment criteria:', error);
      throw error;
    }
  },
  
  /**
   * Search properties with filters
   */
  async searchProperties({
    location,
    filters = {},
    investmentCriteria = {},
    limit = 50,
    skip = 0
  }) {
    try {
      await connectToDatabase();
      
      // Build location query (city, state, or zip)
      const locationQuery = location ? {
        $or: [
          { city: { $regex: location, $options: 'i' } },
          { state: { $regex: location, $options: 'i' } },
          { zipCode: { $regex: location, $options: 'i' } },
          { address: { $regex: location, $options: 'i' } }
        ]
      } : {};
      
      // Build filters query
      const filtersQuery: any = {};
      
      if (filters.propertyType) {
        filtersQuery.propertyType = { $in: Array.isArray(filters.propertyType) ? filters.propertyType : [filters.propertyType] };
      }
      
      if (filters.bedrooms?.min) {
        filtersQuery.bedrooms = { $gte: filters.bedrooms.min };
      }
      if (filters.bedrooms?.max) {
        filtersQuery.bedrooms = { ...filtersQuery.bedrooms, $lte: filters.bedrooms.max };
      }
      
      if (filters.bathrooms?.min) {
        filtersQuery.bathrooms = { $gte: filters.bathrooms.min };
      }
      if (filters.bathrooms?.max) {
        filtersQuery.bathrooms = { ...filtersQuery.bathrooms, $lte: filters.bathrooms.max };
      }
      
      if (filters.price?.min) {
        filtersQuery.price = { $gte: filters.price.min };
      }
      if (filters.price?.max) {
        filtersQuery.price = { ...filtersQuery.price, $lte: filters.price.max };
      }
      
      if (filters.squareFootage?.min) {
        filtersQuery.squareFootage = { $gte: filters.squareFootage.min };
      }
      if (filters.squareFootage?.max) {
        filtersQuery.squareFootage = { ...filtersQuery.squareFootage, $lte: filters.squareFootage.max };
      }
      
      if (filters.yearBuilt?.min) {
        filtersQuery.yearBuilt = { $gte: filters.yearBuilt.min };
      }
      if (filters.yearBuilt?.max) {
        filtersQuery.yearBuilt = { ...filtersQuery.yearBuilt, $lte: filters.yearBuilt.max };
      }
      
      // Build investment criteria query
      const investmentQuery: any = {};
      
      // If combinedRules is true, find properties that meet EITHER rule (not just both)
      if (investmentCriteria.combinedRules) {
        investmentQuery.$or = [
          { meetsRentOnePercentRule: true },
          { meetsSqftOnePercentRule: true }
        ];
      } else {
        // Otherwise apply individual rule filters
        if (investmentCriteria.rentOnePercentRule) {
          investmentQuery.meetsRentOnePercentRule = true;
        }
        
        if (investmentCriteria.sqftOnePercentRule) {
          investmentQuery.meetsSqftOnePercentRule = true;
        }
      }
      
      // Combine all queries
      const query = {
        ...locationQuery,
        ...filtersQuery,
        ...investmentQuery
      };
      
      // Execute query
      const properties = await Property.find(query)
        .sort({ rentToValueRatio: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Property.countDocuments(query);
      
      return {
        properties,
        total,
        page: Math.floor(skip / limit) + 1,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }
};

export default propertyOperations;
