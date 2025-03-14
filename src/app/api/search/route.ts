import { NextResponse } from 'next/server';
import { searchProperties } from '@/services/zillow-api';
import propertyOperations from '@/services/property-operations';
import { connectToDatabase } from '@/lib/utils/db';
import SearchHistory from '@/models/SearchHistory';

export async function POST(request: Request) {
  try {
    const { 
      location, 
      filters = {}, 
      investmentCriteria = {
        rentOnePercentRule: true,
        sqftOnePercentRule: false,
        combinedRules: false,
        thresholdApproaching: false,
        thresholdQuantity: 25
      },
      page = 1,
      pageSize = 10,
      userId = null
    } = await request.json();

    if (!location) {
      return NextResponse.json({
        success: false,
        message: 'Location is required'
      }, { status: 400 });
    }

    // Connect to database
    await connectToDatabase();

    // Check if we have recent results in the database
    const dbResults = await propertyOperations.searchProperties({
      location,
      filters,
      investmentCriteria,
      limit: pageSize,
      skip: (page - 1) * pageSize
    });

    // If we have enough results in the database, return them
    if (dbResults.total >= pageSize) {
      // Save search history
      if (userId) {
        await SearchHistory.create({
          location,
          filters,
          investmentCriteria,
          resultCount: dbResults.total,
          matchingProperties: dbResults.properties.map(p => p.zpid),
          userId,
          searchDate: new Date()
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Properties found in database',
        data: dbResults,
        source: 'database'
      });
    }

    // If not enough results in database, fetch from Zillow API
    // We'll paginate through all pages of the extended property search
    // until we get the expected amount of properties or paginate through all 20 pages
    let allProperties: any[] = [];
    let apiPage = 1;
    const maxApiPages = 20;
    
    while (apiPage <= maxApiPages && allProperties.length < pageSize * 2) {
      const apiResults = await searchProperties(location, {
        ...filters,
        page: apiPage
      });
      
      if (!apiResults.props || apiResults.props.length === 0) {
        break;
      }
      
      // Process and save each property
      for (const prop of apiResults.props) {
        // Extract necessary data
        const propertyData = {
          zpid: prop.zpid,
          address: prop.address,
          city: prop.address.split(',')[0].trim(),
          state: prop.address.split(',')[1]?.trim().split(' ')[0],
          zipCode: prop.address.split(',')[1]?.trim().split(' ')[1],
          price: prop.price,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          squareFootage: prop.livingArea,
          yearBuilt: prop.yearBuilt,
          propertyType: prop.propertyType,
          lotSize: prop.lotAreaValue,
          lotUnit: prop.lotAreaUnit,
          images: [prop.imgSrc, ...(prop.carouselPhotos?.map(p => p.url) || [])],
          latitude: prop.latitude,
          longitude: prop.longitude,
          zestimate: prop.zestimate,
          rentZestimate: prop.rentZestimate,
          // If no rentZestimate, we'll need to calculate a custom estimate
          customRentEstimate: !prop.rentZestimate ? calculateRentEstimate(prop) : null
        };
        
        // Save to database with investment calculations
        await propertyOperations.saveProperty(propertyData);
      }
      
      allProperties = [...allProperties, ...apiResults.props];
      apiPage++;
      
      // Add a small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // After fetching from API, get updated results from database
    const updatedDbResults = await propertyOperations.searchProperties({
      location,
      filters,
      investmentCriteria,
      limit: pageSize,
      skip: (page - 1) * pageSize
    });
    
    // Save search history
    if (userId) {
      await SearchHistory.create({
        location,
        filters,
        investmentCriteria,
        resultCount: updatedDbResults.total,
        matchingProperties: updatedDbResults.properties.map(p => p.zpid),
        userId,
        searchDate: new Date()
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Properties found',
      data: updatedDbResults,
      source: 'api'
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred during search',
      error: error.toString()
    }, { status: 500 });
  }
}

/**
 * Calculate a custom rent estimate based on property details
 * This is a simple estimation - in a real app, this would use ML
 */
function calculateRentEstimate(property: any): number {
  // Simple estimation based on property price
  // Typically, annual rent is 7-10% of property value
  // Monthly rent would be annual rent / 12
  const annualRentPercentage = 0.08; // 8%
  const annualRent = property.price * annualRentPercentage;
  const monthlyRent = annualRent / 12;
  
  // Adjust based on bedrooms and bathrooms
  let adjustedRent = monthlyRent;
  adjustedRent += (property.bedrooms - 2) * 100; // $100 per bedroom above 2
  adjustedRent += (property.bathrooms - 1) * 50; // $50 per bathroom above 1
  
  // Adjust based on square footage
  const avgSqftPrice = 1.5; // $1.50 per sqft
  const sqftAdjustment = property.livingArea * avgSqftPrice / 100;
  adjustedRent += sqftAdjustment;
  
  return Math.round(adjustedRent);
}
