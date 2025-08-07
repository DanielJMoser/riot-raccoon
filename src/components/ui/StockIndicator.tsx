// src/components/ui/StockIndicator.tsx
import React from 'react';
import { IonIcon } from '@ionic/react';
import { flame, alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import './StockIndicator.scss';

interface StockIndicatorProps {
    inStock: boolean;
    inventory?: number | undefined;
    lowInventoryThreshold?: number | undefined;
    variant?: 'inline' | 'badge' | 'detailed';
    showIcon?: boolean;
}

const StockIndicator: React.FC<StockIndicatorProps> = ({
    inStock,
    inventory,
    lowInventoryThreshold = 5, // Default threshold for "low stock"
    variant = 'inline',
    showIcon = true
}) => {
    if (!inStock) {
        return (
            <div className={`stock-indicator out-of-stock ${variant}`}>
                {showIcon && <IonIcon icon={alertCircleOutline} />}
                <span>Out of Stock</span>
            </div>
        );
    }

    if (!inventory) {
        // If no stock quantity provided, just show "In Stock"
        return (
            <div className={`stock-indicator in-stock ${variant}`}>
                {showIcon && <IonIcon icon={checkmarkCircleOutline} />}
                <span>In Stock</span>
            </div>
        );
    }

    // Check if stock is low
    const isLowStock = inventory <= lowInventoryThreshold;
    
    if (isLowStock) {
        return (
            <div className={`stock-indicator low-stock ${variant}`}>
                {showIcon && <IonIcon icon={flame} />}
                <span>Only {inventory} left!</span>
            </div>
        );
    }

    // High stock - show different messages based on variant
    if (variant === 'detailed') {
        return (
            <div className={`stock-indicator in-stock ${variant}`}>
                {showIcon && <IonIcon icon={checkmarkCircleOutline} />}
                <span>{inventory} in stock</span>
            </div>
        );
    }

    // For inline/badge variants, just show "In Stock" for high quantities
    return (
        <div className={`stock-indicator in-stock ${variant}`}>
            {showIcon && <IonIcon icon={checkmarkCircleOutline} />}
            <span>In Stock</span>
        </div>
    );
};

export default StockIndicator;