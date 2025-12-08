# Fix GCS Permission Denied Error

## Quick Fix Steps

### Step 1: Verify Service Account Exists

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **"IAM & Admin"** → **"Service Accounts"**
3. Check if you have a service account listed
4. Note the **email address** of your service account (e.g., `manu-maharani-storage@project-id.iam.gserviceaccount.com`)

### Step 2: Check Service Account Permissions

**Option A: If service account exists but lacks permissions**

1. Click on your service account name
2. Go to **"PERMISSIONS"** tab
3. Check what roles are assigned
4. If you don't see **"Storage Admin"**, continue to Step 3

**Option B: If service account doesn't exist**

1. Click **"+ CREATE SERVICE ACCOUNT"**
2. Name: `manu-maharani-storage`
3. Click **"CREATE AND CONTINUE"**
4. Continue to Step 3

### Step 3: Grant Storage Admin Role

**Method 1: From Service Account Page**

1. In your service account, go to **"PERMISSIONS"** tab
2. Click **"GRANT ACCESS"** button
3. In **"New principals"**, the service account email should already be there
4. Click **"Select a role"** dropdown
5. Search for **"Storage Admin"**
6. Select **"Storage Admin"** (not "Storage Object Admin" or "Storage Object Viewer")
7. Click **"SAVE"**

**Method 2: From IAM Page**

1. Go to **"IAM & Admin"** → **"IAM"**
2. Find your service account in the list
3. Click the **pencil icon** (edit) next to it
4. Click **"+ ADD ANOTHER ROLE"**
5. Select **"Storage Admin"**
6. Click **"SAVE"**

### Step 4: Verify .env File

Make sure your `.env` file has the correct service account email:

```bash
GCP_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
```

**Important**: The email must match exactly (case-sensitive)

### Step 5: Wait and Retry

- GCS permissions can take a few seconds to propagate
- Wait 10-30 seconds after granting permissions
- Restart your dev server
- Try uploading again

---

## Alternative: Grant Bucket-Specific Permissions

If you prefer to grant permissions only to this specific bucket:

1. Go to **"Cloud Storage"** → **"Buckets"**
2. Click on your bucket (`manumaharani-files-bucket`)
3. Go to **"PERMISSIONS"** tab
4. Click **"+ Grant access"**
5. In **"New principals"**, enter your service account email
6. Select role: **"Storage Admin"**
7. Click **"SAVE"**

---

## Verify Everything is Correct

Checklist:
- [ ] Service account exists
- [ ] Service account has "Storage Admin" role (at project or bucket level)
- [ ] `.env` file has correct `GCP_CLIENT_EMAIL` (matches service account email exactly)
- [ ] `.env` file has `GCP_PROJECT_ID`, `GCP_PRIVATE_KEY`, and `GCP_BUCKET_NAME`
- [ ] Dev server restarted after updating `.env`
- [ ] Waited 10-30 seconds after granting permissions

---

## Still Not Working?

1. **Double-check service account email**:
   - Go to Service Accounts page
   - Copy the exact email address
   - Compare with `GCP_CLIENT_EMAIL` in `.env`
   - They must match exactly

2. **Check private key format**:
   - Must be in quotes
   - Must include `\n` for newlines
   - Must include BEGIN/END markers

3. **Check server logs**:
   - Look for more detailed error messages
   - Check if it's a different error (403, 404, etc.)

4. **Try creating a new service account key**:
   - Delete old key
   - Create new JSON key
   - Update `.env` with new credentials

