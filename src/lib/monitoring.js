// monitoring.js
import { NextResponse } from 'next/server';

/**
 * Monitoring and analytics setup for the Real Estate Investment Analyzer
 * 
 * This file configures monitoring for the application using Vercel Analytics
 * and custom error tracking.
 */

// Error tracking middleware
export function middleware(request) {
  // Add custom headers for monitoring
  const response = NextResponse.next();
  response.headers.set('X-Monitoring-Enabled', 'true');
  return response;
}

// Custom error logger
export const logError = (error, context = {}) => {
  console.error('Application Error:', error);
  
  // In production, this would send to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example of sending to a monitoring service
    fetch('/api/monitoring/error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
      }),
    }).catch(console.error);
  }
};

// Performance monitoring
export const trackPerformance = (name, callback) => {
  const start = performance.now();
  try {
    return callback();
  } finally {
    const duration = performance.now() - start;
    
    // Log performance metrics
    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    
    // In production, send to analytics
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/monitoring/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          duration,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error);
    }
  }
};

// API usage tracking
export const trackApiUsage = (endpoint, params = {}) => {
  // In production, log API usage
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/monitoring/api-usage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint,
        params,
        timestamp: new Date().toISOString(),
      }),
    }).catch(console.error);
  }
};

// User activity tracking
export const trackUserActivity = (userId, action, details = {}) => {
  // In production, log user activity
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/monitoring/user-activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        action,
        details,
        timestamp: new Date().toISOString(),
      }),
    }).catch(console.error);
  }
};

// Health check endpoint
export const healthCheck = async () => {
  try {
    // Check database connection
    const dbStatus = await fetch('/api/monitoring/db-status').then(res => res.json());
    
    // Check API connections
    const apiStatus = await fetch('/api/monitoring/api-status').then(res => res.json());
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus.status,
        api: apiStatus.status,
      },
    };
  } catch (error) {
    logError(error, { context: 'health-check' });
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    };
  }
};
