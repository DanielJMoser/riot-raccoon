// src/components/AnimatedProductCard.tsx
import React from 'react';
import { Product } from '../types/homepageTypes';
import {IonRouterLink, IonIcon, IonButton} from '@ionic/react';
import { heartOutline, cartOutline, eyeOutline, heartSharp, sparkles, flash } from 'ionicons/icons';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUtils';
import { AnimatedElement, GlitchText } from '../animations/AnimationUtils';
import '../scss/components/AnimatedProductCard.scss';

interface AnimatedProductCardProps {
    product: Product;
    variant?: 'grid' | 'list';
    index?: number; // For staggered animations
}

const AnimatedProductCard: React.FC<AnimatedProductCardProps> = ({
                                                                     product,
                                                                     variant = 'grid',
                                                                     index = 0
                                                                 }) => {
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [isFavorite, setIsFavorite] = React.useState<boolean>(false);
    const { addToCart } = useCart();

    // Format currency
    const formatCurrency = (amount: number) => {
        return `€${amount.toFixed(2)}`;
    };

    // Get product URL
    const getProductUrl = () => {
        return `/product/${product.slug.current}`;
    };

    // Calculate discount percentage
    const getDiscountPercentage = () => {
        if (product.compareAtPrice && product.price < product.compareAtPrice) {
            const discount = ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100;
            return Math.round(discount);
        }
        return null;
    };

    // Quick add to cart
    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();

        // If product has variants, redirect to product page instead
        if (product.variants && product.variants.length > 0) {
            window.location.href = getProductUrl();
            return;
        }

        const cartItem = {
            productId: product._id,
            productName: product.name,
            productSlug: product.slug.current,
            quantity: 1,
            price: product.price,
            image: product.mainImage
        };

        addToCart(cartItem);
    };

    // Toggle favorite
    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsFavorite(!isFavorite);
    };

    // Get the product image URLs
    const mainImageUrl = getImageUrl(product.mainImage, 400, 400);
    const hoverImageUrl = product.images && product.images.length > 0
        ? getImageUrl(product.images[0], 400, 400)
        : mainImageUrl;

    // Calculate animation delay based on index
    const baseDelay = 200;
    const staggerDelay = 100;
    const animationDelay = baseDelay + (index * staggerDelay);

    return (
        <AnimatedElement
            animation="pixelate"
            delay={animationDelay}
            duration={600}
            className={`animated-product-card ${variant}`}
        >
            <div
                className={`product-card ${variant} ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <IonRouterLink routerLink={getProductUrl()}>
                    {/* Product Image */}
                    <div className="product-image-container">
                        <AnimatedElement
                            animation="fade-in"
                            delay={animationDelay + 100}
                            duration={300}
                        >
                            <img
                                src={mainImageUrl}
                                alt={product.name}
                                className="product-image"
                                loading="lazy"
                            />

                            {/* Second image for hover effect */}
                            {product.images && product.images.length > 0 && (
                                <img
                                    src={hoverImageUrl}
                                    alt={`${product.name} - alternate view`}
                                    className="product-image-hover"
                                    loading="lazy"
                                />
                            )}
                        </AnimatedElement>

                        {/* Product badges */}
                        <div className="product-badges">
                            {product.new && (
                                <AnimatedElement
                                    animation="slide-left"
                                    delay={animationDelay + 200}
                                    duration={400}
                                >
                                    <div className="badge new-badge">
                                        <IonIcon icon={sparkles} />
                                        <span>New</span>
                                    </div>
                                </AnimatedElement>
                            )}

                            {!product.inStock && (
                                <AnimatedElement
                                    animation="slide-left"
                                    delay={animationDelay + 200}
                                    duration={400}
                                >
                                    <div className="badge sold-out-badge">Sold Out</div>
                                </AnimatedElement>
                            )}

                            {getDiscountPercentage() && (
                                <AnimatedElement
                                    animation="slide-left"
                                    delay={animationDelay + 200}
                                    duration={400}
                                >
                                    <div className="badge sale-badge">
                                        <IonIcon icon={flash} />
                                        <span>-{getDiscountPercentage()}%</span>
                                    </div>
                                </AnimatedElement>
                            )}
                        </div>

                        {/* Quick action buttons */}
                        <div className="product-actions">
                            <button
                                className={`action-button favorite-button ${isFavorite ? 'active' : ''}`}
                                onClick={toggleFavorite}
                                aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <IonIcon icon={isFavorite ? heartSharp : heartOutline} />
                            </button>

                            <button
                                className="action-button quickview-button"
                                aria-label="Quick view"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Quick view functionality would be implemented here
                                }}
                            >
                                <IonIcon icon={eyeOutline} />
                            </button>

                            {product.inStock && (
                                <button
                                    className="action-button cart-button"
                                    aria-label="Add to cart"
                                    onClick={handleQuickAdd}
                                    disabled={!product.inStock || (product.variants && product.variants.length > 0)}
                                >
                                    <IonIcon icon={cartOutline} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        {/* Categories */}
                        {product.categories && product.categories.length > 0 && (
                            <AnimatedElement
                                animation="fade-in"
                                delay={animationDelay + 300}
                                duration={400}
                            >
                                <div className="product-categories">
                                    {product.categories.slice(0, 2).map(category => (
                                        <span key={category._id} className="category-tag">{category.title}</span>
                                    ))}
                                </div>
                            </AnimatedElement>
                        )}

                        {/* Product Name */}
                        <AnimatedElement
                            animation="slide-up"
                            delay={animationDelay + 350}
                            duration={400}
                        >
                            <h3 className="product-name">{product.name}</h3>
                        </AnimatedElement>

                        {/* Product Price */}
                        <AnimatedElement
                            animation="slide-up"
                            delay={animationDelay + 400}
                            duration={400}
                        >
                            <div className="product-price-container">
                                {product.compareAtPrice && product.compareAtPrice > product.price ? (
                                    <>
                                        <span className="product-compare-price">{formatCurrency(product.compareAtPrice)}</span>
                                        <span className="product-price sale">{formatCurrency(product.price)}</span>
                                    </>
                                ) : (
                                    <span className="product-price">{formatCurrency(product.price)}</span>
                                )}
                            </div>
                        </AnimatedElement>

                        {/* Variant information */}
                        {product.variants && product.variants.length > 0 && (
                            <AnimatedElement
                                animation="fade-in"
                                delay={animationDelay + 450}
                                duration={400}
                            >
                                <div className="product-variant-info">
                                    <span>{product.variants.length} options available</span>
                                </div>
                            </AnimatedElement>
                        )}
                    </div>

                    {/* Quick add button (mobile) */}
                    {product.inStock && !(product.variants && product.variants.length > 0) && (
                        <div className="mobile-quick-add">
                            <IonButton
                                expand="block"
                                fill="solid"
                                className="quick-add-button"
                                onClick={handleQuickAdd}
                            >
                                Quick Add
                            </IonButton>
                        </div>
                    )}
                </IonRouterLink>
            </div>
        </AnimatedElement>
    );
};

export default AnimatedProductCard;