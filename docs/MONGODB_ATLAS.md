# MongoDB Atlas Configuration Guide

This guide provides instructions for setting up MongoDB Atlas for the Real Estate Investment Analyzer application.

## Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account
2. Create a new organization if prompted

## Create a Cluster

1. Click "Build a Database" in the Atlas dashboard
2. Choose the "FREE" tier option
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to your users
5. Click "Create Cluster" (this may take a few minutes to provision)

## Configure Database Access

1. In the left sidebar, click "Database Access" under Security
2. Click "Add New Database User"
3. Choose "Password" for Authentication Method
4. Enter a username and password (save these securely)
5. Set "Database User Privileges" to "Read and write to any database"
6. Click "Add User"

## Configure Network Access

1. In the left sidebar, click "Network Access" under Security
2. Click "Add IP Address"
3. For development, you can add your current IP address
4. For production, you can allow access from anywhere by adding `0.0.0.0/0`
5. Click "Confirm"

## Get Connection String

1. In the left sidebar, click "Database" under Deployments
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as your driver and the appropriate version
5. Copy the connection string
6. Replace `<password>` with your database user's password
7. Replace `myFirstDatabase` with your preferred database name (e.g., `real-estate-investment`)

## Add Connection String to Environment Variables

Add the connection string to your environment variables:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/real-estate-investment?retryWrites=true&w=majority
```

## Test Connection

You can test the connection by running the following code:

```javascript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
}

testConnection();
```

## Database Indexes

For optimal performance, ensure the following indexes are created in your MongoDB Atlas database:

1. Property Collection:
   - zpid (unique)
   - city, state
   - zipCode
   - meetsRentOnePercentRule
   - meetsSqftOnePercentRule
   - rentToValueRatio
   - sqftToValueRatio
   - latitude, longitude (2dsphere)

2. User Collection:
   - email (unique)
   - savedProperties
   - savedSearches

3. SearchHistory Collection:
   - location
   - userId
   - searchDate

These indexes are defined in the Mongoose schemas but may need to be manually created in MongoDB Atlas if they don't exist.
