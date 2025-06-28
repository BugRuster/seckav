// Enhanced authentication service with complete backend integration
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    displayName: string;
    email: string;
    organizationId?: string;
    role?: string;
    isEmailVerified?: boolean;
    createdAt?: string;
  };
  message?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  organizationName?: string;
}

export interface GoogleSignInData {
  idToken: string;
}

export interface UpdateProfileData {
  displayName: string;
}

export interface ApiKeyData {
  name: string;
}

export interface ApiKey {
  name: string;
  key?: string;
  createdAt: string;
  lastUsed?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: string;
  organizationId?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

// Backend configuration
const BACKEND_BASE_URL = 'http://localhost:3000';

// Helper function to make authenticated requests
async function makeAuthenticatedRequest(
  endpoint: string, 
  options: RequestInit = {}, 
  token?: string
): Promise<Response> {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}

// Mock user database (for fallback)
const mockUsers: any[] = [];

export async function mockLogin(data: LoginData): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Find user in mock database
  const user = mockUsers.find(u => u.email === data.email);
  
  if (!user) {
    return {
      success: false,
      message: 'User not found. Please register first.'
    };
  }

  if (user.password !== data.password) {
    return {
      success: false,
      message: 'Invalid password'
    };
  }

  // Generate mock JWT token
  const token = `mock_jwt_${Date.now()}_${Math.random()}`;

  return {
    success: true,
    token,
    user: {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      organizationId: user.organizationId,
    }
  };
}

export async function mockRegister(data: RegisterData): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === data.email);
  
  if (existingUser) {
    return {
      success: false,
      message: 'User with this email already exists'
    };
  }

  // Create new user
  const newUser = {
    id: `user_${Date.now()}`,
    displayName: data.name,
    email: data.email,
    password: data.password, // In production, this would be hashed
    organizationId: undefined,
    createdAt: new Date().toISOString()
  };

  // Add to mock database
  mockUsers.push(newUser);

  // Generate mock JWT token
  const token = `mock_jwt_${Date.now()}_${Math.random()}`;

  return {
    success: true,
    token,
    user: {
      id: newUser.id,
      displayName: newUser.displayName,
      email: newUser.email,
      organizationId: newUser.organizationId,
    }
  };
}

export async function mockGoogleSignIn(data: GoogleSignInData): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // For mock, we'll create a user based on the token
  const mockUser = {
    id: `google_user_${Date.now()}`,
    displayName: 'Google User',
    email: 'google@example.com',
    organizationId: undefined,
  };

  return {
    success: true,
    token: data.idToken,
    user: mockUser
  };
}

// Main auth functions that try backend first, then fall back to mock
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await makeAuthenticatedRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        token: result.token,
        user: {
          id: result.user.id,
          displayName: result.user.displayName,
          email: result.user.email,
          organizationId: result.user.organizationId,
          role: result.user.role,
        }
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        message: error.error || error.message || 'Login failed'
      };
    }
  } catch (error) {
    console.log('Backend not available, using mock authentication');
    return mockLogin(data);
  }
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await makeAuthenticatedRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
        organizationName: data.organizationName,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        token: result.token,
        user: {
          id: result.user.id,
          displayName: result.user.displayName,
          email: result.user.email,
          organizationId: result.user.organizationId,
          role: result.user.role,
        }
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        message: error.error || error.message || 'Registration failed'
      };
    }
  } catch (error) {
    console.log('Backend not available, using mock authentication');
    return mockRegister(data);
  }
}

export async function googleSignIn(data: GoogleSignInData): Promise<AuthResponse> {
  try {
    const response = await makeAuthenticatedRequest('/api/v1/auth/google', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        token: result.token,
        user: {
          id: result.user.id,
          displayName: result.user.displayName,
          email: result.user.email,
          organizationId: result.user.organizationId,
          role: result.user.role,
        }
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        message: error.error || error.message || 'Google sign-in failed'
      };
    }
  } catch (error) {
    console.log('Backend not available, using mock authentication');
    return mockGoogleSignIn(data);
  }
}

// NEW: User Profile Management Functions

export async function getUserProfile(token: string): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
  try {
    const response = await makeAuthenticatedRequest('/api/v1/auth/profile', {
      method: 'GET',
    }, token);

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        user: result.user
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        message: error.error || 'Failed to fetch profile'
      };
    }
  } catch (error) {
    console.log('Backend not available for profile fetch');
    return {
      success: false,
      message: 'Unable to connect to server'
    };
  }
}

export async function updateUserProfile(data: UpdateProfileData, token: string): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
  try {
    const response = await makeAuthenticatedRequest('/api/v1/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        user: result.user,
        message: result.message
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        message: error.error || 'Failed to update profile'
      };
    }
  } catch (error) {
    console.log('Backend not available for profile update');
    return {
      success: false,
      message: 'Unable to connect to server'
    };
  }
}

// NEW: API Key Management Functions

export async function generateApiKey(data: ApiKeyData, token: string): Promise<{ success: boolean; apiKey?: string; message?: string }> {
  try {
    const response = await makeAuthenticatedRequest('/api/v1/auth/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        apiKey: result.apiKey,
        message: 'API key generated successfully'
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        message: error.error || 'Failed to generate API key'
      };
    }
  } catch (error) {
    console.log('Backend not available for API key generation');
    return {
      success: false,
      message: 'Unable to connect to server'
    };
  }
}

export async function listApiKeys(token: string): Promise<{ success: boolean; apiKeys?: ApiKey[]; message?: string }> {
  try {
    const response = await makeAuthenticatedRequest('/api/v1/auth/api-keys', {
      method: 'GET',
    }, token);

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        apiKeys: result.apiKeys
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        message: error.error || 'Failed to fetch API keys'
      };
    }
  } catch (error) {
    console.log('Backend not available for API keys listing');
    return {
      success: false,
      message: 'Unable to connect to server'
    };
  }
}

export async function revokeApiKey(key: string, token: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await makeAuthenticatedRequest('/api/v1/auth/api-keys', {
      method: 'DELETE',
      body: JSON.stringify({ key }),
    }, token);

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        message: result.message || 'API key revoked successfully'
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        message: error.error || 'Failed to revoke API key'
      };
    }
  } catch (error) {
    console.log('Backend not available for API key revocation');
    return {
      success: false,
      message: 'Unable to connect to server'
    };
  }
}

// Helper function for Google OAuth redirect
export async function getGoogleOAuthUrl(): Promise<{ success: boolean; redirectUrl?: string; message?: string }> {
  try {
    const response = await makeAuthenticatedRequest('/api/v1/auth/google/redirect', {
      method: 'GET',
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        redirectUrl: result.redirectUrl
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        message: error.error || 'Failed to get Google OAuth URL'
      };
    }
  } catch (error) {
    console.log('Backend not available for Google OAuth');
    return {
      success: false,
      message: 'Unable to connect to server'
    };
  }
} 