import { API_CONFIG, getAuthHeader, buildURL } from './config';
import { APIError, APIResponse } from './types';

/**
 * HTTP Client Options
 */
interface RequestOptions extends RequestInit {
  timeout?: number;
  requireAuth?: boolean;
}

/**
 * Generic HTTP client for API requests
 * Handles authentication, timeouts, and error formatting
 */
class HTTPClient {
  /**
   * Make HTTP request with timeout and error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = API_CONFIG.timeout,
      requireAuth = true,
      headers = {},
      ...restOptions
    } = options;

    // Build headers
    const requestHeaders: HeadersInit = {
      ...API_CONFIG.headers,
      ...headers,
    };

    // Add authentication header if required
    if (requireAuth) {
      Object.assign(requestHeaders, getAuthHeader());
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(buildURL(endpoint), {
        ...restOptions,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-JSON responses (e.g., 204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      // Handle error responses
      if (!response.ok) {
        throw new APIError(
          data.message || 'An error occurred',
          response.status,
          data.errors
        );
      }

      // Return unwrapped data if it's an API response envelope
      if (data && 'data' in data) {
        return data.data as T;
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new APIError('Request timeout', 408);
      }

      // Re-throw API errors
      if (error instanceof APIError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new APIError('Network error. Please check your connection.', 0);
      }

      // Generic error
      throw new APIError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const httpClient = new HTTPClient();
