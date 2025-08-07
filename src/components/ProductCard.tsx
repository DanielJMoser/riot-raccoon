// src/components/ProductCard.tsx
import React, { useState } from 'react';
import { IonRouterLink, IonIcon, IonButton } from '@ionic/react';
import { heartOutline, cartOutline, eyeOutline, heartSharp, sparkles, flash } from 'ionicons/icons';
import { Product } from '../types/homepageTypes';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUtils';
import '../scss/components/ProductCard.scss';
import { gsap } from 'gsap';
import animations from '../utils/animations';

interface ProductCardProps {
    product: Product;
    variant?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const { addToCart } = useCart();
    
    // Enhanced hover effects with GSAP
    const handleMouseEnter = () => {
        setIsHovered(true);
        gsap.to(`.product-card-${product._id}`, {
            ...animations.transforms.scaleHover,
            ...animations.presets.cardHover,
            boxShadow: '0 20px 40px rgba(203, 166, 247, 0.2)'
        });
        
        gsap.to(`.product-card-${product._id} .product-image`, {
            scale: 1.1,
            duration: animations.durations.medium,
            ease: animations.easings.circuit
        });
    };
    
    const handleMouseLeave = () => {
        setIsHovered(false);
        gsap.to(`.product-card-${product._id}`, {
            scale: 1,
            boxShadow: 'none',
            ...animations.presets.cardHover
        });
        
        gsap.to(`.product-card-${product._id} .product-image`, {
            scale: 1,
            duration: animations.durations.medium,
            ease: animations.easings.circuit
        });
    };

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
        // In a real app, you would save this to user preferences
    };

    // Get the product image URLs
    const mainImageUrl = getImageUrl(product.mainImage, 400, 400);
    const hoverImageUrl = product.images && product.images.length > 0
        ? getImageUrl(product.images[0], 400, 400)
        : mainImageUrl;

    return (
        <div
            className={`product-card product-card-${product._id} ${variant} ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <IonRouterLink routerLink={getProductUrl()}>
                {/* Product Image */}
                <div className="product-image-container">
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

                    {/* Product badges */}
                    <div className="product-badges">
                        {product.new && (
                            <div className="badge new-badge">
                                <IonIcon icon={sparkles} />
                                <span>New</span>
                            </div>
                        )}

                        {!product.inStock && (
                            <div className="badge sold-out-badge">Sold Out</div>
                        )}

                        {getDiscountPercentage() && (
                            <div className="badge sale-badge">
                                <IonIcon icon={flash} />
                                <span>-{getDiscountPercentage()}%</span>
                            </div>
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
                        <div className="product-categories">
                            {product.categories.slice(0, 2).map(category => (
                                <span key={category._id} className="category-tag">{category.title}</span>
                            ))}
                        </div>
                    )}

                    {/* Product Name */}
                    <h3 className="product-name">{product.name}</h3>

                    {/* Product Price */}
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

                    {/* Variant information */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="product-variant-info">
                            <span>{product.variants.length} options available</span>
                        </div>
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
    );
};

export default ProductCard;