import React, { useState, useEffect } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Product } from '../types/homepageTypes';
import AnimatedProductCard from '../components/AnimatedProductCard';
import { AnimatedElement, CRTScreen } from '../animations/AnimationUtils';
import { useAnimation } from '../animations/AnimationContext';
import '../scss/components/AnimatedProductGrid.scss';

interface AnimatedProductGridProps {
    products: Product[];
    loading?: boolean;
    gridSizes?: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
    };
    showCrtEffect?: boolean;
}

const AnimatedProductGrid: React.FC<AnimatedProductGridProps> = ({
                                                                     products,
                                                                     loading = false,
                                                                     gridSizes = { xs: '12', sm: '6', md: '4', lg: '3' },
                                                                     showCrtEffect = true
                                                                 }) => {
    const [renderedProducts, setRenderedProducts] = useState<Product[]>([]);
    const { isAnimating } = useAnimation();

    // Progressively render products for a staggered effect
    useEffect(() => {
        if (loading || isAnimating) {
            setRenderedProducts([]);
            return;
        }

        // Render products in batches for a staggered effect
        const batchSize = 4;
        let currentIndex = 0;

        if (renderedProducts.length === products.length) {
            return;
        }

        const renderBatch = () => {
            if (currentIndex >= products.length) {
                return;
            }

            const nextBatch = products.slice(0, currentIndex + batchSize);
            setRenderedProducts(nextBatch);
            currentIndex += batchSize;

            if (currentIndex < products.length) {
                setTimeout(renderBatch, 200);
            }
        };

        // Start rendering after a small delay
        const timeoutId = setTimeout(renderBatch, 300);
        return () => clearTimeout(timeoutId);
    }, [products, loading, isAnimating, renderedProducts.length]);

    // Generate random "scan" effect for empty product slots
    const generateRandomScanLines = (count: number) => {
        return Array.from({ length: count }).map((_, index) => (
            <IonCol
                key={`empty-${index}`}
                size={gridSizes.xs}
                sizeSm={gridSizes.sm}
                sizeMd={gridSizes.md}
                sizeLg={gridSizes.lg}
            >
                <div className="empty-product-placeholder">
                    <div className="scan-line"
                         style={{
                             animationDelay: `${Math.random() * 2}s`,
                             animationDuration: `${2 + Math.random() * 3}s`
                         }}
                    ></div>
                </div>
            </IonCol>
        ));
    };

    // Calculate empty slots to show placeholders
    const emptySlots = Math.max(0, products.length - renderedProducts.length);
    const emptySlotElements = generateRandomScanLines(emptySlots);

    return (
        <div className="animated-product-grid-container">
            {showCrtEffect ? (
                <CRTScreen scanlines={true} flicker={true} glow={true} rounded={false}>
                    <AnimatedElement animation="fade-in" delay={200} duration={500}>
                        <IonGrid className="animated-product-grid">
                            <IonRow>
                                {renderedProducts.map((product, index) => (
                                    <IonCol
                                        key={product._id}
                                        size={gridSizes.xs}
                                        sizeSm={gridSizes.sm}
                                        sizeMd={gridSizes.md}
                                        sizeLg={gridSizes.lg}
                                    >
                                        <AnimatedProductCard
                                            product={product}
                                            index={index}
                                        />
                                    </IonCol>
                                ))}
                                {emptySlotElements}
                            </IonRow>
                        </IonGrid>
                    </AnimatedElement>
                </CRTScreen>
            ) : (
                <AnimatedElement animation="fade-in" delay={200} duration={500}>
                    <IonGrid className="animated-product-grid">
                        <IonRow>
                            {renderedProducts.map((product, index) => (
                                <IonCol
                                    key={product._id}
                                    size={gridSizes.xs}
                                    sizeSm={gridSizes.sm}
                                    sizeMd={gridSizes.md}
                                    sizeLg={gridSizes.lg}
                                >
                                    <AnimatedProductCard
                                        product={product}
                                        index={index}
                                    />
                                </IonCol>
                            ))}
                            {emptySlotElements}
                        </IonRow>
                    </IonGrid>
                </AnimatedElement>
            )}
        </div>
    );
};

export default AnimatedProductGrid;