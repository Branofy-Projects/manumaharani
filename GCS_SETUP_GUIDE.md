# Google Cloud Storage Setup Guide

Complete step-by-step guide to set up GCS for image uploads in Manu Maharani.

---

## Prerequisites

- Google account
- Access to [Google Cloud Console](https://console.cloud.google.com)

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the **project dropdown** at the top (next to "Google Cloud")
3. Click **"New Project"**
4. Enter project details:
   - **Project name**: `Manu Maharani` (or any name you prefer)
   - **Project ID**: Will be auto-generated (e.g., `manu-maharani-123456`)
   - **Location**: Choose your organization (optional)
5. Click **"Create"**
6. Wait for project creation (10-30 seconds)
7. Select your new project from the dropdown

**Note**: Save your **Project ID** - you'll need it for `GCP_PROJECT_ID`

---

## Step 2: Enable Cloud Storage API

1. In your project, go to **"APIs & Services"** → **"Library"** (or search "APIs" in the top search bar)
2. Search for **"Cloud Storage API"**
3. Click on **"Cloud Storage API"**
4. Click **"Enable"**
5. Wait for it to enable (usually instant)

---

## Step 3: Create a Service Account

1. Go to **"IAM & Admin"** → **"Service Accounts"** (or search "Service Accounts")
2. Click **"+ CREATE SERVICE ACCOUNT"** at the top
3. **Service account details**:
   - **Service account name**: `manu-maharani-storage`
   - **Service account ID**: Auto-generated (e.g., `manu-maharani-storage`)
   - **Description**: `Service account for Manu Maharani image uploads`
4. Click **"CREATE AND CONTINUE"**
5. **Grant this service account access to project**:
   - Click **"Select a role"** dropdown
   - Search for **"Storage Admin"**
   - Select **"Storage Admin"** (this gives full access to Cloud Storage)
   - Click **"CONTINUE"**
6. **Grant users access** (optional - you can skip this):
   - Click **"DONE"**

**Note**: You've created the service account. Next, we'll create a key.

---

## Step 4: Create Service Account Key (JSON)

1. In the **Service Accounts** list, click on your service account (`manu-maharani-storage`)
2. Go to the **"KEYS"** tab
3. Click **"ADD KEY"** → **"Create new key"**
4. Select **"JSON"** format
5. Click **"CREATE"**
6. A JSON file will download automatically - **SAVE THIS FILE SECURELY**

**Important**: This file contains sensitive credentials. Don't commit it to git!

---

## Step 5: Extract Credentials from JSON File

Open the downloaded JSON file. It looks like this:

```json
{
  "type": "service_account",
  "project_id": "manu-maharani-123456",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "manu-maharani-storage@manu-maharani-123456.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

Extract these values:
- `project_id` → `GCP_PROJECT_ID`
- `client_email` → `GCP_CLIENT_EMAIL`
- `private_key` → `GCP_PRIVATE_KEY` (keep the quotes and `\n` characters)

---

## Step 6: Create a Storage Bucket

1. Go to **"Cloud Storage"** → **"Buckets"** (or search "Cloud Storage")
2. Click **"CREATE BUCKET"**
3. **Name your bucket**:
   - **Name**: `manu-maharani-images` (or your preferred name)
   - **Important**: Bucket names must be globally unique (use your project ID or add random numbers)
   - Example: `manu-maharani-images-123456`
4. **Choose where to store your data**:
   - **Location type**: `Region` (recommended) or `Multi-region`
   - **Location**: Choose closest to your users (e.g., `us-east1`, `asia-south1`)
5. **Choose a storage class**:
   - Select **"Standard"** (default)
6. **Choose how to control access to objects**:
   - Select **"Uniform"** (recommended for simplicity)
7. **Choose how to protect object data**:
   - Leave defaults (or enable encryption if needed)
8. Click **"CREATE"**

**Note**: Save your bucket name - you'll need it for `GCP_BUCKET_NAME`

---

## Step 7: Configure Bucket Permissions (Make Images Public)

If you want images to be publicly accessible via URLs:

1. Click on your bucket name
2. Go to the **"PERMISSIONS"** tab
3. Click **"ADD PRINCIPAL"**
4. **New principals**:
   - Enter: `allUsers`
5. **Select a role**:
   - Choose **"Storage Object Viewer"** (allows public read access)
6. Click **"SAVE"**
7. A warning will appear - click **"ALLOW PUBLIC ACCESS"**

**Note**: This makes all images in the bucket publicly accessible. If you need private images, skip this step and use signed URLs instead.

---

## Step 8: Update Your .env File

Add these values to your `.env` file in the project root:

```bash
# Google Cloud Storage
GCP_PROJECT_ID=manu-maharani-123456
GCP_CLIENT_EMAIL=manu-maharani-storage@manu-maharani-123456.iam.gserviceaccount.com
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GCP_BUCKET_NAME=manu-maharani-images-123456
```

**Important Notes**:
- Replace the values with your actual values from Steps 5 and 6
- `GCP_PRIVATE_KEY` must be in quotes
- Keep the `\n` characters in the private key (they represent newlines)
- The private key should be on one line with `\n` for line breaks

---

## Step 9: Verify Setup

1. **Restart your Next.js dev server** (if running):
   ```bash
   # Stop the server (Ctrl+C) and restart
   yarn dev
   ```

2. **Test image upload**:
   - Go to any form with image upload (e.g., `/room-types/new`)
   - Try uploading an image
   - Check the browser console and server logs for any errors

3. **Check GCS Console**:
   - Go to **"Cloud Storage"** → **"Buckets"** → Your bucket
   - You should see uploaded images in the `uploads/` folder

---

## Troubleshooting

### Error: "GCP_BUCKET_NAME environment variable is not set"
- Make sure your `.env` file is in the project root
- Restart your dev server after adding env variables
- Check that variable names match exactly (case-sensitive)

### Error: "Permission denied" or 403
- Verify service account has **"Storage Admin"** role
- Check bucket permissions in GCS Console
- Ensure service account email matches `GCP_CLIENT_EMAIL`

### Error: "Bucket not found" or 404
- Verify bucket name in `GCP_BUCKET_NAME` matches exactly
- Check bucket exists in GCS Console
- Ensure you're using the correct project

### Error: "Invalid private key"
- Make sure `GCP_PRIVATE_KEY` is in quotes
- Keep `\n` characters (don't replace with actual newlines)
- Copy the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

### Images upload but URLs don't work
- Make sure bucket has public access (Step 7)
- Or implement signed URLs for private access
- Check bucket CORS settings if accessing from browser

---

## Security Best Practices

1. **Never commit credentials to git**:
   - `.env` is already in `.gitignore`
   - Don't commit the JSON key file

2. **Use least privilege**:
   - Service account only needs `Storage Admin` for this use case
   - Don't grant broader permissions

3. **Rotate keys periodically**:
   - Delete old keys and create new ones
   - Update `.env` with new credentials

4. **Monitor usage**:
   - Check GCS Console for unexpected uploads
   - Set up billing alerts

---

## Quick Reference

| What | Where to Find |
|------|---------------|
| **Project ID** | Cloud Console → Project dropdown → Your project → Project ID |
| **Service Account Email** | IAM & Admin → Service Accounts → Your account → Email |
| **Private Key** | Service Accounts → Keys → Download JSON → `private_key` field |
| **Bucket Name** | Cloud Storage → Buckets → Your bucket name |

---

## Next Steps

After setup:
1. ✅ Test image upload in admin panel
2. ✅ Verify images appear in GCS bucket
3. ✅ Check image URLs work in browser
4. ✅ Set up billing alerts (optional)
5. ✅ Configure lifecycle policies (optional - auto-delete old images)

---

## Support

If you encounter issues:
1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure service account has correct permissions
4. Test bucket access in GCS Console

