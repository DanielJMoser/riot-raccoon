/**
 * Security middleware for API requests and form submissions
 */

import { rateLimiter, sanitizeInput, validateCheckoutForm, CheckoutFormData } from '../utils/security';

/**
 * API request wrapper with security measures
 */
export class SecureApiClient {
  private baseUrl: string;
  private rateLimitIdentifier: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    // Use a combination of IP-like identifier for rate limiting
    // In a real app, you'd use actual IP address from server
    this.rateLimitIdentifier = `${window.location.hostname}_${Date.now()}`;
  }

  /**
   * Secure fetch wrapper with rate limiting and error handling
   */
  async secureRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    skipRateLimit: boolean = false
  ): Promise<T> {
    // Rate limiting check
    if (!skipRateLimit && !rateLimiter.isAllowed(this.rateLimitIdentifier)) {
      const remaining = rateLimiter.getRemainingRequests(this.rateLimitIdentifier);
      throw new Error(
        `Rate limit exceeded. ${remaining} requests remaining. Please try again later.`
      );
    }

    // Security headers
    const secureHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      ...options.headers
    };

    // CSRF protection for state-changing operations
    if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method.toUpperCase())) {
      const csrfToken = this.generateCSRFToken();
      secureHeaders['X-CSRF-Token'] = csrfToken;
      
      // Store token for validation if needed
      sessionStorage.setItem('csrf-token', csrfToken);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: secureHeaders,
        credentials: 'same-origin', // Only send cookies for same-origin requests
        referrerPolicy: 'strict-origin-when-cross-origin'
      });

      // Security check: validate response headers
      this.validateResponseHeaders(response);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Sanitize response if it contains user-generated content
      const data = await response.json();
      return this.sanitizeResponseData(data);

    } catch (error) {
      // Log security-relevant errors (in production, send to monitoring service)
      if (error instanceof Error) {
        console.error('Secure API request failed:', {
          endpoint,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
      throw error;
    }
  }

  /**
   * Generate CSRF token for state-changing requests
   */
  private generateCSRFToken(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return btoa(`${timestamp}_${random}`);
  }

  /**
   * Validate security-relevant response headers
   */
  private validateResponseHeaders(response: Response): void {
    const contentType = response.headers.get('content-type');
    
    // Ensure JSON responses have correct content type
    if (contentType && !contentType.includes('application/json')) {
      console.warn('Response content-type is not JSON:', contentType);
    }

    // Check for security headers in responses from our API
    const securityHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection'
    ];

    securityHeaders.forEach(header => {
      if (!response.headers.get(header)) {
        console.warn(`Missing security header: ${header}`);
      }
    });
  }

  /**
   * Sanitize response data to prevent XSS
   */
  private sanitizeResponseData(data: any): any {
    if (typeof data === 'string') {
      return sanitizeInput(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeResponseData(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: any = {};
      Object.keys(data).forEach(key => {
        sanitized[key] = this.sanitizeResponseData(data[key]);
      });
      return sanitized;
    }
    
    return data;
  }

  /**
   * Get remaining rate limit requests
   */
  getRemainingRequests(): number {
    return rateLimiter.getRemainingRequests(this.rateLimitIdentifier);
  }
}

/**
 * Form security middleware
 */
export class SecureFormHandler {
  /**
   * Secure form submission with validation and sanitization
   */
  static async submitSecureForm<T extends Record<string, any>>(
    formData: T,
    validator: (data: T) => { isValid: boolean; errors: string[] },
    submitHandler: (sanitizedData: T) => Promise<any>
  ): Promise<{ success: boolean; data?: any; errors?: string[] }> {
    try {
      // Step 1: Validate form data
      const validation = validator(formData);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Step 2: Sanitize all string inputs
      const sanitizedData = this.sanitizeFormData(formData);

      // Step 3: Additional security checks
      const securityCheck = this.performSecurityChecks(sanitizedData);
      if (!securityCheck.passed) {
        return {
          success: false,
          errors: securityCheck.errors
        };
      }

      // Step 4: Submit with rate limiting
      const result = await submitHandler(sanitizedData);
      
      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('Secure form submission failed:', error);
      return {
        success: false,
        errors: ['Form submission failed. Please try again.']
      };
    }
  }

  /**
   * Sanitize all string fields in form data
   */
  private static sanitizeFormData<T extends Record<string, any>>(data: T): T {
    const sanitized = { ...data };
    
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = sanitizeInput(sanitized[key]);
      }
    });
    
    return sanitized;
  }

  /**
   * Perform additional security checks on form data
   */
  private static performSecurityChecks(data: Record<string, any>): { passed: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\b(union|select|insert|delete|drop|script|javascript|eval)\b/gi,
      /<[^>]*>/g, // HTML tags
      /javascript:/gi,
      /data:text\/html/gi
    ];

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        suspiciousPatterns.forEach(pattern => {
          if (pattern.test(value)) {
            errors.push(`Invalid characters detected in ${key}`);
          }
        });

        // Check field length limits
        if (value.length > 1000 && !['description', 'notes', 'message'].includes(key.toLowerCase())) {
          errors.push(`${key} exceeds maximum length`);
        }
      }
    });

    return {
      passed: errors.length === 0,
      errors
    };
  }
}

