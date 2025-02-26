import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonRouterLink,
} from '@ionic/react';
import { useParams } from 'react-router';
import { getProductBySlug } from '../services/api';
import { urlFor } from '../../backend/services/sanityClient';
import { PortableText } from '@portabletext/react';
import '../scss/ProductDetails.scss'; // Import the Supreme-style SCSS
import { Product, Category } from "../types/homepageTypes";

interface ProductDetailParams {
    slug: string;
}

const ProductDetails: React.FC = () => {
    const { slug } = useParams<ProductDetailParams>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState<number>(1);
    const [mainImage, setMainImage] = useState<any | null>(null);

    // Format date in Supreme style: DD/MM/YYYY
    const formattedDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Format time in Supreme style: HH:MMpm/am
    const formattedTime = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Get timezone abbreviation
    const timezone = new Date().toLocaleTimeString('en-US', {
        timeZoneName: 'short'
    }).split(' ')[2];

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const data = await getProductBySlug(slug);
                setProduct(data);
                setMainImage(data?.mainImage);

                // Set default variant if available
                if (data?.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);

                    // Initialize selected options from first variant
                    const initialOptions: Record<string, string> = {};
                    data.variants[0].options.forEach((option: any) => {
                        initialOptions[option.name] = option.value;
                    });
                    setSelectedOptions(initialOptions);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching product data:', err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [slug]);

    // Handle variant selection when options change
    useEffect(() => {
        if (product?.variants && Object.keys(selectedOptions).length > 0) {
            // Find matching variant based on selected options
            const variant = product.variants.find((v) => {
                // Check if all options in this variant match the selected options
                return v.options.every((option) =>
                    selectedOptions[option.name] === option.value
                );
            });

            setSelectedVariant(variant || null);

            // Update main image if variant has its own image
            if (variant?.image) {
                setMainImage(variant.image);
            } else {
                setMainImage(product.mainImage);
            }
        }
    }, [selectedOptions, product]);

    // Handle option changes
    const handleOptionChange = (optionName: string, optionValue: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: optionValue
        }));
    };

    // Get available option values for a given option name
    const getAvailableOptionValues = (optionName: string) => {
        if (!product?.variants) return [];

        // Extract all unique values for this option name
        const values = new Set<string>();
        product.variants.forEach((variant) => {
            const option = variant.options.find((opt) => opt.name === optionName);
            if (option) {
                values.add(option.value);
            }
        });

        return Array.from(values);
    };

    // Get all unique option names
    const getOptionNames = () => {
        if (!product?.variants || product.variants.length === 0) return [];

        const names = new Set<string>();
        product.variants.forEach((variant) => {
            variant.options.forEach((option) => {
                names.add(option.name);
            });
        });

        return Array.from(names);
    };

    // Calculate current price
    const getCurrentPrice = () => {
        if (selectedVariant && selectedVariant.price) {
            return selectedVariant.price;
        }
        return product?.price || 0;
    };

    // Check if currently selected variant is in stock
    const isCurrentVariantInStock = () => {
        if (selectedVariant) {
            return selectedVariant.inStock;
        }
        return product?.inStock || false;
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return `€${amount.toFixed(2)}`;
    };

    // Handle add to cart
    const handleAddToCart = () => {
        // Implement your cart functionality here
        console.log('Adding to cart:', {
            product,
            variant: selectedVariant,
            quantity,
            options: selectedOptions
        });

        // For now, just show an alert
        alert(`Added ${quantity} of ${product?.name} to cart`);
    };

    // Extract color option for the main color display
    const getSelectedColor = () => {
        if (selectedOptions['Color']) {
            return selectedOptions['Color'];
        }
        return null;
    };

    // Get variant image for a specific color
    const getVariantImageForColor = (color: string) => {
        if (!product?.variants) return null;

        const colorVariant = product.variants.find(variant =>
            variant.options.some(option =>
                option.name === 'Color' && option.value === color
            )
        );

        return colorVariant?.image || product.mainImage;
    };

    // Loading and error states
    if (loading) {
        return (
            <IonPage className="shop-page">
                <div className="supreme-header">
                    <div className="logo-container">
                        <img className="logo" src="/path-to-your-logo.png" alt="Logo" />
                    </div>
                    <div className="date-time">
                        {formattedDate} {formattedTime} {timezone}
                    </div>
                </div>
                <IonContent>
                    <div className="product-details-container supreme-style">
                        <div className="loading-spinner">Loading...</div>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    if (error || !product) {
        return (
            <IonPage className="shop-page">
                <div className="supreme-header">
                    <div className="logo-container">
                        <img className="logo" src="/path-to-your-logo.png" alt="Logo" />
                    </div>
                    <div className="date-time">
                        {formattedDate} {formattedTime} {timezone}
                    </div>
                </div>
                <IonContent>
                    <div className="product-details-container supreme-style">
                        <div className="error-message">
                            {error || 'Product not found'}
                            <button onClick={() => window.history.back()} className="keep-shopping-btn">
                                back to shop
                            </button>
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage className="shop-page">
            {/* Supreme-style header with logo and date/time */}
            <div className="supreme-header">
                <div className="logo-container">
                    <img className="logo" src="/path-to-your-logo.png" alt="Logo" />
                </div>
                <div className="date-time">
                    {formattedDate} {formattedTime} {timezone}
                </div>
            </div>

            <IonContent>
                <div className="product-details-container supreme-style">
                    <div className="product-main-content">
                        {/* Left: Product Image */}
                        <div className="product-image-column">
                            <div className="main-image">
                                {mainImage && (
                                    <img
                                        src={urlFor(mainImage).width(600).url()}
                                        alt={product.name}
                                    />
                                )}
                            </div>

                            {/* Thumbnail gallery */}
                            {product.images && product.images.length > 0 && (
                                <div className="thumbnail-gallery">
                                    {/* Show color variants as thumbnails */}
                                    {getOptionNames().includes('Color') &&
                                        getAvailableOptionValues('Color').map(color => {
                                            const variantImage = getVariantImageForColor(color);
                                            return (
                                                <div
                                                    key={color}
                                                    className={`thumbnail ${selectedOptions['Color'] === color ? 'selected' : ''}`}
                                                    onClick={() => handleOptionChange('Color', color)}
                                                >
                                                    {variantImage && (
                                                        <img
                                                            src={urlFor(variantImage).width(100).height(100).url()}
                                                            alt={color}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            )}
                        </div>

                        {/* Right: Product Info */}
                        <div className="product-info-column">
                            <h1 className="product-title">{product.name}</h1>

                            {/* Selected color */}
                            {getSelectedColor() && (
                                <div className="product-color">{getSelectedColor()}</div>
                            )}

                            {/* Product short description */}
                            {product.shortDescription && (
                                <div className="product-description-simple">
                                    <p>{product.shortDescription}</p>
                                </div>
                            )}

                            {/* Product full description as bullet points */}
                            {product.description && (
                                <div className="product-features">
                                    <PortableText value={product.description} />
                                </div>
                            )}

                            {/* Price */}
                            <div className="product-price">
                                {formatCurrency(getCurrentPrice())}
                            </div>

                            {/* Size Selection as dropdown */}
                            {getOptionNames().includes('Size') && (
                                <div className="size-selector">
                                    <select
                                        value={selectedOptions['Size'] || ''}
                                        onChange={(e) => handleOptionChange('Size', e.target.value)}
                                        className="supreme-select"
                                    >
                                        <option value="" disabled>Select Size</option>
                                        {getAvailableOptionValues('Size').map(size => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Add to Cart and Keep Shopping buttons */}
                            <div className="cart-actions">
                                <button
                                    className="add-to-cart-btn"
                                    onClick={handleAddToCart}
                                    disabled={!isCurrentVariantInStock()}
                                >
                                    add to cart
                                </button>
                                <button
                                    className="keep-shopping-btn"
                                    onClick={() => window.history.back()}
                                >
                                    keep shopping
                                </button>
                            </div>

                            {/* Shipping note */}
                            <div className="shipping-note">
                                * free shipping on all orders over €250, some exceptions may apply
                            </div>
                        </div>
                    </div>

                    {/* Bottom navigation */}
                    <div className="bottom-nav">
                        <div className="nav-back">
                            <IonRouterLink routerLink="/shop">shop</IonRouterLink>
                        </div>
                        <div className="nav-links">
                            <IonRouterLink routerLink="/lookbook">lookbook</IonRouterLink>
                            <IonRouterLink routerLink="/news">news</IonRouterLink>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ProductDetails;