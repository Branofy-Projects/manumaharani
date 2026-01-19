# 🚀 Deploy Admin App to Google Cloud Run

This guide will help you deploy the admin app to Google Cloud Run using GitHub integration.

## 📋 Prerequisites

- Google Cloud Project with billing enabled
- GitHub repository connected to Google Cloud Build
- Required environment variables configured in Cloud Run

## 🔧 Setup Steps

### 1. Connect GitHub Repository

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Cloud Build** → **Triggers**
3. Click **"CONNECT REPOSITORY"**
4. Select **GitHub** and authorize access
5. Choose your repository

### 2. Create Cloud Build Trigger

1. Click **"CREATE TRIGGER"**
2. Configure the trigger:
   - **Name**: `deploy-admin-app`
   - **Event**: Push to a branch
   - **Branch**: `main` (or your default branch)
   - **Configuration**: Cloud Build configuration file
   - **Location**: Repository
   - **Cloud Build configuration file**: `apps/admin/cloudbuild.yaml`

### 3. Configure Environment Variables

Before deploying, make sure to set these environment variables in Cloud Run:

1. Go to **Cloud Run** → **manumaharani-admin** → **Edit & Deploy New Revision**
2. Under **"Variables & Secrets"**, add:
   - `DATABASE_URL` - Your database connection string
   - `NODE_ENV=production`
   - Any other required environment variables for the admin app

### 4. Deploy

The deployment will happen automatically when you push to the main branch, or you can:

1. Go to **Cloud Build** → **Triggers**
2. Click **"RUN"** on your trigger
3. Select the branch and commit
4. Click **"RUN"**

## 🔄 Update Your App

```bash
# Make changes to your code
# Then commit and push

git add .
git commit -m "Update admin app"
git push origin main

# Cloud Run automatically rebuilds and deploys!
```

---

## 📋 Build Configuration Settings (In Cloud Run UI)

When setting up the repository connection, use these settings:

**Build Configuration:**

```
Build type: Dockerfile
Dockerfile path: apps/admin/Dockerfile
Build context directory: . (root)
```

**Advanced Settings (Optional):**

```yaml
# If Cloud Run asks for cloudbuild.yaml, it will auto-generate one like:
steps:
  - name: "gcr.io/cloud-builders/docker"
    args:
      [
        "build",
        "-t",
        "gcr.io/$PROJECT_ID/manumaharani-admin",
        "-f",
        "apps/admin/Dockerfile",
        ".",
      ]
```

---

## 🎯 What Happens Automatically

1. **Push to GitHub** → Triggers Cloud Build
2. **Cloud Build** → Builds Docker image from `apps/admin/Dockerfile`
3. **Cloud Run** → Deploys new image automatically
4. **You get** → Live URL like `https://manumaharani-admin-xxxxx.a.run.app`

---

## ✅ Files You Need (Already Created)

- ✅ `apps/admin/Dockerfile` - Docker build config
- ✅ `apps/admin/.dockerignore` - Exclude files from build
- ✅ `apps/admin/.gcloudignore` - Exclude files from gcloud upload
- ✅ `apps/admin/cloudbuild.yaml` - Cloud Build configuration
- ✅ `apps/admin/next.config.ts` - Updated with `output: "standalone"`

---

## 🔧 Troubleshooting

**Issue: Build fails with "Cannot find module"**

- Make sure Dockerfile is at `apps/admin/Dockerfile`
- Build context should be `/` (root of monorepo)
- Verify all required packages are included in Dockerfile

**Issue: "Repository not found"**

- Go to: https://console.cloud.google.com/cloud-build/triggers
- Click "CONNECT REPOSITORY"
- Authorize GitHub access

**Issue: Build timeout**

- In Cloud Build settings, increase timeout to 20 minutes
- Go to: https://console.cloud.google.com/cloud-build/settings

**Issue: "Module not found" for @repo packages**

- Ensure all required packages are listed in Dockerfile:
  - `packages/actions`
  - `packages/auth`
  - `packages/db`
  - `packages/eslint-config`
  - `packages/typescript-config`

**Issue: Standalone output not found**

- Verify `next.config.ts` has `output: "standalone"`
- Rebuild the app: `yarn build` in `apps/admin`

---

## 🎬 Alternative: Cloud Build Trigger (Manual Setup)

If you want more control, create a trigger manually:

1. Go to: https://console.cloud.google.com/cloud-build/triggers
2. Click **"CREATE TRIGGER"**
3. Configure as described above

---

## 📝 Notes

- The admin app runs on port **8080** (Cloud Run default)
- Memory is set to **512Mi** (adjust in `cloudbuild.yaml` if needed)
- CPU is set to **1** (adjust in `cloudbuild.yaml` if needed)
- Min instances: **0** (scales to zero when not in use)
- Max instances: **10** (adjust based on traffic)

---

## 🔐 Security Notes

- The admin app should be protected with authentication
- Consider using Cloud Run authentication instead of `--allow-unauthenticated`
- Use Secret Manager for sensitive environment variables

