// src/contexts/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Interfaces
export interface CartItem {
    productId: string;
    productName: string;
    productSlug: string;
    variantId?: string;
    quantity: number;
    price: number;
    image?: any;
    options?: { name: string; value: string }[];
}

export interface Cart {
    id: string;
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    couponCode?: string;
    couponDiscount?: number;
    metadata?: {
        notes?: string;
    };
}

interface CartContextType {
    cart: Cart;
    addToCart: (item: CartItem) => void;
    updateCartItem: (productId: string, variantId: string | undefined, quantity: number) => void;
    removeFromCart: (productId: string, variantId?: string) => void;
    clearCart: () => void;
    isInCart: (productId: string, variantId?: string) => boolean;
    findCartItem: (productId: string, variantId?: string) => CartItem | undefined;
    applyCoupon: (couponCode: string, discount: number) => void;
    removeCoupon: () => void;
    addNote: (note: string) => void;
    loading: boolean;
}

// Default empty cart
const defaultCart: Cart = {
    id: '',
    items: [],
    totalItems: 0,
    totalPrice: 0,
    metadata: {
        notes: ''
    }
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Cart>(defaultCart);
    const [loading, setLoading] = useState<boolean>(true);

    // Initialize cart from localStorage on component mount
    useEffect(() => {
        const initializeCart = () => {
            try {
                const storedCart = localStorage.getItem('cart');
                if (storedCart) {
                    setCart(JSON.parse(storedCart));
                } else {
                    // Create a new cart with a unique ID
                    const newCart = {
                        ...defaultCart,
                        id: uuidv4()
                    };
                    setCart(newCart);
                    localStorage.setItem('cart', JSON.stringify(newCart));
                }
            } catch (error) {
                console.error('Error initializing cart:', error);
                // Fallback to a new cart
                const newCart = {
                    ...defaultCart,
                    id: uuidv4()
                };
                setCart(newCart);
                localStorage.setItem('cart', JSON.stringify(newCart));
            } finally {
                setLoading(false);
            }
        };

        initializeCart();
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, loading]);

    // Calculate cart totals
    const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
        return items.reduce(
            (acc, item) => {
                const itemQuantity = item.quantity;
                const itemPrice = item.price * itemQuantity;
                return {
                    totalItems: acc.totalItems + itemQuantity,
                    totalPrice: acc.totalPrice + itemPrice
                };
            },
            { totalItems: 0, totalPrice: 0 }
        );
    };

    // Find item in cart
    const findCartItem = (productId: string, variantId?: string): CartItem | undefined => {
        return cart.items.find(
            item => item.productId === productId && item.variantId === variantId
        );
    };

    // Check if an item is already in the cart
    const isInCart = (productId: string, variantId?: string): boolean => {
        return cart.items.some(
            item => item.productId === productId && item.variantId === variantId
        );
    };

    // Add item to cart
    const addToCart = (newItem: CartItem) => {
        setCart(prevCart => {
            // Check if the item already exists in the cart
            const existingItemIndex = prevCart.items.findIndex(
                item => item.productId === newItem.productId && item.variantId === newItem.variantId
            );

            let updatedItems;

            if (existingItemIndex >= 0) {
                // Update quantity if item exists
                updatedItems = prevCart.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            } else {
                // Add new item
                updatedItems = [...prevCart.items, newItem];
            }

            // Calculate new totals
            const { totalItems, totalPrice } = calculateTotals(updatedItems);

            return {
                ...prevCart,
                items: updatedItems,
                totalItems,
                totalPrice
            };
        });
    };

    // Update cart item quantity
    const updateCartItem = (productId: string, variantId: string | undefined, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId, variantId);
            return;
        }

        setCart(prevCart => {
            const updatedItems = prevCart.items.map(item =>
                item.productId === productId && item.variantId === variantId
                    ? { ...item, quantity }
                    : item
            );

            const { totalItems, totalPrice } = calculateTotals(updatedItems);

            return {
                ...prevCart,
                items: updatedItems,
                totalItems,
                totalPrice
            };
        });
    };

    // Remove item from cart
    const removeFromCart = (productId: string, variantId?: string) => {
        setCart(prevCart => {
            const updatedItems = prevCart.items.filter(
                item => !(item.productId === productId && item.variantId === variantId)
            );

            const { totalItems, totalPrice } = calculateTotals(updatedItems);

            return {
                ...prevCart,
                items: updatedItems,
                totalItems,
                totalPrice
            };
        });
    };

    // Clear cart
    const clearCart = () => {
        const newCart = {
            ...defaultCart,
            id: uuidv4()
        };
        setCart(newCart);
    };

    // Apply coupon
    const applyCoupon = (couponCode: string, discount: number) => {
        setCart(prevCart => ({
            ...prevCart,
            couponCode,
            couponDiscount: discount
        }));
    };
    
    // Remove coupon
    const removeCoupon = () => {
        setCart(prevCart => {
            const { couponCode, couponDiscount, ...rest } = prevCart;
            return rest;
        });
    };

    // Add note
    const addNote = (note: string) => {
        setCart(prevCart => ({
            ...prevCart,
            metadata: {
                ...prevCart.metadata,
                notes: note
            }
        }));
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateCartItem,
                removeFromCart,
                clearCart,
                isInCart,
                findCartItem,
                applyCoupon,
                removeCoupon,
                addNote,
                loading
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};