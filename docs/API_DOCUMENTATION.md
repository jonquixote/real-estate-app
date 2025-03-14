# Real Estate Investment Analyzer API Documentation

This document provides comprehensive documentation for the Real Estate Investment Analyzer API endpoints.

## Base URL

All API endpoints are relative to the base URL of your deployment:

```
https://your-deployment-url.vercel.app/api
```

## Authentication

Most API endpoints require authentication. Include a valid authentication token in the request headers:

```
Authorization: Bearer <token>
```

## API Endpoints

### Property Search

#### Search Properties

```
POST /search
```

Search for properties based on location, filters, and investment criteria.

**Request Body:**

```json
{
  "location": "Austin, TX",
  "filters": {
    "propertyType": ["SINGLE_FAMILY", "MULTI_FAMILY"],
    "bedrooms": { "min": 2, "max": 4 },
    "bathrooms": { "min": 1, "max": 3 },
    "price": { "min": 100000, "max": 500000 },
    "squareFootage": { "min": 1000, "max": 3000 },
    "yearBuilt": { "min": 1980, "max": 2023 }
  },
  "investmentCriteria": {
    "rentOnePercentRule": true,
    "sqftOnePercentRule": false,
    "combinedRules": false,
    "thresholdApproaching": false,
    "thresholdQuantity": 25
  },
  "page": 1,
  "pageSize": 10,
  "userId": "user_123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Properties found",
  "data": {
    "properties": [
      {
        "zpid": "123456789",
        "address": "123 Main St, Austin, TX 78701",
        "city": "Austin",
        "state": "TX",
        "zipCode": "78701",
        "price": 350000,
        "bedrooms": 3,
        "bathrooms": 2,
        "squareFootage": 1800,
        "yearBuilt": 2005,
        "propertyType": "SINGLE_FAMILY",
        "lotSize": 0.25,
        "lotUnit": "acres",
        "images": ["https://example.com/image1.jpg"],
        "latitude": 30.2672,
        "longitude": -97.7431,
        "zestimate": 355000,
        "rentZestimate": 2800,
        "customRentEstimate": null,
        "rentToValueRatio": 0.8,
        "sqftToValueRatio": 0.51,
        "meetsRentOnePercentRule": false,
        "meetsSqftOnePercentRule": false
      }
    ],
    "total": 45,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  },
  "source": "database"
}
```

### Property Details

#### Get Property by ID

```
GET /property/:zpid
```

Retrieve detailed information about a specific property.

**Parameters:**

- `zpid` (path parameter): Zillow Property ID

**Response:**

```json
{
  "success": true,
  "data": {
    "zpid": "123456789",
    "address": "123 Main St, Austin, TX 78701",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701",
    "price": 350000,
    "bedrooms": 3,
    "bathrooms": 2,
    "squareFootage": 1800,
    "yearBuilt": 2005,
    "propertyType": "SINGLE_FAMILY",
    "lotSize": 0.25,
    "lotUnit": "acres",
    "images": ["https://example.com/image1.jpg"],
    "latitude": 30.2672,
    "longitude": -97.7431,
    "zestimate": 355000,
    "rentZestimate": 2800,
    "customRentEstimate": null,
    "rentToValueRatio": 0.8,
    "sqftToValueRatio": 0.51,
    "meetsRentOnePercentRule": false,
    "meetsSqftOnePercentRule": false,
    "description": "Beautiful single-family home in central Austin...",
    "features": ["Garage", "Pool", "Fireplace"],
    "schools": [
      {
        "name": "Austin High School",
        "rating": 8,
        "distance": 1.2
      }
    ]
  }
}
```

### Rental Estimation

#### Get Rental Estimate

```
POST /rental-estimate
```

Get a rental estimate for a property.

**Request Body:**

```json
{
  "property": {
    "zpid": "123456789",
    "address": "123 Main St, Austin, TX 78701",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701",
    "bedrooms": 3,
    "bathrooms": 2,
    "squareFootage": 1800,
    "yearBuilt": 2005,
    "propertyType": "SINGLE_FAMILY",
    "latitude": 30.2672,
    "longitude": -97.7431,
    "zestimate": 355000
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "estimatedRent": 2800,
    "source": "zillow",
    "confidenceScore": 0.9,
    "comparableProperties": [
      {
        "address": "456 Oak St, Austin, TX 78701",
        "rent": 2750,
        "bedrooms": 3,
        "bathrooms": 2,
        "squareFootage": 1750,
        "distance": 0.3
      },
      {
        "address": "789 Pine St, Austin, TX 78701",
        "rent": 2900,
        "bedrooms": 3,
        "bathrooms": 2.5,
        "squareFootage": 1900,
        "distance": 0.4
      }
    ]
  }
}
```

### Cash Flow Analysis

#### Calculate Cash Flow

