# Google OAuth Troubleshooting Guide

## Quick Debugging Steps

### 1. Check Backend Environment Variables

Make sure your backend `.env` file has these variables:

```env
# Required for Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback

# Required for redirects
FRONTEND_URL=http://localhost:3002

# Required for CORS
CORS_ORIGIN=http://localhost:3002
```

### 2. Test Backend Endpoint Directly

Run this command in your backend directory to test the endpoint:

```bash
node test-google-oauth.js
```

Or test with curl:

```bash
curl -X GET http://localhost:3000/api/v1/auth/google/redirect
```

Expected response:
```json
{
  "redirectUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
}
```

### 3. Check Browser Console

1. Open browser dev tools (F12)
2. Go to Console tab
3. Click "Continue with Google" button
4. Look for error messages

Common errors and solutions:

#### Error: "Network error: Failed to fetch"
**Cause**: CORS issue or backend not running
**Solution**: 
- Make sure backend is running on port 3000
- Check `CORS_ORIGIN=http://localhost:3002` in backend .env

#### Error: "Backend error: 500 - Google OAuth not configured"
**Cause**: Missing Google OAuth credentials
**Solution**: Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to backend .env

#### Error: "No redirect URL received from backend"
**Cause**: Backend returning invalid response
**Solution**: Check backend logs for errors

### 4. Check Backend Logs

When you click the Google button, you should see these logs in your backend console:

```
Google OAuth redirect endpoint called
Environment variables check:
GOOGLE_CLIENT_ID: Set
GOOGLE_REDIRECT_URI: http://localhost:3000/api/v1/auth/google/callback
Generated Google OAuth URL: https://accounts.google.com/o/oauth2/v2/auth?...
```

If you don't see these logs, the request isn't reaching the backend.

### 5. Verify Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Verify these settings:

**Authorized JavaScript origins:**
- `http://localhost:3000`
- `http://localhost:3002`

**Authorized redirect URIs:**
- `http://localhost:3000/api/v1/auth/google/callback`

### 6. Test Complete Flow

1. **Frontend → Backend**: Click Google button, check console logs
2. **Backend → Google**: Should redirect to Google OAuth page
3. **Google → Backend**: After auth, Google calls `/api/v1/auth/google/callback`
4. **Backend → Frontend**: Backend redirects to `/auth/google/success`

## Common Issues and Solutions

### Issue: CORS Error
```
Access to fetch at 'http://localhost:3000/api/v1/auth/google/redirect' from origin 'http://localhost:3002' has been blocked by CORS policy
```

**Solution**: Add to backend .env:
```env
CORS_ORIGIN=http://localhost:3002
```

### Issue: 404 Not Found
```
Backend error: 404 - Cannot GET /api/v1/auth/google/redirect
```

**Solution**: Make sure the route is properly registered in `authRoutes.ts`

### Issue: Environment Variables Not Loading
```
Google OAuth not configured - missing GOOGLE_CLIENT_ID
```

**Solution**: 
1. Check `.env` file is in backend root directory
2. Restart backend server after adding environment variables
3. Make sure variable names are exact (no extra spaces)

### Issue: Invalid Client ID
```
Error 400: invalid_client
```

**Solution**: 
1. Double-check `GOOGLE_CLIENT_ID` in .env matches Google Cloud Console
2. Make sure client ID is for correct project
3. Verify OAuth consent screen is configured

## Step-by-Step Testing

1. **Test backend health**:
   ```bash
   curl http://localhost:3000/health
   ```

2. **Test Google OAuth endpoint**:
   ```bash
   curl http://localhost:3000/api/v1/auth/google/redirect
   ```

3. **Check frontend network tab**:
   - Open dev tools → Network tab
   - Click Google button
   - Look for request to `/api/v1/auth/google/redirect`

4. **Test full flow**:
   - Click Google button
   - Should redirect to Google
   - Authenticate with Google
   - Should redirect back to your app

## Get Help

If you're still having issues, please share:

1. Backend console logs when clicking Google button
2. Frontend browser console errors
3. Network tab showing the request/response
4. Your .env file (without sensitive values)

## Quick Fix Commands

```bash
# Restart backend
cd sec-kav-backend
npm run dev

# Restart frontend  
cd seckav-landing-v2
npm run dev

# Test endpoint
curl -v http://localhost:3000/api/v1/auth/google/redirect
``` 