import axios from 'axios';
import { createClient } from 'redis';

// Redis client setup
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis in a self-invoking async function
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected');
  } catch (err) {
    console.error('Redis connection error:', err);
  }
})();

// API configuration
const ZILLOW_API_HOST = 'zillow-com1.p.rapidapi.com';
const ZILLOW_API_KEY = '43a2077769msh0cb4c0db03f8ef2p11cb23jsn5d30363fdefe';
const CACHE_EXPIRATION = 60 * 60 * 24 * 7; // 7 days in seconds

// Rate limiting configuration
const MAX_REQUESTS_PER_SECOND = 2;
const requestTimestamps: number[] = [];

/**
 * Check if we're within rate limits
 * @returns boolean indicating if request can proceed
 */
const checkRateLimit = (): boolean => {
  const now = Date.now();
  // Remove timestamps older than 1 second
  const oneSecondAgo = now - 1000;
  const recentRequests = requestTimestamps.filter(timestamp => timestamp > oneSecondAgo);
  
  // Update the timestamps array
  requestTimestamps.length = 0;
  requestTimestamps.push(...recentRequests);
  
  // Check if we're under the rate limit
  return recentRequests.length < MAX_REQUESTS_PER_SECOND;
};

/**
 * Record a new API request timestamp for rate limiting
 */
const recordRequest = (): void => {
  requestTimestamps.push(Date.now());
};

/**
 * Create cache key from endpoint and params
 */
const createCacheKey = (endpoint: string, params: Record<string, any>): string => {
  return `zillow:${endpoint}:${JSON.stringify(params)}`;
};

/**
 * Get data from cache if available
 */
const getFromCache = async (cacheKey: string): Promise<any | null> => {
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

/**
 * Save data to cache
 */
const saveToCache = async (cacheKey: string, data: any): Promise<void> => {
  try {
    await redisClient.set(cacheKey, JSON.stringify(data), {
      EX: CACHE_EXPIRATION
    });
  } catch (error) {
    console.error('Redis set error:', error);
  }
};

/**
 * Make a request to the Zillow API with rate limiting and caching
 */
export const fetchFromZillow = async (
  endpoint: string,
  params: Record<string, any> = {}
): Promise<any> => {
  try {
    // Create cache key
    const cacheKey = createCacheKey(endpoint, params);
    
    // Try to get from cache first
    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      return cachedData;
    }
    
    // Check rate limiting
    if (!checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    // Record this request for rate limiting
    recordRequest();
    
    // Make the API request
    const response = await axios.get(`https://${ZILLOW_API_HOST}/${endpoint}`, {
      params,
      headers: {
        'X-RapidAPI-Key': ZILLOW_API_KEY,
        'X-RapidAPI-Host': ZILLOW_API_HOST
      }
    });
    
    // Save to cache
    await saveToCache(cacheKey, response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('Zillow API error:', error.message);
    throw error;
  }
};

/**
 * Search properties by location
 */
export const searchProperties = async (
  location: string,
  filters: {
    propertyType?: string;
    minBeds?: number;
    maxBeds?: number;
    minBaths?: number;
    maxBaths?: number;
    minPrice?: number;
    maxPrice?: number;
    minSqft?: number;
    maxSqft?: number;
    minYearBuilt?: number;
    maxYearBuilt?: number;
  } = {}
) => {
  const params: Record<string, any> = {
    location,
    ...filters
  };
  
  return fetchFromZillow('propertyExtendedSearch', params);
};

/**
 * Get property details by zpid
 */
export const getPropertyDetails = async (zpid: string) => {
  return fetchFromZillow('property', { zpid });
};

/**
 * Get property images by zpid
 */
export const getPropertyImages = async (zpid: string) => {
  return fetchFromZillow('images', { zpid });
};

/**
 * Get property Zestimate (value and rent estimate) by zpid
 */
export const getPropertyZestimate = async (zpid: string) => {
  return fetchFromZillow('propertyExtendedSearch', { zpid });
};

/**
 * Check if a property meets the 1% rule for rent
 * Monthly rent should be at least 1% of purchase price
 */
export const meetsRentOnePercentRule = (price: number, monthlyRent: number): boolean => {
  const ratio = (monthlyRent / price) * 100;
  return ratio >= 1.0;
};

/**
 * Check if a property meets the 1% rule for square footage
 * Square footage should be at least 1% of purchase price
 */
export const meetsSqftOnePercentRule = (price: number, sqft: number): boolean => {
  const ratio = (sqft / price) * 100;
  return ratio >= 1.0;
};

/**
 * Check if a property meets both 1% rules
 */
export const meetsCombinedRules = (price: number, monthlyRent: number, sqft: number): boolean => {
  return meetsRentOnePercentRule(price, monthlyRent) && meetsSqftOnePercentRule(price, sqft);
};

export default {
  searchProperties,
  getPropertyDetails,
  getPropertyImages,
  getPropertyZestimate,
  meetsRentOnePercentRule,
  meetsSqftOnePercentRule,
  meetsCombinedRules
};
