import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonRouterLink,
    IonSkeletonText,
    IonSpinner,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonSelect,
    IonSelectOption,
    IonSearchbar,
    IonChip,
    IonLabel,
    IonBadge
} from '@ionic/react';
import { getProducts } from '../services/api';
import { urlFor } from '../../backend/services/sanityClient';
import { Product, Category } from '../types/homepageTypes';
import '../scss/ProductList.scss';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [sortOption, setSortOption] = useState<string>('featured');
    const [inStockOnly, setInStockOnly] = useState<boolean>(false);

    // Current time
    const formattedDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const formattedTime = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await getProducts();
                setProducts(data);
                setFilteredProducts(data);

                // Extract unique categories from products
                const allCategories = data.reduce((cats: Category[], product) => {
                    if (product.categories) {
                        product.categories.forEach(cat => {
                            if (!cats.some(c => c._id === cat._id)) {
                                cats.push(cat);
                            }
                        });
                    }
                    return cats;
                }, []);

                setCategories(allCategories);
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Apply filters whenever filter states change
    useEffect(() => {
        let result = [...products];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.shortDescription?.toLowerCase().includes(query)
            );
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            result = result.filter(product =>
                product.categories?.some(cat => cat._id === categoryFilter)
            );
        }

        // Apply in-stock filter
        if (inStockOnly) {
            result = result.filter(product => product.inStock);
        }

        // Apply sorting
        switch (sortOption) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'newest':
                result = result.filter(p => p.new).concat(result.filter(p => !p.new));
                break;
            case 'featured':
            default:
                result = result.filter(p => p.featured).concat(result.filter(p => !p.featured));
                break;
        }

        setFilteredProducts(result);
    }, [products, searchQuery, categoryFilter, sortOption, inStockOnly]);

    // Helper function to get product URL
    const getProductUrl = (product: Product) => {
        return `/product/${product.slug.current}`;
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`;
    };

    // Toggle in-stock filter
    const toggleInStockFilter = () => {
        setInStockOnly(prev => !prev);
    };

    return (
        <IonPage className="shop-page">
            <IonHeader className="site-header">
                <div className="header-container">
                    <div className="nav-back">
                        <IonRouterLink routerLink="/" className="caret-link">
                            <span className="caret-icon">▲</span>
                        </IonRouterLink>
                    </div>
                    <div className="logo-container">
                        <IonRouterLink routerLink="/" className="logo-link">
                            <div className="logo">
                                BRAND
                            </div>
                        </IonRouterLink>
                    </div>
                    <div className="date-time">
                        <h2>{formattedDate} {formattedTime}</h2>
                    </div>
                </div>
            </IonHeader>

            <IonContent fullscreen>
                <main id="MainContent">
                    <div className="product-list-container">
                        {/* Page Title */}
                        <header className="product-list-header">
                            <h1>Shop</h1>
                            <p className="product-count">
                                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                            </p>
                        </header>

                        {/* Filter Controls */}
                        <div className="filter-controls">
                            <div className="filter-control-row">
                                <div className="searchbar-container">
                                    <IonSearchbar
                                        value={searchQuery}
                                        onIonChange={(e) => setSearchQuery(e.detail.value || '')}
                                        placeholder="Search products..."
                                        className="retro-searchbar"
                                    />
                                </div>

                                <div className="sort-container">
                                    <IonSelect
                                        value={sortOption}
                                        onIonChange={(e) => setSortOption(e.detail.value)}
                                        interface="popover"
                                        className="retro-select"
                                    >
                                        <IonSelectOption value="featured">Featured</IonSelectOption>
                                        <IonSelectOption value="newest">New Arrivals</IonSelectOption>
                                        <IonSelectOption value="price-asc">Price: Low to High</IonSelectOption>
                                        <IonSelectOption value="price-desc">Price: High to Low</IonSelectOption>
                                        <IonSelectOption value="name-asc">Name: A to Z</IonSelectOption>
                                        <IonSelectOption value="name-desc">Name: Z to A</IonSelectOption>
                                    </IonSelect>
                                </div>
                            </div>

                            <div className="filter-control-row">
                                <div className="category-filter">
                                    <IonChip
                                        outline={categoryFilter === 'all'}
                                        color="primary"
                                        className={categoryFilter === 'all' ? 'selected' : ''}
                                        onClick={() => setCategoryFilter('all')}
                                    >
                                        <IonLabel>All Categories</IonLabel>
                                    </IonChip>

                                    {categories.map(category => (
                                        <IonChip
                                            key={category._id}
                                            outline={categoryFilter === category._id}
                                            color="primary"
                                            className={categoryFilter === category._id ? 'selected' : ''}
                                            onClick={() => setCategoryFilter(category._id)}
                                        >
                                            <IonLabel>{category.title}</IonLabel>
                                        </IonChip>
                                    ))}
                                </div>

                                <div className="instock-filter">
                                    <IonChip
                                        outline={!inStockOnly}
                                        color={inStockOnly ? 'success' : 'medium'}
                                        onClick={toggleInStockFilter}
                                    >
                                        <IonLabel>In Stock Only</IonLabel>
                                    </IonChip>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="loading-container">
                                <IonSpinner name="dots" />
                                <p>Loading products...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="error-container">
                                <IonText color="danger">{error}</IonText>
                            </div>
                        )}

                        {/* Empty Results */}
                        {!loading && !error && filteredProducts.length === 0 && (
                            <div className="empty-results">
                                <h2>No products found</h2>
                                <p>Try adjusting your filters or search criteria.</p>
                            </div>
                        )}

                        {/* Product Grid */}
                        {!loading && !error && filteredProducts.length > 0 && (
                            <div className="product-grid">
                                <IonGrid>
                                    <IonRow>
                                        {filteredProducts.map(product => (
                                            <IonCol size="12" sizeSm="6" sizeMd="4" sizeLg="3" key={product._id}>
                                                <div className="product-card">
                                                    <IonRouterLink routerLink={getProductUrl(product)}>
                                                        {/* Product Image */}
                                                        <div className="product-image">
                                                            {product.mainImage ? (
                                                                <img
                                                                    src={urlFor(product.mainImage).width(300).height(300).url()}
                                                                    alt={product.name}
                                                                />
                                                            ) : (
                                                                <div className="placeholder-image">
                                                                    <span>No image</span>
                                                                </div>
                                                            )}

                                                            {/* Product Badges */}
                                                            <div className="product-badges">
                                                                {product.new && (
                                                                    <div className="badge new">New</div>
                                                                )}
                                                                {!product.inStock && (
                                                                    <div className="badge sold-out">Sold Out</div>
                                                                )}
                                                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                                                    <div className="badge sale">Sale</div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Product Info */}
                                                        <div className="product-info">
                                                            {/* Product Categories */}
                                                            {product.categories && product.categories.length > 0 && (
                                                                <div className="product-categories">
                                                                    {product.categories.slice(0, 2).map(category => (
                                                                        <span key={category._id} className="product-category">{category.title}</span>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Product Name */}
                                                            <h3 className="product-name">{product.name}</h3>

                                                            {/* Product Price */}
                                                            <div className="product-price-container">
                                                                {product.compareAtPrice && product.compareAtPrice > product.price ? (
                                                                    <>
                                    <span className="product-compare-price">
                                      {formatCurrency(product.compareAtPrice)}
                                    </span>
                                                                        <span className="product-price sale">
                                      {formatCurrency(product.price)}
                                    </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="product-price">
                                    {formatCurrency(product.price)}
                                  </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </IonRouterLink>
                                                </div>
                                            </IonCol>
                                        ))}
                                    </IonRow>
                                </IonGrid>
                            </div>
                        )}
                    </div>
                </main>
            </IonContent>
        </IonPage>
    );
};

export default ProductList;