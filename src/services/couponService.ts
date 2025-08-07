// src/services/couponService.ts
export interface Coupon {
    code: string;
    type: 'percentage' | 'fixed' | 'freeShipping';
    value: number;
    description: string;
    minPurchase?: number;
    maxDiscount?: number;
    expiresAt?: Date;
    isActive: boolean;
}

export interface CouponValidationResult {
    isValid: boolean;
    message: string;
    coupon?: Coupon;
    discount?: number;
}

// Mock coupons database
const MOCK_COUPONS: Coupon[] = [
    {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        description: '10% off your first order',
        minPurchase: 0,
        isActive: true
    },
    {
        code: 'SAVE20',
        type: 'percentage',
        value: 20,
        description: '20% off orders over €100',
        minPurchase: 100,
        maxDiscount: 50,
        isActive: true
    },
    {
        code: 'FREESHIP',
        type: 'freeShipping',
        value: 0,
        description: 'Free shipping on any order',
        minPurchase: 0,
        isActive: true
    },
    {
        code: 'FLAT25',
        type: 'fixed',
        value: 25,
        description: '€25 off orders over €150',
        minPurchase: 150,
        isActive: true
    },
    {
        code: 'CYBER50',
        type: 'percentage',
        value: 50,
        description: '50% off - Cyber Monday special',
        minPurchase: 50,
        maxDiscount: 100,
        isActive: true
    }
];

export class CouponService {
    /**
     * Validate a coupon code and calculate discount
     */
    static validateCoupon(
        code: string, 
        subtotal: number, 
        shippingCost: number = 0
    ): CouponValidationResult {
        // Check if code is provided
        if (!code || code.trim() === '') {
            return {
                isValid: false,
                message: 'Please enter a coupon code'
            };
        }

        // Find coupon (case-insensitive)
        const coupon = MOCK_COUPONS.find(
            c => c.code.toUpperCase() === code.toUpperCase()
        );

        // Check if coupon exists
        if (!coupon) {
            return {
                isValid: false,
                message: 'Invalid coupon code'
            };
        }

        // Check if coupon is active
        if (!coupon.isActive) {
            return {
                isValid: false,
                message: 'This coupon is no longer active'
            };
        }

        // Check expiration date
        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return {
                isValid: false,
                message: 'This coupon has expired'
            };
        }

        // Check minimum purchase requirement
        if (coupon.minPurchase && subtotal < coupon.minPurchase) {
            return {
                isValid: false,
                message: `Minimum purchase of €${coupon.minPurchase} required`
            };
        }

        // Calculate discount based on coupon type
        let discount = 0;
        
        switch (coupon.type) {
            case 'percentage':
                discount = (subtotal * coupon.value) / 100;
                // Apply max discount cap if specified
                if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                    discount = coupon.maxDiscount;
                }
                break;
                
            case 'fixed':
                discount = Math.min(coupon.value, subtotal); // Can't discount more than subtotal
                break;
                
            case 'freeShipping':
                discount = shippingCost;
                break;
        }

        return {
            isValid: true,
            message: `Coupon applied: ${coupon.description}`,
            coupon,
            discount: Math.round(discount * 100) / 100 // Round to 2 decimal places
        };
    }

    /**
     * Get list of available coupon codes for display
     */
    static getAvailableCoupons(): string[] {
        return MOCK_COUPONS
            .filter(c => c.isActive)
            .map(c => c.code);
    }

    /**
     * Format discount display based on coupon type
     */
    static formatDiscount(coupon: Coupon): string {
        switch (coupon.type) {
            case 'percentage':
                return `${coupon.value}% OFF`;
            case 'fixed':
                return `€${coupon.value} OFF`;
            case 'freeShipping':
                return 'FREE SHIPPING';
            default:
                return '';
        }
    }
}