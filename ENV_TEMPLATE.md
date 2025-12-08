# Environment Variables Template

Copy this template to create your `.env` file in the project root.

## Required Variables

```bash
# ============================================
# Database Configuration (REQUIRED)
# ============================================
# PostgreSQL connection string
# Format: postgresql://username:password@host:port/database?sslmode=require
# Example for Neon: postgresql://user:pass@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
DATABASE_URL=postgresql://user:password@your-db-host:5432/manumaharani?sslmode=require

# ============================================
# Google Cloud Storage (REQUIRED for Image Uploads)
# ============================================
# GCP Project ID
GCP_PROJECT_ID=your-gcp-project-id

# Service Account Email (from GCP IAM)
GCP_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

# Service Account Private Key
# IMPORTANT: Keep the quotes and \n characters as shown
# The private key should be on a single line with \n for newlines
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"

# GCS Bucket Name (where images will be stored)
GCP_BUCKET_NAME=manu-maharani-images

# ============================================
# Redis Cache (OPTIONAL but Recommended)
# ============================================
# Get these from Upstash Redis: https://console.upstash.com/
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# ============================================
# Application Configuration
# ============================================
# Node Environment: development | production
NODE_ENV=development

# ============================================
# Authentication (Optional)
# ============================================
# Auth URL (for better-auth)
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
```

## Example .env File

```bash
# Database
DATABASE_URL=postgresql://admin:password123@ep-cool-darkness-123456.us-east-2.aws.neon.tech/manumaharani?sslmode=require

# Google Cloud Storage
GCP_PROJECT_ID=manu-maharani-project
GCP_CLIENT_EMAIL=storage-service@manu-maharani-project.iam.gserviceaccount.com
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GCP_BUCKET_NAME=manu-maharani-images

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://us1-ample-pony-12345.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXAAgC1234567890abcdefghijklmnopqrstuvwxyz

# Application
NODE_ENV=development
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
```

## Setup Instructions

1. **Create `.env` file** in the project root (same level as `package.json`)
2. **Copy the template above** and fill in your actual values
3. **Never commit `.env`** to git (it's already in `.gitignore`)

## Getting Your Values

### Database (Neon, Supabase, or any PostgreSQL)

- Sign up at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
- Copy the connection string from your dashboard
- Format: `postgresql://user:pass@host/db?sslmode=require`

### Google Cloud Storage

1. Create a GCP project at [Google Cloud Console](https://console.cloud.google.com)
2. Enable Cloud Storage API
3. Create a service account with Storage Admin role
4. Download the JSON key file
5. Extract:
   - `project_id` → `GCP_PROJECT_ID`
   - `client_email` → `GCP_CLIENT_EMAIL`
   - `private_key` → `GCP_PRIVATE_KEY` (keep quotes and `\n`)
6. Create a bucket → `GCP_BUCKET_NAME`

### Redis (Upstash)

1. Sign up at [Upstash](https://console.upstash.com)
2. Create a Redis database
3. Copy the REST URL and token from the dashboard

## Important Notes

- **GCP_PRIVATE_KEY**: Must be in quotes with `\n` for newlines
- **DATABASE_URL**: Required - app won't work without it
- **GCS variables**: Required for image uploads to work
- **Redis**: Optional but recommended for better performance
- For production, set `NODE_ENV=production`
