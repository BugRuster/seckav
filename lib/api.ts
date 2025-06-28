// General API service utility for SecKav platform
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}

// Backend configuration
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

// Helper function to make authenticated requests
export async function makeApiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data,
        statusCode: response.status,
      };
    } else {
      return {
        success: false,
        error: data.error || data.message || 'Request failed',
        message: data.message || 'Request failed',
        statusCode: response.status,
      };
    }
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      message: 'Unable to connect to server',
      statusCode: 0,
    };
  }
}

// Specific API endpoint functions
export class ApiService {
  private token: string | null;

  constructor(token?: string) {
    this.token = token || null;
  }

  setToken(token: string) {
    this.token = token;
  }

  // GET request
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return makeApiRequest<T>(endpoint, { method: 'GET' }, this.token || undefined);
  }

  // POST request
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return makeApiRequest<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      this.token || undefined
    );
  }

  // PUT request
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return makeApiRequest<T>(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      this.token || undefined
    );
  }

  // DELETE request
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return makeApiRequest<T>(endpoint, { method: 'DELETE' }, this.token || undefined);
  }

  // File upload
  async upload<T = any>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {};
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data,
          statusCode: response.status,
        };
      } else {
        return {
          success: false,
          error: data.error || data.message || 'Upload failed',
          message: data.message || 'Upload failed',
          statusCode: response.status,
        };
      }
    } catch (error) {
      console.error(`Upload failed for ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload error',
        message: 'Unable to upload file',
        statusCode: 0,
      };
    }
  }
}

// Singleton instance for global use
export const apiService = new ApiService();

// Hook for using API service with current auth token
export function useApiService(token?: string) {
  if (token) {
    apiService.setToken(token);
  }
  return apiService;
}

// Error handling utility
export function handleApiError(error: ApiResponse<any>): string {
  if (error.statusCode === 401) {
    return 'Session expired. Please log in again.';
  } else if (error.statusCode === 403) {
    return 'Access denied. You don\'t have permission for this action.';
  } else if (error.statusCode === 404) {
    return 'Resource not found.';
  } else if (error.statusCode === 500) {
    return 'Server error. Please try again later.';
  } else if (error.statusCode === 0) {
    return 'Network error. Please check your connection.';
  } else {
    return error.message || error.error || 'An unexpected error occurred.';
  }
}

// Network status utility
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// Rate limiting helper
export function createRateLimitedRequest(fn: Function, limit: number = 5, window: number = 1000) {
  const calls: number[] = [];
  
  return async (...args: any[]) => {
    const now = Date.now();
    
    // Remove calls outside the time window
    while (calls.length > 0 && calls[0] <= now - window) {
      calls.shift();
    }
    
    if (calls.length >= limit) {
      throw new Error(`Rate limit exceeded. Max ${limit} calls per ${window}ms.`);
    }
    
    calls.push(now);
    return fn(...args);
  };
} 