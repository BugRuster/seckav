// Mock authentication service for development
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    organizationId?: string;
    organizationName?: string;
  };
  message?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
}

// Mock user database (in production, this would be in your backend)
const mockUsers: any[] = [];

// Backend configuration
const BACKEND_BASE_URL = 'http://localhost:8000';

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
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      organizationId: user.organizationId,
      organizationName: user.organizationName
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
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password, // In production, this would be hashed
    organizationId: `org_${Date.now()}`,
    organizationName: data.organizationName,
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
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      organizationId: newUser.organizationId,
      organizationName: newUser.organizationName
    }
  };
}

// Main auth functions that try backend first, then fall back to mock
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  try {
    // Try to connect to backend first
    const response = await fetch('/api/v1/auth/login', {
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
        user: result.user
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'Login failed'
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
    // Transform frontend data to backend format
    const backendData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      organizationName: data.organizationName
    };

    // Try to connect to backend first
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        token: result.token,
        user: result.user
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  } catch (error) {
    console.log('Backend not available, using mock authentication');
    // Fallback to mock authentication
    return mockRegister(data);
  }
} 