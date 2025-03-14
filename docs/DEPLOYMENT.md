# Vercel Deployment Guide

This guide provides instructions for deploying the Real Estate Investment Analyzer application to Vercel and setting up MongoDB Atlas.

## Prerequisites

- A Vercel account
- A MongoDB Atlas account
- The Real Estate Investment Analyzer codebase

## Vercel Setup

1. Create a Vercel account at https://vercel.com if you don't already have one
2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Login to Vercel from the CLI:
   ```
   vercel login
   ```
4. Navigate to your project directory and run:
   ```
   vercel
   ```
5. Follow the prompts to link your project to Vercel

## Environment Variables

Configure the following environment variables in your Vercel project settings:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `RAPIDAPI_KEY`: Your RapidAPI key for Zillow API access (43a2077769msh0cb4c0db03f8ef2p11cb23jsn5d30363fdefe)
- `REDIS_URL`: Your Redis connection string (if using external Redis service)
- `NEXTAUTH_SECRET`: A secret for Auth.js (generate a random string)
- `NEXTAUTH_URL`: Your application's URL

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier is available)
3. Configure network access:
   - Add your IP address to the IP whitelist
   - For production, set it to allow access from anywhere (0.0.0.0/0)
4. Create a database user with read/write permissions
5. Get your connection string and add it to Vercel environment variables

## Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository in the Vercel dashboard
3. Configure your project settings:
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
   - Environment variables: Add all required variables
4. Deploy your project

Alternatively, deploy directly from the command line:
```
vercel --prod
```

## Post-Deployment

After deployment, verify the following:

1. The application is accessible at the provided Vercel URL
2. API endpoints are working correctly
3. Database connections are established
4. Search functionality is working
5. Investment calculators are functioning properly

## Monitoring

Set up monitoring using Vercel Analytics:

1. Enable Vercel Analytics in your project settings
2. Monitor performance metrics, errors, and user behavior
3. Set up alerts for critical issues

## Troubleshooting

If you encounter issues during deployment:

1. Check Vercel deployment logs
2. Verify environment variables are correctly set
3. Ensure MongoDB Atlas connection string is correct
4. Check for any API rate limiting issues with Zillow API
5. Verify Redis connection if using external Redis service
