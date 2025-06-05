import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { ReactNode } from 'react';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Test wrapper component
const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

// Mock product for testing
const mockProduct = {
  _id: 'test-product-1',
  title: 'Test Product',
  slug: { current: 'test-product' },
  description: 'A test product',
  price: 29.99,
  mainImage: {
    asset: {
      _ref: 'image-test-ref',
      _type: 'reference'
    }
  },
  category: { _ref: 'category-test', _type: 'reference' },
  _createdAt: '2023-01-01T00:00:00Z',
  _updatedAt: '2023-01-01T00:00:00Z',
  _rev: 'test-rev',
  _type: 'product'
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  test('should initialize with empty cart', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    expect(result.current.cart.items).toHaveLength(0);
    expect(result.current.cart.totalItems).toBe(0);
    expect(result.current.cart.totalPrice).toBe(0);
  });

  test('should load cart from localStorage on initialization', () => {
    const savedCart = {
      items: [{
        productId: 'test-product-1',
        productName: 'Test Product',
        price: 29.99,
        quantity: 2,
        variantId: undefined,
        options: []
      }],
      totalItems: 2,
      totalPrice: 59.98,
      metadata: {}
    };
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedCart));
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.totalItems).toBe(2);
    expect(result.current.cart.totalPrice).toBe(59.98);
  });

  test('should add item to cart', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct, 2);
    });
    
    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].productId).toBe('test-product-1');
    expect(result.current.cart.items[0].quantity).toBe(2);
    expect(result.current.cart.totalItems).toBe(2);
    expect(result.current.cart.totalPrice).toBe(59.98);
  });

  test('should update quantity when adding existing item', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct, 1);
    });
    
    act(() => {
      result.current.addToCart(mockProduct, 2);
    });
    
    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].quantity).toBe(3);
    expect(result.current.cart.totalItems).toBe(3);
  });

  test('should remove item from cart', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct, 2);
    });
    
    act(() => {
      result.current.removeFromCart('test-product-1', undefined);
    });
    
    expect(result.current.cart.items).toHaveLength(0);
    expect(result.current.cart.totalItems).toBe(0);
    expect(result.current.cart.totalPrice).toBe(0);
  });

  test('should update item quantity', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct, 3);
    });
    
    act(() => {
      result.current.updateQuantity('test-product-1', undefined, 5);
    });
    
    expect(result.current.cart.items[0].quantity).toBe(5);
    expect(result.current.cart.totalItems).toBe(5);
    expect(result.current.cart.totalPrice).toBe(149.95);
  });

  test('should clear cart', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct, 2);
    });
    
    act(() => {
      result.current.clearCart();
    });
    
    expect(result.current.cart.items).toHaveLength(0);
    expect(result.current.cart.totalItems).toBe(0);
    expect(result.current.cart.totalPrice).toBe(0);
  });

  test('should persist cart to localStorage when cart changes', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct, 1);
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'riotRaccoonCart',
      expect.stringContaining('test-product-1')
    );
  });

  test('should handle localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    // Should still initialize with empty cart despite localStorage error
    expect(result.current.cart.items).toHaveLength(0);
  });
});