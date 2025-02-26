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
    IonChip,
    IonLabel
} from '@ionic/react';
import { getHomepageContent } from '../services/api';
import {Collection, HomepageData, Product} from "../types/homepageTypes";
import { urlFor } from '../../backend/services/sanityClient';
import '../scss/Home.scss';
import SiteHeader from "../components/SiteHeader";

const Home: React.FC = () => {
    const [homeData, setHomeData] = useState<HomepageData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Default menu items and social links as fallback if Sanity data fails to load
    const defaultMenuItems = [
        { _id: '1', title: 'news', url: '/news' },
        { _id: '2', title: 'new collection preview', url: '/previews/newcollection' },
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
    }, []);

    // Determine which menu items to show (from Sanity or defaults)
    const menuItems = homeData?.mainMenuItems || defaultMenuItems;
    const socialLinks = homeData?.socialLinks || defaultSocialLinks;
    const brandTitle = homeData?.title || 'BRAND';

    // Helper function to get product URL
    const getProductUrl = (product: Product) => {
        return `/product/${product.slug.current}`;
    };

    // Helper function to get collection URL
    const getCollectionUrl = (collection: Collection) => {
        return `/collection/${collection.slug.current}`;
    };

    return (
        <IonPage className="shop-page">
            <SiteHeader brandTitle={homeData?.title} loading={loading} />
            <IonContent fullscreen>
                <main id="MainContent">
                    <div className="main-content-container">
                        {/* Accessibility skip link */}
                        <a href="#MainContent" className="skip-to-content">Skip to content</a>

                        {/* Show banner if available from Sanity */}
                        {homeData?.mainBanner && !loading && (
                            <div className="main-banner">
                                <img
                                    src={urlFor(homeData.mainBanner).width(1200).url()}
                                    alt={homeData.title || 'Banner'}
                                />
                            </div>
                        )}

                        {/* Show error message if there was a problem */}
                        {error && (
                            <div className="error-message">
                                <IonText color="danger">{error}</IonText>
                            </div>
                        )}

                        {/* Main content */}
                        <div className="menu-content">
                            <h1 className="visually-hidden">{brandTitle}</h1>

                            {loading ? (
                                // Loading skeleton
                                <div className="menu-loading">
                                    <IonSpinner name="dots" />
                                    <div className="menu-skeleton">
                                        {Array(6).fill(0).map((_, index) => (
                                            <IonSkeletonText
                                                key={index}
                                                animated
                                                style={{
                                                    width: `${Math.floor(Math.random() * 40) + 80}px`,
                                                    height: '20px',
                                                    margin: '10px auto'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // Actual menu items from Sanity (or defaults)
                                <ul className="main-menu">
                                    {menuItems.map((item) => (
                                        <li key={item._id} className="menu-item">
                                            <IonRouterLink routerLink={item.url}>
                                                {item.title}
                                            </IonRouterLink>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Subtitle from Sanity if available */}
                            {homeData?.subtitle && !loading && (
                                <div className="subtitle">
                                    <p>{homeData.subtitle}</p>
                                </div>
                            )}

                            {/* Social links */}
                            <ul className="social-links">
                                {socialLinks.map((link) => (
                                    <li key={link._id} className="social-link-item">
                                        <a
                                            aria-label={link.label}
                                            id={link.id}
                                            target="_blank"
                                            rel="nofollow noopener"
                                            href={link.url}
                                        >
                                            <div
                                                className="social-icon"
                                                style={{ backgroundColor: link.color }}
                                            >
                                                {/* Icon placeholder */}
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            {/* Featured products section from new schema */}
                            {homeData?.featuredProducts && homeData.featuredProducts.length > 0 && !loading && (
                                <div className="featured-products">
                                    <h2>Featured Products</h2>
                                    <IonGrid>
                                        <IonRow>
                                            {homeData.featuredProducts.map(product => (
                                                <IonCol size="12" sizeMd="6" sizeLg="3" key={product._id}>
                                                    <div className="product-card">
                                                        <IonRouterLink routerLink={getProductUrl(product)}>
                                                            {product.mainImage && (
                                                                <div className="product-image">
                                                                    <img
                                                                        src={urlFor(product.mainImage).width(300).height(300).url()}
                                                                        alt={product.name}
                                                                    />
                                                                    {product.new && (
                                                                        <div className="product-badge new">New</div>
                                                                    )}
                                                                    {!product.inStock && (
                                                                        <div className="product-badge sold-out">Sold Out</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                            <div className="product-info">
                                                                <h3>{product.name}</h3>
                                                                <div className="product-price-container">
                                                                    <p className="product-price">${product.price.toFixed(2)}</p>
                                                                    {product.compareAtPrice && (
                                                                        <p className="product-compare-price">${product.compareAtPrice.toFixed(2)}</p>
                                                                    )}
                                                                </div>
                                                                {product.categories && product.categories.length > 0 && (
                                                                    <div className="product-categories">
                                                                        {product.categories.map(category => (
                                                                            <IonChip key={category._id} outline color="primary">
                                                                                <IonLabel>{category.title}</IonLabel>
                                                                            </IonChip>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </IonRouterLink>
                                                    </div>
                                                </IonCol>
                                            ))}
                                        </IonRow>
                                    </IonGrid>
                                </div>
                            )}

                            {/* Featured collections section from new schema */}
                            {homeData?.featuredCollections && homeData.featuredCollections.length > 0 && !loading && (
                                <div className="featured-collections">
                                    <h2>Featured Collections</h2>
                                    <IonGrid>
                                        <IonRow>
                                            {homeData.featuredCollections.map(collection => (
                                                <IonCol size="12" sizeMd="6" key={collection._id}>
                                                    <div className="collection-card">
                                                        <IonRouterLink routerLink={getCollectionUrl(collection)}>
                                                            {collection.mainImage && (
                                                                <div className="collection-image">
                                                                    <img
                                                                        src={urlFor(collection.mainImage).width(600).height(400).url()}
                                                                        alt={collection.title}
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="collection-info">
                                                                <h3>{collection.title}</h3>
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
                    </div>
                </main>
            </IonContent>
        </IonPage>
    );
};

export default Home;