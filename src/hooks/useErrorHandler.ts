import { useState, useCallback } from 'react';
import { useIonToast } from '@ionic/react';

export interface ApiError {
  message: string;
  code: number;
  type: 'network' | 'validation' | 'server' | 'unauthorized' | 'unknown';
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ApiError | null>(null);
  const [present] = useIonToast();

  const handleApiError = useCallback((error: unknown): ApiError => {
    if (error instanceof Error) {
      // Network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        return {
          message: error.message,
          code: 0,
          type: 'network'
        };
      }
      
      // Server errors
      return {
        message: error.message,
        code: 500,
        type: 'server'
      };
    }
    
    // Unknown errors
    return {
      message: 'An unexpected error occurred',
      code: 500,
      type: 'unknown'
    };
  }, []);

  const getErrorMessage = useCallback((error: ApiError): string => {
    switch (error.type) {
      case 'network':
        return 'Please check your internet connection and try again';
      case 'validation':
        return 'Please check your input and try again';
      case 'unauthorized':
        return 'Session expired. Please refresh the page';
      case 'server':
        return 'Server error. Please try again later';
      default:
        return 'Something went wrong. Please try again';
    }
  }, []);

  const handleError = useCallback((error: unknown, showToast = true) => {
    const apiError = handleApiError(error);
    setError(apiError);
    
    if (showToast) {
      present({
        message: getErrorMessage(apiError),
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
    }
    
    // Log error for debugging
    console.error('Error handled:', error, apiError);
    
    return apiError;
  }, [handleApiError, getErrorMessage, present]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const showSuccessToast = useCallback((message: string) => {
    present({
      message,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
  }, [present]);

  const showInfoToast = useCallback((message: string) => {
    present({
      message,
      duration: 2000,
      color: 'primary',
      position: 'bottom'
    });
  }, [present]);

  return {
    error,
    handleError,
    clearError,
    showSuccessToast,
    showInfoToast,
    getErrorMessage
  };
};