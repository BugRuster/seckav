# Google OAuth Setup Guide (Backend-Only Implementation)

## Backend Setup

Add the following environment variables to your backend `.env` file:

```
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback

# Frontend URL for redirects
FRONTEND_URL=http://localhost:3002

# Firebase Configuration (existing)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=your_client_cert_url
FIREBASE_API_KEY=your_api_key
```

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set application type to "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (backend)
   - `http://localhost:3002` (frontend)
   - `https://yourdomain.com` (production)
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/v1/auth/google/callback` (backend callback)
   - `https://yourdomain.com/api/v1/auth/google/callback` (production callback)

## How it Works (Backend-Only)

1. User clicks "Continue with Google" button
2. Frontend calls backend `/api/v1/auth/google/redirect`
3. Backend generates Google OAuth URL and returns it
4. Frontend redirects user to Google OAuth
5. User authenticates with Google
6. Google redirects to backend `/api/v1/auth/google/callback`
7. Backend exchanges authorization code for access token
8. Backend gets user info from Google
9. Backend creates or updates user in Firebase and MongoDB
10. Backend generates custom token and redirects to frontend success page
11. Frontend receives token and user data, logs in user
12. User is redirected to dashboard

## API Endpoints

### GET `/api/v1/auth/google/redirect`
Returns Google OAuth URL for frontend to redirect to.

**Response:**
```json
{
  "redirectUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

### GET `/api/v1/auth/google/callback`
Handles Google OAuth callback and redirects to frontend.

**Query Parameters:**
- `code`: Authorization code from Google

**Redirects to:**
- Success: `${FRONTEND_URL}/auth/google/success?token=${customToken}&user=${encodedUserData}`
- Error: `${FRONTEND_URL}/auth/google/error?error=${errorMessage}`

### POST `/api/v1/auth/google` (Legacy)
Still available for direct ID token verification.

## Frontend Pages

### `/auth/google/success`
Handles successful Google authentication, extracts token and user data from URL parameters, logs in user, and redirects to dashboard.

### `/auth/google/error`
Handles failed Google authentication, shows error message with options to retry or go back to login.

## Testing

1. Set up Google OAuth credentials in Google Cloud Console
2. Add environment variables to backend `.env`
3. Start the backend server: `npm run dev` (in sec-kav-backend)
4. Start the frontend: `npm run dev` (in seckav-landing-v2)
5. Go to `/auth/register` or `/auth/login`
6. Click "Continue with Google"
7. Complete Google authentication
8. You should be redirected back and logged in

## Benefits of Backend-Only Approach

1. **No Frontend Configuration**: No need for Google Client ID in frontend
2. **More Secure**: Client secret stays on backend only
3. **Better Error Handling**: Backend can handle OAuth errors properly
4. **Consistent with Firebase**: Uses Firebase for user management
5. **Easier Deployment**: Only backend needs Google OAuth configuration 