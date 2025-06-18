import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonRouterLink,
    IonSpinner,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonLabel,
    IonButton,
    IonIcon
} from '@ionic/react';
import { getHomepageContent } from '../services/api';
import { Collection, HomepageData, } from "../types/homepageTypes";
import { urlFor } from '../../backend/services/sanityClient';
import '../scss/Home.scss';
import SiteHeader from "../components/SiteHeader";
import { chevronForward, arrowDown,} from 'ionicons/icons';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
    const [homeData, setHomeData] = useState<HomepageData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [showScrollIndicator, setShowScrollIndicator] = useState<boolean>(true);
    const [isGlitching, setIsGlitching] = useState<boolean>(false);

    // Default menu items and social links as fallback if Sanity data fails to load
    const defaultMenuItems = [
        { _id: '1', title: 'news', url: '/news' },
        { _id: '2', title: 'new collection', url: '/previews/newcollection' },
        { _id: '3', title: 'lookbook', url: '/lookbook' },
        { _id: '4', title: 'shop', url: '/shop' },
        { _id: '5', title: 'random', url: '/random' },
        { _id: '6', title: 'about', url: '/about' },
        { _id: '7', title: 'contact', url: '/contact' }
    ];

    const defaultSocialLinks = [
        { _id: '1', id: 'instagram', label: 'Instagram', url: 'https://instagram.com/', color: '#f5c2e7' },
        { _id: '2', id: 'youtube', label: 'Youtube', url: 'https://youtube.com/', color: '#f38ba8' },
        { _id: '3', id: 'facebook', label: 'Facebook', url: 'https://facebook.com/', color: '#89b4fa' },
        { _id: '4', id: 'spotify', label: 'Spotify', url: 'https://spotify.com/', color: '#a6e3a1' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getHomepageContent();
                setHomeData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching homepage data:', err);
                setError('Failed to load content. Using default values.');
                // Set default data structure if Sanity fetch fails
                setHomeData({
                    title: 'BRAND',
                    mainMenuItems: defaultMenuItems,
                    socialLinks: defaultSocialLinks
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Hide scroll indicator after 5 seconds
        const timer = setTimeout(() => {
            setShowScrollIndicator(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    // Listen for scroll to hide indicator
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowScrollIndicator(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle glitch effect on user interaction
    const handleGlitchEffect = () => {
        setIsGlitching(true);
        setTimeout(() => {
            setIsGlitching(false);
        }, 500);
    };

    // Determine which menu items to show (from Sanity or defaults)
    const menuItems = homeData?.mainMenuItems || defaultMenuItems;
    const socialLinks = homeData?.socialLinks || defaultSocialLinks;
    const brandTitle = homeData?.title || 'BRAND';

    // Helper function to get collection URL
    const getCollectionUrl = (collection: Collection) => {
        return `/collection/${collection.slug.current}`;
    };

    // Filter products by category
    const getFilteredProducts = () => {
        if (!homeData?.featuredProducts) return [];

        if (activeCategory === 'all') {
            return homeData.featuredProducts;
        }

        return homeData.featuredProducts.filter(product =>
            product.categories?.some(cat => cat._id === activeCategory)
        );
    };

    // Get unique categories from products
    const getCategories = () => {
        if (!homeData?.featuredProducts) return [];

        const categories = new Set();
        const result: {_id: string, title: string}[] = [];

        homeData.featuredProducts.forEach(product => {
            if (product.categories) {
                product.categories.forEach(cat => {
                    if (!categories.has(cat._id)) {
                        categories.add(cat._id);
                        result.push({_id: cat._id, title: cat.title});
                    }
                });
            }
        });

        return result;
    };

    const categories = getCategories();
    const filteredProducts = getFilteredProducts();

    return (
        <IonPage className="shop-page retro-modern">
            <SiteHeader loading={loading} />

            <IonContent fullscreen>
                <main id="MainContent">
                    {/* Accessibility skip link */}
                    <a href="#MainContent" className="skip-to-content">Skip to content</a>

                    {/* Hero Section */}
                    <div className="hero-section">
                        <div className="hero-content">
                            <h1 
                                className={`hero-title ${isGlitching ? 'glitch' : ''}`} 
                                data-text={brandTitle}
                                onClick={handleGlitchEffect}
                                onMouseEnter={handleGlitchEffect}
                                style={{ cursor: 'pointer' }}
                            >
                                {brandTitle}
                            </h1>
                            {homeData?.subtitle && (
                                <p className="hero-subtitle">{homeData.subtitle}</p>
                            )}
                            <div className="hero-cta">
                                <IonButton
                                    className="shop-now-btn"
                                    routerLink="/shop"
                                    shape="round"
                                    fill="solid"
                                >
                                    Shop Now
                                    <IonIcon icon={chevronForward} slot="end" />
                                </IonButton>
                            </div>
                        </div>

                        {/* Banner image */}
                        {homeData?.mainBanner && !loading ? (
                            <div className="hero-banner">
                                <img
                                    src={urlFor(homeData.mainBanner).width(1200).url()}
                                    alt={homeData.title || 'Brand Banner'}
                                />
                            </div>
                        ) : (
                            <div className="hero-banner placeholder-banner">
                                <div className="retro-grid"></div>
                            </div>
                        )}

                        {/* Scroll indicator */}
                        {showScrollIndicator && (
                            <div className="scroll-indicator">
                                <IonIcon icon={arrowDown} />
                                <span>Scroll</span>
                            </div>
                        )}
                    </div>

                    {/* Main Menu Section */}
                    <div className="main-menu-section">
                        <div className="container">
                            <div className="section-header">
                                <div className="retro-line"></div>
                                <h2>Menu</h2>
                                <div className="retro-line"></div>
                            </div>

                            {loading ? (
                                <div className="loading-container">
                                    <IonSpinner name="dots" />
                                </div>
                            ) : (
                                <div className="menu-container">
                                    <ul className="main-menu">
                                        {menuItems.map((item) => (
                                            <li key={item._id} className="menu-item">
                                                <IonRouterLink routerLink={item.url}>
                                                    {item.title}
                                                    <span className="menu-item-indicator"></span>
                                                </IonRouterLink>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Social Links */}
                                    <div className="social-links-container">
                                        <ul className="social-links">
                                            {socialLinks.map((link) => (
                                                <li key={link._id} className="social-link-item">
                                                    <a
                                                        aria-label={link.label}
                                                        id={link.id}
                                                        target="_blank"
                                                        rel="nofollow noopener"
                                                        href={link.url}
                                                        style={{ backgroundColor: link.color }}
                                                    >
                                                        <span className="social-icon-text">{link.label.charAt(0)}</span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

{/*
                     ASCII Coin Section
                    <div className="ascii-coin-section">
                        <div className="container">
                            <div className="section-header">
                                <div className="retro-line"></div>
                                <h2>Interactive Logo</h2>
                                <div className="retro-line"></div>
                            </div>

                            <div className="ascii-coin-container-wrapper">
                                <Coin
                                    width={600}
                                    height={400}
                                    containerClassName="ascii-coin-display"
                                />
                            </div>
                        </div>
                    </div>
*/}

                    {/* Featured Products Section */}
                    {homeData?.featuredProducts && homeData.featuredProducts.length > 0 && !loading && (
                        <div className="featured-products-section">
                            <div className="container">
                                <div className="section-header">
                                    <div className="retro-line"></div>
                                    <h2>Featured Products</h2>
                                    <div className="retro-line"></div>
                                </div>

                                {/* Category filter chips */}
                                {categories.length > 0 && (
                                    <div className="category-filter">
                                        <IonChip
                                            className={activeCategory === 'all' ? 'active-category' : ''}
                                            onClick={() => setActiveCategory('all')}
                                        >
                                            <IonLabel>All</IonLabel>
                                        </IonChip>

                                        {categories.map(category => (
                                            <IonChip
                                                key={category._id}
                                                className={activeCategory === category._id ? 'active-category' : ''}
                                                onClick={() => setActiveCategory(category._id)}
                                            >
                                                <IonLabel>{category.title}</IonLabel>
                                            </IonChip>
                                        ))}
                                    </div>
                                )}

                                <IonGrid className="product-grid">
                                    <IonRow>
                                        {filteredProducts.map(product => (
                                            <IonCol size="12" sizeSm="6" sizeMd="4" sizeLg="3" key={product._id}>
                                                <ProductCard product={product} />
                                            </IonCol>
                                        ))}
                                    </IonRow>
                                </IonGrid>

                                <div className="view-all-container">
                                    <IonButton
                                        routerLink="/shop"
                                        fill="outline"
                                        className="view-all-btn"
                                    >
                                        View All Products
                                    </IonButton>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Featured Collections Section */}
                    {homeData?.featuredCollections && homeData.featuredCollections.length > 0 && !loading && (
                        <div className="featured-collections-section">
                            <div className="container">
                                <div className="section-header">
                                    <div className="retro-line"></div>
                                    <h2>Collections</h2>
                                    <div className="retro-line"></div>
                                </div>

                                <div className="collections-container">
                                    <IonGrid>
                                        <IonRow>
                                            {homeData.featuredCollections.map(collection => (
                                                <IonCol size="12" sizeMd="6" key={collection._id}>
                                                    <div className="collection-card">
                                                        <IonRouterLink routerLink={getCollectionUrl(collection)}>
                                                            <div className="collection-image-container">
                                                                {collection.mainImage && (
                                                                    <img
                                                                        src={urlFor(collection.mainImage).width(600).height(400).url()}
                                                                        alt={collection.title}
                                                                        className="collection-image"
                                                                    />
                                                                )}
                                                                <div className="collection-overlay"></div>
                                                            </div>

                                                            <div className="collection-info">
                                                                <h3 className="collection-title">{collection.title}</h3>
                                                                <span className="view-collection">View Collection</span>
                                                            </div>
                                                        </IonRouterLink>
                                                    </div>
                                                </IonCol>
                                            ))}
                                        </IonRow>
                                    </IonGrid>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Newsletter Section */}
                    <div className="newsletter-section">
                        <div className="container">
                            <div className="newsletter-card">
                                <div className="section-header">
                                    <div className="retro-line"></div>
                                    <h2>Stay Connected</h2>
                                    <div className="retro-line"></div>
                                </div>

                                <p className="newsletter-text">
                                    Subscribe to our newsletter for exclusive updates, product drops, and special offers.
                                </p>

                                <form className="newsletter-form">
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        aria-label="Email for newsletter"
                                        className="newsletter-input"
                                    />
                                    <button type="submit" className="newsletter-submit">Subscribe</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Error message display */}
                    {error && (
                        <div className="error-container">
                            <IonText color="danger">{error}</IonText>
                        </div>
                    )}

                    {/* Footer */}
                    <footer className="site-footer">
                        <div className="container">
                            <div className="footer-content">
                                <div className="footer-logo">{brandTitle}</div>

                                <div className="footer-links">
                                    <div className="footer-column">
                                        <h4>Info</h4>
                                        <ul>
                                            <li><IonRouterLink routerLink="/about">About Us</IonRouterLink></li>
                                            <li><IonRouterLink routerLink="/contact">Contact</IonRouterLink></li>
                                            <li><IonRouterLink routerLink="/faq">FAQ</IonRouterLink></li>
                                            <li><IonRouterLink routerLink="/shipping">Shipping</IonRouterLink></li>
                                        </ul>
                                    </div>

                                    <div className="footer-column">
                                        <h4>Policies</h4>
                                        <ul>
                                            <li><IonRouterLink routerLink="/terms">Terms of Service</IonRouterLink></li>
                                            <li><IonRouterLink routerLink="/privacy">Privacy Policy</IonRouterLink></li>
                                            <li><IonRouterLink routerLink="/returns">Returns & Exchanges</IonRouterLink></li>
                                        </ul>
                                    </div>

                                    <div className="footer-column">
                                        <h4>Follow Us</h4>
                                        <ul className="footer-social-links">
                                            {socialLinks.map((link) => (
                                                <li key={link._id}>
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {link.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="footer-bottom">
                                <p className="copyright">&copy; {new Date().getFullYear()} {brandTitle}. All rights reserved.</p>
                                <p className="credits">Design with ♥ by Your Studio</p>
                            </div>
                        </div>
                    </footer>
                </main>
            </IonContent>
        </IonPage>
    );
};

export default Home;