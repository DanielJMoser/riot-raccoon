// src/utils/stockUtils.ts
import { Product, ProductVariant } from '../types/homepageTypes';

/**
 * Mock stock data generator for demonstration purposes
 * In a real application, this data would come from your inventory management system
 */
export const addMockStockData = (product: Product): Product => {
    // Generate mock stock data based on product ID for consistency
    const productHash = product._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Create deterministic but varied stock levels
    const baseStock = (productHash % 50) + 1; // 1-50 items
    const lowThreshold = Math.max(3, Math.floor(baseStock * 0.2)); // 20% of stock as low threshold
    
    // Some products will be out of stock (10% chance)
    const isOutOfStock = (productHash % 10) === 0;
    
    // Some products will have low stock (30% chance if not out of stock)
    const hasLowStock = !isOutOfStock && (productHash % 3) === 0;
    
    const stockQuantity = isOutOfStock ? 0 : hasLowStock ? Math.min(lowThreshold, 3) : baseStock;
    
    const enhancedProduct: Product = {
        ...product,
        inStock: stockQuantity > 0,
        inventory: stockQuantity,
        lowInventoryThreshold: lowThreshold
    };

    // Add mock stock data to variants if they exist
    if (product.variants && product.variants.length > 0) {
        enhancedProduct.variants = product.variants.map((variant, index) => {
            const variantHash = (productHash + index) % 30;
            const variantStock = isOutOfStock ? 0 : Math.max(0, variantHash);
            const variantLowThreshold = Math.max(2, Math.floor(variantStock * 0.25));
            
            return {
                ...variant,
                inStock: variantStock > 0,
                inventory: variantStock,
                lowInventoryThreshold: variantLowThreshold
            } as ProductVariant;
        });
    }

    return enhancedProduct;
};

/**
 * Add mock stock data to an array of products
 */
export const addMockStockDataToProducts = (products: Product[]): Product[] => {
    return products.map(addMockStockData);
};

/**
 * Get stock status message for display
 */
export const getStockStatusMessage = (
    inStock: boolean,
    inventory?: number,
    lowInventoryThreshold: number = 5
): { message: string; type: 'in-stock' | 'low-stock' | 'out-of-stock' } => {
    if (!inStock || inventory === 0) {
        return { message: 'Out of Stock', type: 'out-of-stock' };
    }
    
    if (!inventory) {
        return { message: 'In Stock', type: 'in-stock' };
    }
    
    if (inventory <= lowInventoryThreshold) {
        return { message: `Only ${inventory} left!`, type: 'low-stock' };
    }
    
    return { message: 'In Stock', type: 'in-stock' };
};

/**
 * Mock inventory scenarios for testing
 */
export const MOCK_INVENTORY_SCENARIOS = {
    OUT_OF_STOCK: { inStock: false, inventory: 0, lowInventoryThreshold: 5 },
    LOW_STOCK: { inStock: true, inventory: 3, lowInventoryThreshold: 5 },
    VERY_LOW_STOCK: { inStock: true, inventory: 1, lowInventoryThreshold: 5 },
    NORMAL_STOCK: { inStock: true, inventory: 25, lowInventoryThreshold: 5 },
    HIGH_STOCK: { inStock: true, inventory: 100, lowInventoryThreshold: 10 }
};