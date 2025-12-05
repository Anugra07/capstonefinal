# Render Deployment Fix

## Issue
Render deployment fails with: `Cannot find package 'multer'`

## Root Cause
Render might not be installing dependencies properly or running in the wrong directory.

## Solution

### Option 1: Update Render Build Settings

In your Render dashboard:

1. **Root Directory**: Set to `backend/` (not root)
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`

### Option 2: Verify package.json is committed

Make sure `backend/package.json` and `backend/package-lock.json` are committed to git:

```bash
git add backend/package.json backend/package-lock.json
git commit -m "Ensure package files are committed"
git push
```

### Option 3: Force npm install in build

The `package.json` has been updated with:
- `"build": "npm install && npx prisma generate"` - Ensures npm install runs
- `"postinstall": "npx prisma generate"` - Auto-generates Prisma client after install

### Option 4: Check Render Service Settings

1. Go to your Render service dashboard
2. Settings → Build & Deploy
3. Ensure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build` (or just `npm install`)
   - **Start Command**: `npm start`
   - **Environment**: `Node`

### Option 5: Manual Verification

If the issue persists, verify locally:

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

This should work locally. If it does, the issue is with Render's build process.

## Dependencies Check

All required dependencies are in `package.json`:
- ✅ multer@^2.0.2
- ✅ express@^4.18.2
- ✅ @prisma/client@^5.7.0
- ✅ @google/generative-ai@^0.24.1
- ✅ pdf-parse@^2.4.5
- ✅ bcryptjs@^2.4.3
- ✅ cors@^2.8.5
- ✅ dotenv@^16.3.1
- ✅ jsonwebtoken@^9.0.2

## Expected Render Build Output

You should see:
```
==> Installing dependencies
npm install
...
added 151 packages

==> Building
npm run build
...
✔ Generated Prisma Client

==> Starting
npm start
node server.js
Backend server running on http://localhost:4000
```

## If Still Failing

1. Check Render logs for the exact error
2. Verify the root directory path in Render settings
3. Try setting build command to: `cd backend && npm install && npm run build`
4. Ensure `.env` file has all required variables set in Render dashboard

