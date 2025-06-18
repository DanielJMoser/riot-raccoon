import { describe, test, expect, vi, beforeEach } from 'vitest';
import { validateEnvironment, getEnvironmentConfig } from './env';

// Mock import.meta.env
const mockEnv = {
  VITE_SANITY_PROJECT_ID: '',
  VITE_SANITY_API_TOKEN: '',
  VITE_PAYPAL_CLIENT_ID: ''
};

vi.stubGlobal('import', {
  meta: {
    env: mockEnv
  }
});

describe('Environment Configuration', () => {
  beforeEach(() => {
    // Reset mock environment
    mockEnv.VITE_SANITY_PROJECT_ID = '';
    mockEnv.VITE_SANITY_API_TOKEN = '';
    mockEnv.VITE_PAYPAL_CLIENT_ID = '';
  });

  describe('validateEnvironment', () => {
    test('should throw error when required variables are missing', () => {
      expect(() => validateEnvironment()).toThrow(
        'Missing required environment variables: VITE_SANITY_PROJECT_ID, VITE_SANITY_API_TOKEN, VITE_PAYPAL_CLIENT_ID'
      );
    });

    test('should throw error when variables are empty strings', () => {
      mockEnv.VITE_SANITY_PROJECT_ID = '';
      mockEnv.VITE_SANITY_API_TOKEN = 'test-token';
      mockEnv.VITE_PAYPAL_CLIENT_ID = 'test-client-id';

      expect(() => validateEnvironment()).toThrow(
        'Invalid environment variables (empty or not string): VITE_SANITY_PROJECT_ID'
      );
    });

    test('should throw error for invalid Sanity project ID format', () => {
      mockEnv.VITE_SANITY_PROJECT_ID = 'Invalid-Project-ID!';
      mockEnv.VITE_SANITY_API_TOKEN = 'test-token';
      mockEnv.VITE_PAYPAL_CLIENT_ID = 'test-client-id';

      expect(() => validateEnvironment()).toThrow(
        'VITE_SANITY_PROJECT_ID must contain only lowercase letters and numbers'
      );
    });

    test('should return config when all variables are valid', () => {
      mockEnv.VITE_SANITY_PROJECT_ID = 'validproject123';
      mockEnv.VITE_SANITY_API_TOKEN = 'sk_test_123456789';
      mockEnv.VITE_PAYPAL_CLIENT_ID = 'Af_test_client_id_123';

      const config = validateEnvironment();

      expect(config).toEqual({
        VITE_SANITY_PROJECT_ID: 'validproject123',
        VITE_SANITY_API_TOKEN: 'sk_test_123456789',
        VITE_PAYPAL_CLIENT_ID: 'Af_test_client_id_123'
      });
    });

    test('should warn for PayPal client ID not starting with A', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      mockEnv.VITE_SANITY_PROJECT_ID = 'validproject123';
      mockEnv.VITE_SANITY_API_TOKEN = 'sk_test_123456789';
      mockEnv.VITE_PAYPAL_CLIENT_ID = 'Bf_test_client_id_123'; // Starts with B instead of A

      validateEnvironment();

      expect(consoleSpy).toHaveBeenCalledWith(
        'VITE_PAYPAL_CLIENT_ID should typically start with "A" for production PayPal client IDs'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('getEnvironmentConfig', () => {
    test('should return validated config', () => {
      mockEnv.VITE_SANITY_PROJECT_ID = 'validproject123';
      mockEnv.VITE_SANITY_API_TOKEN = 'sk_test_123456789';
      mockEnv.VITE_PAYPAL_CLIENT_ID = 'Af_test_client_id_123';

      const config = getEnvironmentConfig();

      expect(config).toEqual({
        VITE_SANITY_PROJECT_ID: 'validproject123',
        VITE_SANITY_API_TOKEN: 'sk_test_123456789',
        VITE_PAYPAL_CLIENT_ID: 'Af_test_client_id_123'
      });
    });

    test('should throw and log error for invalid config', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => getEnvironmentConfig()).toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Environment validation failed:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});