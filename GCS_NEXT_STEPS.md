# Next Steps After Creating GCS Bucket

## Step 1: Make Bucket Publicly Accessible

1. In Google Cloud Console, go to **"Cloud Storage"** → **"Buckets"**
2. Click on your bucket name (`etrouper-image-bucket`)
3. Go to the **"PERMISSIONS"** tab
4. Click **"ADD PRINCIPAL"** button
5. In the **"New principals"** field, type: `allUsers`
6. Click the **"Select a role"** dropdown
7. Choose **"Storage Object Viewer"**
8. Click **"SAVE"**
9. A warning popup will appear - click **"ALLOW PUBLIC ACCESS"**

✅ Your bucket is now publicly readable (images can be accessed via URLs)

---

## Step 2: Verify Service Account Setup

### Check if you already have a service account:

1. Go to **"IAM & Admin"** → **"Service Accounts"**
2. Look for a service account (might be named something like `manu-maharani-storage` or similar)
3. If you see one, click on it and go to **"KEYS"** tab
4. If you don't have a key, create one (see Step 3)

### If you don't have a service account, create one:

1. In **"Service Accounts"**, click **"+ CREATE SERVICE ACCOUNT"**
2. **Service account name**: `manu-maharani-storage`
3. Click **"CREATE AND CONTINUE"**
4. **Grant access**: Select role **"Storage Admin"**
5. Click **"CONTINUE"** then **"DONE"**

---

## Step 3: Create Service Account Key

1. Click on your service account name
2. Go to **"KEYS"** tab
3. Click **"ADD KEY"** → **"Create new key"**
4. Select **"JSON"** format
5. Click **"CREATE"**
6. A JSON file will download - **SAVE THIS FILE** (you'll need it next)

---

## Step 4: Extract Credentials from JSON

Open the downloaded JSON file. You need these 4 values:

```json
{
  "project_id": "your-project-id-123456",        ← GCP_PROJECT_ID
  "client_email": "service@project.iam.gserviceaccount.com",  ← GCP_CLIENT_EMAIL
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"  ← GCP_PRIVATE_KEY
}
```

And your bucket name: `etrouper-image-bucket`  ← GCP_BUCKET_NAME

---

## Step 5: Update Your .env File

Open your `.env` file and add/update these lines:

```bash
# Google Cloud Storage
GCP_PROJECT_ID=your-project-id-from-json
GCP_CLIENT_EMAIL=service-account-email-from-json
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourFullPrivateKeyHere\n-----END PRIVATE KEY-----\n"
GCP_BUCKET_NAME=etrouper-image-bucket
```

**Important Notes:**
- Replace values with your actual values from the JSON file
- `GCP_PRIVATE_KEY` must be in quotes
- Keep the `\n` characters (they represent newlines)
- Copy the ENTIRE private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- The private key should be on ONE line with `\n` for line breaks

**Example:**
```bash
GCP_PROJECT_ID=manu-maharani-123456
GCP_CLIENT_EMAIL=manu-maharani-storage@manu-maharani-123456.iam.gserviceaccount.com
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj...\n-----END PRIVATE KEY-----\n"
GCP_BUCKET_NAME=etrouper-image-bucket
```

---

## Step 6: Restart Your Dev Server

1. Stop your Next.js dev server (if running) - Press `Ctrl+C`
2. Restart it:
   ```bash
   yarn dev
   ```

**Important**: Environment variables are only loaded when the server starts, so you MUST restart after updating `.env`

---

## Step 7: Test Image Upload

1. Go to your admin panel: `http://localhost:3001`
2. Navigate to any form with image upload:
   - `/room-types/new`
   - `/rooms/new`
   - `/blogs/new`
   - `/gallery/new`
3. Try uploading an image
4. Check:
   - ✅ Image uploads successfully
   - ✅ No errors in browser console
   - ✅ No errors in server logs
   - ✅ Image appears in the preview

---

## Step 8: Verify in GCS Console

1. Go to **"Cloud Storage"** → **"Buckets"** → Your bucket
2. You should see an `uploads/` folder
3. Click on it to see your uploaded images
4. Click on an image to see its public URL

---

## Troubleshooting

### If upload fails:

1. **Check server logs** - Look for specific error messages
2. **Verify .env file**:
   - All 4 GCS variables are set
   - `GCP_PRIVATE_KEY` is in quotes
   - No typos in variable names
3. **Verify service account permissions**:
   - Service account has "Storage Admin" role
   - Service account email matches `GCP_CLIENT_EMAIL`
4. **Verify bucket**:
   - Bucket name matches `GCP_BUCKET_NAME` exactly
   - Bucket exists and is accessible
   - Public access is enabled (Step 1)

### Common Errors:

**"GCP_BUCKET_NAME environment variable is not set"**
- Check `.env` file exists in project root
- Restart dev server after adding variables

**"Permission denied" (403)**
- Verify service account has "Storage Admin" role
- Check bucket permissions

**"Bucket not found" (404)**
- Verify bucket name matches exactly (case-sensitive)
- Check you're using the correct project

**"Invalid private key"**
- Make sure `GCP_PRIVATE_KEY` is in quotes
- Keep `\n` characters (don't replace with actual line breaks)
- Copy entire key including BEGIN/END markers

---

## Success Checklist

- [ ] Bucket created and publicly accessible
- [ ] Service account created with Storage Admin role
- [ ] Service account key (JSON) downloaded
- [ ] `.env` file updated with all 4 GCS variables
- [ ] Dev server restarted
- [ ] Image upload tested successfully
- [ ] Images visible in GCS Console

---

## You're Done! 🎉

Once all steps are complete, your image upload system should be working. You can now:
- Upload images in room types, rooms, blogs, gallery, and testimonials
- Images will be stored in Google Cloud Storage
- Images will be accessible via public URLs
- Multiple variants (small, medium, large, original) will be created automatically

