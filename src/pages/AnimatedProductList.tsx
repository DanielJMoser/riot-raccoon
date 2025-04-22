// src/pages/AnimatedProductList.tsx
import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonRouterLink,
    IonSpinner,
    IonText,
    IonSelect,
    IonSelectOption,
    IonSearchbar,
    IonChip,
    IonLabel,
    IonIcon,
    IonButton
} from '@ionic/react';
import { getProducts } from '../services/api';
import { Product, Category } from '../types/homepageTypes';
import '../scss/ProductList.scss';
import SiteHeader from '../components/SiteHeader';
import { AnimatedElement, GlitchText, CRTScreen } from '../animations/AnimationUtils';
import AnimatedProductGrid from './AnimatedProductGrid';
import { arrowForward, searchOutline, optionsOutline, filterOutline } from 'ionicons/icons';
import { useAnimatedNavigation } from '../hooks/useAnimatedNavigation';

const AnimatedProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Filter state
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [sortOption, setSortOption] = useState<string>('featured');
    const [inStockOnly, setInStockOnly] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    // Use our custom navigation hook
    const { navigate } = useAnimatedNavigation('pixel-slide');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await getProducts();

                // Add a small delay for a smoother loading experience
                setTimeout(() => {
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
                    setLoading(false);
                }, 800); // Add delay for animation effect
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
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

    // Toggle in-stock filter
    const toggleInStockFilter = () => {
        setInStockOnly(prev => !prev);
    };

    // Toggle filters visibility
    const toggleFilters = () => {
        setShowFilters(prev => !prev);
    };

    return (
        <IonPage className="shop-page retro-modern">
            <SiteHeader loading={loading} />

            <IonContent fullscreen>
                <main id="MainContent">
                    <div className="product-list-container">
                        {/* Page Title with Animation */}
                        <AnimatedElement animation="pixelate" delay={200} duration={800}>
                            <header className="product-list-header">
                                <GlitchText text="Shop" className="product-title" />
                                <p className="product-count">
                                    {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                                </p>
                            </header>
                        </AnimatedElement>

                        {/* Filter Controls with Animation */}
                        <AnimatedElement animation="fade-in" delay={400} duration={600}>
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

                                    <div className="filter-toggle">
                                        <IonButton fill="clear" onClick={toggleFilters}>
                                            <IonIcon icon={filterOutline} />
                                            Filters
                                        </IonButton>
                                    </div>
                                </div>

                                {showFilters && (
                                    <AnimatedElement animation="slide-down" delay={100} duration={400}>
                                        <div className="filter-control-row additional-filters">
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
                                    </AnimatedElement>
                                )}
                            </div>
                        </AnimatedElement>

                        {/* Loading State with Animation */}
                        {loading && (
                            <AnimatedElement animation="fade-in" delay={200} duration={400}>
                                <div className="loading-grid">
                                    <IonSpinner name="dots" className="loading-spinner" />
                                    <div className="loading-text">LOADING PRODUCTS...</div>
                                </div>
                            </AnimatedElement>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <AnimatedElement animation="fade-in" delay={200} duration={400}>
                                <div className="error-container">
                                    <IonText color="danger">{error}</IonText>
                                </div>
                            </AnimatedElement>
                        )}

                        {/* Empty Results */}
                        {!loading && !error && filteredProducts.length === 0 && (
                            <AnimatedElement animation="fade-in" delay={200} duration={400}>
                                <CRTScreen scanlines={true} flicker={true} rounded={true} glow={true}>
                                    <div className="empty-results">
                                        <h2>No products found</h2>
                                        <p>Try adjusting your filters or search criteria.</p>
                                        <IonButton
                                            fill="outline"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setCategoryFilter('all');
                                                setInStockOnly(false);
                                                setSortOption('featured');
                                            }}
                                        >
                                            Reset Filters
                                        </IonButton>
                                    </div>
                                </CRTScreen>
                            </AnimatedElement>
                        )}

                        {/* Product Grid with Animation */}
                        {!loading && !error && filteredProducts.length > 0 && (
                            <AnimatedProductGrid
                                products={filteredProducts}
                                loading={loading}
                                gridSizes={{
                                    xs: "12",
                                    sm: "6",
                                    md: "4",
                                    lg: "3"
                                }}
                                showCrtEffect={true}
                            />
                        )}

                        {/* Back to Home Link */}
                        <AnimatedElement animation="fade-in" delay={800} duration={400}>
                            <div className="back-to-home">
                                <IonButton
                                    fill="clear"
                                    className="home-link"
                                    onClick={() => navigate('/', 'retro-fade')}
                                >
                                    Back to Home
                                    <IonIcon slot="end" icon={arrowForward} />
                                </IonButton>
                            </div>
                        </AnimatedElement>
                    </div>
                </main>
            </IonContent>
        </IonPage>
    );
};

export default AnimatedProductList;