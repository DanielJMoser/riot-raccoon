// src/components/ui/LoadingSkeleton.tsx
import React from 'react';
import { IonSkeletonText } from '@ionic/react';
import './LoadingSkeleton.scss';

interface LoadingSkeletonProps {
    variant?: 'text' | 'card' | 'product' | 'hero' | 'avatar';
    count?: number;
    className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
    variant = 'text', 
    count = 1,
    className = '' 
}) => {
    const renderSkeleton = () => {
        switch (variant) {
            case 'text':
                return (
                    <div className={`skeleton-text ${className}`}>
                        {Array.from({ length: count }).map((_, index) => (
                            <IonSkeletonText 
                                key={index}
                                animated 
                                style={{ 
                                    width: `${Math.random() * 40 + 60}%`,
                                    height: '1.2em',
                                    marginBottom: '0.5rem'
                                }} 
                            />
                        ))}
                    </div>
                );

            case 'card':
                return (
                    <div className={`skeleton-card ${className}`}>
                        {Array.from({ length: count }).map((_, index) => (
                            <div key={index} className="skeleton-card-item">
                                <IonSkeletonText animated style={{ width: '100%', height: '200px' }} />
                                <div className="skeleton-card-content">
                                    <IonSkeletonText animated style={{ width: '80%', height: '1.5em' }} />
                                    <IonSkeletonText animated style={{ width: '60%', height: '1em', marginTop: '0.5rem' }} />
                                    <IonSkeletonText animated style={{ width: '40%', height: '1.2em', marginTop: '0.5rem' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'product':
                return (
                    <div className={`skeleton-product ${className}`}>
                        {Array.from({ length: count }).map((_, index) => (
                            <div key={index} className="skeleton-product-item">
                                <div className="skeleton-product-image">
                                    <IonSkeletonText animated style={{ width: '100%', height: '100%' }} />
                                </div>
                                <div className="skeleton-product-info">
                                    <IonSkeletonText animated style={{ width: '70%', height: '1em' }} />
                                    <IonSkeletonText animated style={{ width: '90%', height: '1.3em', marginTop: '0.5rem' }} />
                                    <IonSkeletonText animated style={{ width: '50%', height: '1.5em', marginTop: '0.5rem' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'hero':
                return (
                    <div className={`skeleton-hero ${className}`}>
                        <div className="skeleton-hero-content">
                            <IonSkeletonText animated style={{ width: '60%', height: '3rem', marginBottom: '1rem' }} />
                            <IonSkeletonText animated style={{ width: '80%', height: '1.5rem', marginBottom: '0.5rem' }} />
                            <IonSkeletonText animated style={{ width: '70%', height: '1.5rem', marginBottom: '2rem' }} />
                            <IonSkeletonText animated style={{ width: '200px', height: '3rem' }} />
                        </div>
                        <div className="skeleton-hero-image">
                            <IonSkeletonText animated style={{ width: '100%', height: '100%' }} />
                        </div>
                    </div>
                );

            case 'avatar':
                return (
                    <div className={`skeleton-avatar ${className}`}>
                        {Array.from({ length: count }).map((_, index) => (
                            <IonSkeletonText 
                                key={index}
                                animated 
                                style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%',
                                    marginRight: '1rem'
                                }} 
                            />
                        ))}
                    </div>
                );

            default:
                return (
                    <IonSkeletonText 
                        animated 
                        className={className}
                        style={{ width: '100%', height: '1.5rem' }} 
                    />
                );
        }
    };

    return (
        <div className="loading-skeleton">
            {renderSkeleton()}
        </div>
    );
};

export default LoadingSkeleton;