/**
 * Checkout form security handler
 */
export class CheckoutSecurityHandler extends SecureFormHandler {
  /**
   * Secure checkout form submission
   */
  static async submitCheckoutForm(
    formData: CheckoutFormData,
    submitHandler: (data: CheckoutFormData) => Promise<any>
  ) {
    return this.submitSecureForm(
      formData,
      validateCheckoutForm,
      submitHandler
    );
  }

  /**
   * Validate payment data (client-side basic checks)
   */
  static validatePaymentData(paymentData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic PayPal validation
    if (paymentData.paymentSource === 'paypal') {
      if (!paymentData.paypalOrderId || typeof paymentData.paypalOrderId !== 'string') {
        errors.push('Invalid PayPal order ID');
      }
      
      if (!paymentData.paypalPayerId || typeof paymentData.paypalPayerId !== 'string') {
        errors.push('Invalid PayPal payer ID');
      }
    }

    // Amount validation
    if (!paymentData.amount || typeof paymentData.amount !== 'number' || paymentData.amount <= 0) {
      errors.push('Invalid payment amount');
    }

    // Currency validation
    if (!paymentData.currency || !['EUR', 'USD', 'GBP'].includes(paymentData.currency)) {
      errors.push('Invalid currency');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Global secure API client instance
 */
export const secureApiClient = new SecureApiClient();

/**
 * HTTPS enforcement utility
 */
export const enforceHTTPS = (): void => {
  if (
    typeof window !== 'undefined' &&
    window.location.protocol !== 'https:' &&
    window.location.hostname !== 'localhost' &&
    !window.location.hostname.startsWith('192.168.') &&
    !window.location.hostname.startsWith('10.') &&
    window.location.hostname !== '127.0.0.1'
  ) {
    console.warn('🔐 Security Warning: Redirecting to HTTPS');
    window.location.href = `https:${window.location.href.substring(window.location.protocol.length)}`;
  }
};

/**
 * Initialize security measures
 */
export const initializeSecurity = (): void => {
  // Enforce HTTPS in production
  if (import.meta.env.NODE_ENV === 'production') {
    enforceHTTPS();
  }

  // Remove development console methods in production
  if (import.meta.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    // Keep console.warn and console.error for important messages
  }

  // Disable right-click context menu in production (optional, can be controversial)
  if (import.meta.env.NODE_ENV === 'production') {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  // Clear sensitive data from session storage on page unload
  window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('csrf-token');
    // Clear any other sensitive session data
  });

  console.log('🔐 Security measures initialized');
};