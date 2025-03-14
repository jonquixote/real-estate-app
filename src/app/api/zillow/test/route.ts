import { NextResponse } from 'next/server';
import { searchProperties } from '@/services/zillow-api';

export async function GET() {
  try {
    // Test the Zillow API with a sample location
    const location = 'Austin, TX';
    const filters = {
      propertyType: 'SINGLE_FAMILY',
      minBeds: 3,
      minBaths: 2,
      minPrice: 200000,
      maxPrice: 500000
    };
    
    const results = await searchProperties(location, filters);
    
    return NextResponse.json({
      success: true,
      message: 'Zillow API test successful',
      data: results
    });
  } catch (error: any) {
    console.error('API test error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred while testing the Zillow API',
      error: error.toString()
    }, { status: 500 });
  }
}
