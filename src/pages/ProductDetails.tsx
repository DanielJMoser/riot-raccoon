import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonRouterLink,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonSpinner,
    IonText
} from '@ionic/react';
import { useParams } from 'react-router';
import { getProductBySlug } from '../services/api';
import { urlFor } from '../../backend/services/sanityClient';
import { PortableText } from '@portabletext/react';
import '../scss/ProductDetails.scss';
import {Category, Product} from "../types/homepageTypes";
import { useCart } from "../context/CartContext";
import SiteHeader from '../components/SiteHeader';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { chevronBack } from 'ionicons/icons';

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
    const { addToCart, } = useCart();

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

    const handleAddToCart = () => {
        if (!product || !isCurrentVariantInStock()) return;

        // Create the cart item object
        const cartItem = {
            productId: product._id,
            productName: product.name,
            productSlug: product.slug.current,
            variantId: selectedVariant?._id,
            quantity: quantity,
            price: getCurrentPrice(),
            image: selectedVariant?.image || product.mainImage,
            options: selectedVariant?.options || []
        };

        // Add to cart
        addToCart(cartItem);
    };

    // Extract color option for the main color display
/*    const getSelectedColor = () => {
        if (selectedOptions['Color']) {
            return selectedOptions['Color'];
        }
        return null;
    };*/

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

    // Increase quantity
    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    // Decrease quantity
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    return (
        <IonPage className="product-details-page retro-modern">
            <SiteHeader loading={loading} />

            <IonContent fullscreen>
                <div className="product-details-container">
                    {/* Loading state */}
                    {loading && (
                        <div className="loading-container">
                            <LoadingSkeleton variant="hero" />
                            <p>Loading product details...</p>
                        </div>
                    )}

                    {/* Error state */}
                    {error && !loading && (
                        <div className="error-container">
                            <IonText color="danger">{error}</IonText>
                            <IonButton
                                fill="outline"
                                routerLink="/shop"
                                className="back-to-shop-btn"
                            >
                                <IonIcon icon={chevronBack} slot="start" />
                                Back to Shop
                            </IonButton>
                        </div>
                    )}

                    {/* Product details */}
                    {!loading && !error && product && (
                        <div className="product-content">
                            {/* Breadcrumbs */}
                            <div className="breadcrumbs">
                                <IonRouterLink routerLink="/">Home</IonRouterLink>
                                <span> / </span>
                                <IonRouterLink routerLink="/shop">Shop</IonRouterLink>
                                <span> / </span>
                                {product.categories && product.categories.length > 0 && (
                                    <>
                                        <IonRouterLink
                                            routerLink={`/category/${product.categories[0].slug.current}`}
                                        >
                                            {product.categories[0].title}
                                        </IonRouterLink>
                                        <span> / </span>
                                    </>
                                )}
                                <span className="current">{product.name}</span>
                            </div>

                            <IonGrid>
                                <IonRow>
                                    {/* Product Images */}
                                    <IonCol size="12" sizeMd="6">
                                        <div className="product-images">
                                            <div className="main-image">
                                                {mainImage && (
                                                    <img
                                                        src={urlFor(mainImage).width(600).url()}
                                                        alt={product.name}
                                                    />
                                                )}
                                            </div>

                                            {/* Thumbnail gallery */}
                                            {(product.images && product.images.length > 0 ||
                                                getOptionNames().includes('Color')) && (
                                                <div className="thumbnail-gallery">
                                                    {/* Main product image thumbnail */}
                                                    <div
                                                        className={`thumbnail ${!selectedOptions['Color'] ? 'selected' : ''}`}
                                                        onClick={() => setMainImage(product.mainImage)}
                                                    >
                                                        <img
                                                            src={urlFor(product.mainImage).width(100).height(100).url()}
                                                            alt={product.name}
                                                        />
                                                    </div>

                                                    {/* Additional images thumbnails */}
                                                    {product.images && product.images.map((img, index) => (
                                                        <div
                                                            key={index}
                                                            className="thumbnail"
                                                            onClick={() => setMainImage(img)}
                                                        >
                                                            <img
                                                                src={urlFor(img).width(100).height(100).url()}
                                                                alt={`${product.name} - view ${index + 1}`}
                                                            />
                                                        </div>
                                                    ))}

                                                    {/* Color variant thumbnails */}
                                                    {getOptionNames().includes('Color') &&
                                                        getAvailableOptionValues('Color').map(color => {
                                                            const variantImage = getVariantImageForColor(color);
                                                            if (!variantImage) return null;

                                                            return (
                                                                <div
                                                                    key={color}
                                                                    className={`thumbnail ${selectedOptions['Color'] === color ? 'selected' : ''}`}
                                                                    onClick={() => handleOptionChange('Color', color)}
                                                                >
                                                                    <img
                                                                        src={urlFor(variantImage).width(100).height(100).url()}
                                                                        alt={color}
                                                                    />
                                                                    <span className="color-label">{color}</span>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </IonCol>

                                    {/* Product Info */}
                                    <IonCol size="12" sizeMd="6">
                                        <div className="product-info">
                                            <h1 className="product-title">{product.name}</h1>

                                            {/* Product flags */}
                                            <div className="product-flags">
                                                {product.new && <span className="product-flag new">New</span>}
                                                {!isCurrentVariantInStock() && <span className="product-flag out-of-stock">Out of Stock</span>}
                                                {product.featured && <span className="product-flag featured">Featured</span>}
                                            </div>

                                            {/* Price */}
                                            <div className="product-price-container">
                                                {product.compareAtPrice && product.compareAtPrice > getCurrentPrice() ? (
                                                    <>
                                                        <span className="product-compare-price">{formatCurrency(product.compareAtPrice)}</span>
                                                        <span className="product-price sale">{formatCurrency(getCurrentPrice())}</span>
                                                        <span className="discount-percentage">
                                                            -{Math.round(((product.compareAtPrice - getCurrentPrice()) / product.compareAtPrice) * 100)}%
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="product-price">{formatCurrency(getCurrentPrice())}</span>
                                                )}
                                            </div>

                                            {/* Short description */}
                                            {product.shortDescription && (
                                                <div className="product-short-description">
                                                    <p>{product.shortDescription}</p>
                                                </div>
                                            )}

                                            {/* Variant Options */}
                                            {getOptionNames().length > 0 && (
                                                <div className="product-options">
                                                    {getOptionNames().map(optionName => (
                                                        <div key={optionName} className="option-selector">
                                                            <label>{optionName}</label>

                                                            {optionName.toLowerCase() === 'color' ? (
                                                                <div className="color-options">
                                                                    {getAvailableOptionValues(optionName).map(value => (
                                                                        <div
                                                                            key={value}
                                                                            className={`color-option ${selectedOptions[optionName] === value ? 'selected' : ''}`}
                                                                            onClick={() => handleOptionChange(optionName, value)}
                                                                            title={value}
                                                                        >
                                                                            <span
                                                                                className="color-swatch"
                                                                                style={{
                                                                                    backgroundColor: value.toLowerCase()
                                                                                }}
                                                                            ></span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="option-values">
                                                                    {getAvailableOptionValues(optionName).map(value => (
                                                                        <button
                                                                            key={value}
                                                                            className={`option-value ${selectedOptions[optionName] === value ? 'selected' : ''}`}
                                                                            onClick={() => handleOptionChange(optionName, value)}
                                                                        >
                                                                            {value}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Quantity selector */}
                                            <div className="quantity-selector">
                                                <label>Quantity</label>
                                                <div className="quantity-controls">
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={decreaseQuantity}
                                                        disabled={quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={quantity}
                                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                        className="quantity-input"
                                                    />
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={increaseQuantity}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Add to cart button */}
                                            <div className="product-actions">
                                                <IonButton
                                                    expand="block"
                                                    className="add-to-cart-btn"
                                                    onClick={handleAddToCart}
                                                    disabled={!isCurrentVariantInStock()}
                                                >
                                                    {isCurrentVariantInStock() ? 'Add to Cart' : 'Out of Stock'}
                                                </IonButton>
                                            </div>

                                            {/* Shipping note */}
                                            <div className="shipping-note">
                                                <p>Free shipping on all orders over €250</p>
                                            </div>

                                            {/* Product full description */}
                                            {product.description && (
                                                <div className="product-description">
                                                    <h3>Product Details</h3>
                                                    <div className="description-content">
                                                        <PortableText value={product.description} />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Categories */}
                                            {product.categories && product.categories.length > 0 && (
                                                <div className="product-categories">
                                                    <span>Categories: </span>
                                                    {product.categories.map((category: Category, index: number) => (
                                                        <span key={category._id}>
                                                            <IonRouterLink routerLink={`/category/${category.slug.current}`}>
                                                                {category.title}
                                                            </IonRouterLink>
                                                            {index < product.categories!.length - 1 && ', '}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* No Tags section as it's not in the Product interface */}
                                        </div>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>

                            {/* Related Products section would go here */}
                        </div>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ProductDetails;