```
POST /cash-flow
```

Calculate detailed cash flow analysis for a property.

**Request Body:**

```json
{
  "propertyDetails": {
    "price": 350000,
    "closingCosts": 10500,
    "renovationCosts": 15000,
    "afterRepairValue": 380000
  },
  "financingDetails": {
    "downPaymentPercent": 20,
    "interestRate": 6.5,
    "loanTerm": 30,
    "loanPoints": 0,
    "pmiPercent": 0.5
  },
  "incomeDetails": {
    "monthlyRent": 2800,
    "otherIncome": 0,
    "annualRentGrowth": 2,
    "vacancyRate": 5
  },
  "expenseDetails": {
    "propertyTaxRate": 1.2,
    "propertyTaxAnnualIncrease": 2,
    "insuranceAnnual": 1200,
    "insuranceAnnualIncrease": 3,
    "maintenancePercent": 5,
    "capexPercent": 5,
    "managementPercent": 8,
    "utilitiesMonthly": 0,
    "hoaMonthly": 0,
    "otherExpensesMonthly": 0,
    "annualExpenseGrowth": 2
  },
  "annualAppreciation": 3
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "purchasePrice": 350000,
    "totalCashInvested": 95500,
    "loanAmount": 280000,
    "monthlyRent": 2800,
    "effectiveGrossIncome": 2660,
    "monthlyExpenses": {
      "mortgage": 1773.40,
      "propertyTax": 350,
      "insurance": 100,
      "maintenance": 140,
      "capex": 140,
      "management": 224,
      "utilities": 0,
      "hoa": 0,
      "other": 0,
      "pmi": 0,
      "total": 2727.40
    },
    "monthlyCashFlow": -67.40,
    "annualCashFlow": -808.80,
    "cashOnCashReturn": -0.85,
    "capRate": 5.14,
    "netOperatingIncome": 18000,
    "grossRentMultiplier": 10.42,
    "yearlyProjections": [
      {
        "year": 1,
        "grossIncome": 33600,
        "operatingExpenses": 15600,
        "netOperatingIncome": 18000,
        "mortgagePayment": 21280.80,
        "cashFlow": -3280.80,
        "propertyValue": 360500,
        "loanBalance": 275623.47,
        "equity": 84876.53,
        "returnOnEquity": -3.87
      }
      // Additional years omitted for brevity
    ],
    "fiveYearIRR": 7.2,
    "tenYearIRR": 11.5,
    "fifteenYearIRR": 14.8,
    "totalEquityBuildup": 175000,
    "totalAppreciation": 140000,
    "totalCashFlow": 35000,
    "totalReturn": 210000,
    "returnOnInvestment": 220
  }
}
```

### User Management

#### Register User

```
POST /auth/register
```

Register a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login

```
POST /auth/login
```

Authenticate a user and get a token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "user_123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Search History

#### Get User Search History

```
GET /user/search-history
```

Retrieve a user's search history.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "searches": [
      {
        "id": "search_123",
        "location": "Austin, TX",
        "filters": {
          "propertyType": ["SINGLE_FAMILY"],
          "bedrooms": { "min": 2, "max": 4 }
        },
        "investmentCriteria": {
          "rentOnePercentRule": true,
          "sqftOnePercentRule": false,
          "combinedRules": false
        },
        "resultCount": 45,
        "searchDate": "2025-03-10T15:30:00Z"
      }
    ],
    "total": 1
  }
}
```

### Saved Properties

#### Save Property

```
POST /user/saved-properties
```

Save a property to a user's favorites.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "zpid": "123456789"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Property saved successfully",
  "data": {
    "savedProperties": ["123456789", "987654321"]
  }
}
```

#### Get Saved Properties

```
GET /user/saved-properties
```

Retrieve a user's saved properties.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "zpid": "123456789",
        "address": "123 Main St, Austin, TX 78701",
        "price": 350000,
        "bedrooms": 3,
        "bathrooms": 2,
        "squareFootage": 1800,
        "images": ["https://example.com/image1.jpg"],
        "rentToValueRatio": 0.8,
        "sqftToValueRatio": 0.51,
        "meetsRentOnePercentRule": false,
        "meetsSqftOnePercentRule": false
      }
    ],
    "total": 1
  }
}
```

## Error Responses

All API endpoints return a consistent error format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Error code or detailed error information"
}
```

Common HTTP status codes:

- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Rate Limiting

API requests are subject to rate limiting:

- Search API: 2 requests per second
- Other endpoints: 10 requests per second

When rate limit is exceeded, the API returns a `429 Too Many Requests` status code.

## Pagination

Endpoints that return multiple items support pagination with the following parameters:

- `page`: Page number (starting from 1)
- `pageSize`: Number of items per page

Response includes pagination metadata:

```json
{
  "total": 45,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5
}
```
