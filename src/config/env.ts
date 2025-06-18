interface EnvironmentConfig {
  VITE_SANITY_PROJECT_ID: string;
  VITE_SANITY_API_TOKEN: string;
  VITE_PAYPAL_CLIENT_ID: string;
}

const requiredEnvVars = [
  'VITE_SANITY_PROJECT_ID',
  'VITE_SANITY_API_TOKEN',
  'VITE_PAYPAL_CLIENT_ID'
] as const;

export const validateEnvironment = (): EnvironmentConfig => {
  const missing: string[] = [];
  const invalid: string[] = [];

  for (const envVar of requiredEnvVars) {
    const value = import.meta.env[envVar];
    
    if (!value) {
      missing.push(envVar);
    } else if (typeof value !== 'string' || value.trim() === '') {
      invalid.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  if (invalid.length > 0) {
    throw new Error(
      `Invalid environment variables (empty or not string): ${invalid.join(', ')}\n` +
      'Please check your .env file and ensure all variables have valid values.'
    );
  }

  // Additional validation for specific variables
  if (!import.meta.env.VITE_SANITY_PROJECT_ID.match(/^[a-z0-9]+$/)) {
    throw new Error('VITE_SANITY_PROJECT_ID must contain only lowercase letters and numbers');
  }

  if (!import.meta.env.VITE_PAYPAL_CLIENT_ID.startsWith('A')) {
    console.warn('VITE_PAYPAL_CLIENT_ID should typically start with "A" for production PayPal client IDs');
  }

  return {
    VITE_SANITY_PROJECT_ID: import.meta.env.VITE_SANITY_PROJECT_ID,
    VITE_SANITY_API_TOKEN: import.meta.env.VITE_SANITY_API_TOKEN,
    VITE_PAYPAL_CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID
  };
};

export const getEnvironmentConfig = (): EnvironmentConfig => {
  try {
    return validateEnvironment();
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw error;
  }
};