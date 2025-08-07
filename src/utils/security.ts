/**
 * Security utilities for input validation and sanitization
 */

// Input sanitization patterns
const SECURITY_PATTERNS = {
  // Prevent XSS attacks
  XSS_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi,
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi
  ],
  
  // SQL injection patterns
  SQL_INJECTION: /(\b(union|select|insert|delete|update|drop|create|alter|exec|execute)\b)/gi,
  
  // Email validation
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Phone number validation (international format)
  PHONE: /^\+?[1-9]\d{1,14}$/,
  
  // Name validation (letters, spaces, hyphens, apostrophes)
  NAME: /^[a-zA-ZÀ-ÿ\s'-]{1,50}$/,
  
  // Address validation (alphanumeric, spaces, common punctuation)
  ADDRESS: /^[a-zA-Z0-9\s,.-]{1,100}$/,
  
  // Postal code validation (flexible for international use)
  POSTAL_CODE: /^[a-zA-Z0-9\s-]{3,10}$/,
  
  // Credit card number (basic format check)
  CREDIT_CARD: /^[0-9]{13,19}$/
};

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input.trim();
  
  // Remove potential XSS patterns
  SECURITY_PATTERNS.XSS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  // Remove SQL injection patterns
  sanitized = sanitized.replace(SECURITY_PATTERNS.SQL_INJECTION, '');
  
  // Encode HTML entities
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
    
  return sanitized;
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return SECURITY_PATTERNS.EMAIL.test(email.trim());
};

/**
 * Validates phone number format
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  const cleanPhone = phone.replace(/[\s()-]/g, '');
  return SECURITY_PATTERNS.PHONE.test(cleanPhone);
};

/**
 * Validates name format
 */
export const validateName = (name: string): boolean => {
  if (!name || typeof name !== 'string') {
    return false;
  }
  return SECURITY_PATTERNS.NAME.test(name.trim());
};

/**
 * Validates address format
 */
export const validateAddress = (address: string): boolean => {
  if (!address || typeof address !== 'string') {
    return false;
  }
  return SECURITY_PATTERNS.ADDRESS.test(address.trim());
};

/**
 * Validates postal code format
 */
export const validatePostalCode = (postalCode: string): boolean => {
  if (!postalCode || typeof postalCode !== 'string') {
    return false;
  }
  return SECURITY_PATTERNS.POSTAL_CODE.test(postalCode.trim());
};

/**
 * Validates credit card number format (basic check)
 */
export const validateCreditCard = (cardNumber: string): boolean => {
  if (!cardNumber || typeof cardNumber !== 'string') {
    return false;
  }
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  return SECURITY_PATTERNS.CREDIT_CARD.test(cleanNumber);
};

/**
 * Rate limiter for API calls (client-side basic implementation)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Checks if request is allowed under rate limit
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the time window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  /**
   * Gets remaining requests for identifier
   */
  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

/**
 * Global rate limiter instance
 */
export const rateLimiter = new RateLimiter();

/**
 * Validates form data for checkout
 */
export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export const validateCheckoutForm = (data: CheckoutFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Sanitize and validate email
  const sanitizedEmail = sanitizeInput(data.email);
  if (!validateEmail(sanitizedEmail)) {
    errors.push('Invalid email address format');
  }

  // Validate names
  const sanitizedFirstName = sanitizeInput(data.firstName);
  if (!validateName(sanitizedFirstName)) {
    errors.push('First name contains invalid characters or is too long');
  }

  const sanitizedLastName = sanitizeInput(data.lastName);
  if (!validateName(sanitizedLastName)) {
    errors.push('Last name contains invalid characters or is too long');
  }

  // Validate address
  const sanitizedAddress = sanitizeInput(data.address);
  if (!validateAddress(sanitizedAddress)) {
    errors.push('Address contains invalid characters or is too long');
  }

  // Validate city
  const sanitizedCity = sanitizeInput(data.city);
  if (!validateName(sanitizedCity)) {
    errors.push('City name contains invalid characters or is too long');
  }

  // Validate state
  const sanitizedState = sanitizeInput(data.state);
  if (!validateName(sanitizedState)) {
    errors.push('State/Province contains invalid characters or is too long');
  }

  // Validate postal code
  const sanitizedPostalCode = sanitizeInput(data.postalCode);
  if (!validatePostalCode(sanitizedPostalCode)) {
    errors.push('Invalid postal code format');
  }

  // Validate country
  const sanitizedCountry = sanitizeInput(data.country);
  if (!validateName(sanitizedCountry)) {
    errors.push('Country contains invalid characters or is too long');
  }

  // Validate phone if provided
  if (data.phone) {
    const sanitizedPhone = sanitizeInput(data.phone);
    if (!validatePhone(sanitizedPhone)) {
      errors.push('Invalid phone number format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Content Security Policy configuration
 */
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite in development
    "https://www.paypal.com",
    "https://www.paypalobjects.com",
    "https://js.stripe.com" // If using Stripe
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components and CSS-in-JS
    "https://fonts.googleapis.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com",
    "data:"
  ],
  'img-src': [
    "'self'",
    "https://cdn.sanity.io", // Sanity images
    "https://www.paypalobjects.com",
    "data:",
    "blob:"
  ],
  'connect-src': [
    "'self'",
    "https://api.sanity.io",
    "https://l6v56id4.api.sanity.io", // Your specific Sanity project
    "https://api.paypal.com",
    "https://api.sandbox.paypal.com",
    "wss:" // For hot reload in development
  ],
  'frame-src': [
    "'self'",
    "https://www.paypal.com",
    "https://js.stripe.com"
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};

/**
 * Generates CSP header string
 */
export const generateCSPHeader = (isDevelopment: boolean = false): string => {
  const csp = { ...CSP_CONFIG };
  
  if (isDevelopment) {
    // Add development-specific sources
    csp['script-src'].push("'unsafe-eval'"); // Required for Vite HMR
    csp['connect-src'].push("ws://localhost:*", "http://localhost:*");
  }
  
  return Object.entries(csp)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};