// Mock authentication service for development
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    displayName: string;
    email: string;
    organizationId?: string;
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
}

export interface GoogleSignInData {
  idToken: string;
}

// Mock user database (in production, this would be in your backend)
const mockUsers: any[] = [];

// Backend configuration - Updated to correct port
const BACKEND_BASE_URL = 'http://localhost:3000';

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
    // Try to connect to backend first
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    // Fallback to mock authentication
    return mockLogin(data);
  }
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    // Try to connect to backend first
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    // Fallback to mock authentication
    return mockRegister(data);
  }
}

export async function googleSignIn(data: GoogleSignInData): Promise<AuthResponse> {
  try {
    // Try to connect to backend first
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    // Fallback to mock authentication
    return mockGoogleSignIn(data);
  }
} 