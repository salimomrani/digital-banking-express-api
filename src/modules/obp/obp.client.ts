import axios, { AxiosInstance, AxiosError } from 'axios';
import logger from '../../core/utils/logger';
import HttpException from '../../core/errors/http-exception';
import {
  OBPConfig,
  DirectLoginCredentials,
  DirectLoginResponse,
  OBPError
} from './obp.types';

/**
 * Open Bank Project API Client
 * Handles authentication and HTTP requests to OBP API
 */
class OBPClient {
  private config: OBPConfig;
  private axiosInstance: AxiosInstance;
  private directLoginToken: string | null = null;

  constructor(config: OBPConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<OBPError>) => {
        logger.error('[OBP Client] API Error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
        });

        if (error.response?.data) {
          const obpError = error.response.data;
          throw new HttpException(
            error.response.status || 500,
            obpError.message || obpError.error || 'OBP API Error'
          );
        }

        throw error;
      }
    );
  }

  /**
   * Authenticate using Direct Login
   * @param credentials User credentials
   * @returns Direct Login token
   */
  async directLogin(credentials: DirectLoginCredentials): Promise<string> {
    try {
      logger.info('[OBP Client] Authenticating with Direct Login...');

      const response = await this.axiosInstance.post<DirectLoginResponse>(
        this.config.directLoginEndpoint,
        {
          username: credentials.username,
          password: credentials.password,
          consumer_key: credentials.consumerKey
        }
      );

      this.directLoginToken = response.data.token;
      logger.info('[OBP Client] Direct Login successful');

      return this.directLoginToken;
    } catch (error) {
      logger.error('[OBP Client] Direct Login failed:', error);
      throw new HttpException(401, 'Failed to authenticate with OBP');
    }
  }

  /**
   * Make authenticated GET request to OBP API
   */
  async get<T>(endpoint: string, token?: string): Promise<T> {
    const authToken = token || this.directLoginToken;

    if (!authToken) {
      throw new HttpException(401, 'No authentication token available. Please login first.');
    }

    const response = await this.axiosInstance.get<T>(endpoint, {
      headers: {
        'DirectLogin': `token="${authToken}"`
      }
    });

    return response.data;
  }

  /**
   * Make authenticated POST request to OBP API
   */
  async post<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const authToken = token || this.directLoginToken;

    if (!authToken) {
      throw new HttpException(401, 'No authentication token available. Please login first.');
    }

    const response = await this.axiosInstance.post<T>(endpoint, data, {
      headers: {
        'DirectLogin': `token="${authToken}"`
      }
    });

    return response.data;
  }

  /**
   * Make authenticated PUT request to OBP API
   */
  async put<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const authToken = token || this.directLoginToken;

    if (!authToken) {
      throw new HttpException(401, 'No authentication token available. Please login first.');
    }

    const response = await this.axiosInstance.put<T>(endpoint, data, {
      headers: {
        'DirectLogin': `token="${authToken}"`
      }
    });

    return response.data;
  }

  /**
   * Make authenticated DELETE request to OBP API
   */
  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const authToken = token || this.directLoginToken;

    if (!authToken) {
      throw new HttpException(401, 'No authentication token available. Please login first.');
    }

    const response = await this.axiosInstance.delete<T>(endpoint, {
      headers: {
        'DirectLogin': `token="${authToken}"`
      }
    });

    return response.data;
  }

  /**
   * Get current Direct Login token
   */
  getToken(): string | null {
    return this.directLoginToken;
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.directLoginToken = null;
  }
}

// Create singleton instance
const obpClient = new OBPClient({
  baseUrl: process.env.OBP_BASE_URL || 'https://apisandbox.openbankproject.com',
  consumerKey: process.env.OBP_CONSUMER_KEY || '',
  consumerSecret: process.env.OBP_CONSUMER_SECRET || '',
  directLoginEndpoint: process.env.OBP_DIRECT_LOGIN_ENDPOINT || '/my/logins/direct'
});

export default obpClient;
