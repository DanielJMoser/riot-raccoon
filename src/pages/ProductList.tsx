import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonSpinner,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonSelect,
    IonSelectOption,
    IonSearchbar,
    IonChip,
    IonLabel
} from '@ionic/react';
import { getProducts } from '../services/api';
import { Product, Category } from '../types/homepageTypes';
import '../scss/ProductList.scss';
import SiteHeader from '../components/SiteHeader';
import ProductCard from '../components/ProductCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

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

    // Toggle in-stock filter
    const toggleInStockFilter = () => {
        setInStockOnly(prev => !prev);
    };

    return (
        <IonPage className="shop-page">
            <SiteHeader loading={loading} />

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
                                <LoadingSkeleton variant="product" count={8} />
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
                                                <ProductCard product={product} />
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