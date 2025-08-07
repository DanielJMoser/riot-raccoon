// src/pages/CollectionDetails.tsx
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
    IonIcon,
    IonButton
} from '@ionic/react';
import { useParams } from 'react-router';
import { arrowBack, chevronForward } from 'ionicons/icons';
import { getCollectionBySlug } from '../services/api';
import { Collection } from '../types/homepageTypes';
import { urlFor } from '../../backend/services/sanityClient';
import { PortableText } from '@portabletext/react';
import '../scss/CollectionDetails.scss';
import SiteHeader from '../components/SiteHeader';
import ProductCard from '../components/ProductCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

interface CollectionDetailsParams {
    slug: string;
}

const CollectionDetails: React.FC = () => {
    const { slug } = useParams<CollectionDetailsParams>();
    const [collection, setCollection] = useState<Collection | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'products' | 'lookbook'>('products');

    useEffect(() => {
        const fetchCollectionData = async () => {
            try {
                setLoading(true);
                const data = await getCollectionBySlug(slug);
                setCollection(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching collection data:', err);
                setError('Failed to load collection details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCollectionData();
    }, [slug]);

    // Format release date
    const formatReleaseDate = (dateString?: string) => {
        if (!dateString) return null;

        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    // Check if release date is in the future
    const isUpcoming = (dateString?: string) => {
        if (!dateString) return false;

        const releaseDate = new Date(dateString);
        const now = new Date();
        return releaseDate > now;
    };

    return (
        <IonPage className="collection-details-page retro-modern">
            <SiteHeader loading={loading} />

            <IonContent fullscreen>
                <main id="MainContent">
                    <div className="collection-details-container">
                        {/* Loading state */}
                        {loading && (
                            <div className="loading-container">
                                <LoadingSkeleton variant="hero" />
                                <p>Loading collection...</p>
                            </div>
                        )}

                        {/* Error state */}
                        {error && !loading && (
                            <div className="error-container">
                                <IonText color="danger">{error}</IonText>
                                <IonButton fill="clear" routerLink="/collections" className="back-button">
                                    <IonIcon icon={arrowBack} slot="start" />
                                    Back to Collections
                                </IonButton>
                            </div>
                        )}

                        {/* Collection content */}
                        {!loading && !error && collection && (
                            <>
                                {/* Collection header */}
                                <header className="collection-header">
                                    <div className="back-link">
                                        <IonRouterLink routerLink="/collections">
                                            <IonIcon icon={arrowBack} /> collections
                                        </IonRouterLink>
                                    </div>

                                    <h1 className="collection-title">{collection.title}</h1>

                                    {collection.releaseDate && (
                                        <div className="collection-release-date">
                                            {isUpcoming(collection.releaseDate)
                                                ? `Coming ${formatReleaseDate(collection.releaseDate)}`
                                                : `Released ${formatReleaseDate(collection.releaseDate)}`}
                                        </div>
                                    )}

                                    {/* Collection hero image */}
                                    <div className="collection-hero">
                                        {collection.mainImage ? (
                                            <img
                                                src={urlFor(collection.mainImage).width(1200).url()}
                                                alt={collection.title}
                                                className="collection-main-image"
                                            />
                                        ) : (
                                            <div className="collection-image-placeholder">
                                                <div className="retro-grid"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Collection description */}
                                    {collection.description && (
                                        <div className="collection-description">
                                            <PortableText value={collection.description} />
                                        </div>
                                    )}
                                </header>

                                {/* Tabs for products and lookbook */}
                                {(collection.products?.length || collection.lookbookImages?.length) && (
                                    <div className="collection-tabs">
                                        <div className="tab-buttons">
                                            <button
                                                className={activeTab === 'products' ? 'active' : ''}
                                                onClick={() => setActiveTab('products')}
                                                disabled={!collection.products?.length}
                                            >
                                                Products
                                            </button>
                                            <button
                                                className={activeTab === 'lookbook' ? 'active' : ''}
                                                onClick={() => setActiveTab('lookbook')}
                                                disabled={!collection.lookbookImages?.length}
                                            >
                                                Lookbook
                                            </button>
                                        </div>

                                        {/* Products tab content */}
                                        {activeTab === 'products' && collection.products && (
                                            <div className="collection-products">
                                                <h2>Products in this Collection</h2>
                                                <IonGrid>
                                                    <IonRow>
                                                        {collection.products.map(product => (
                                                            <IonCol key={product._id} size="12" sizeSm="6" sizeMd="4" sizeLg="3">
                                                                <ProductCard product={product} />
                                                            </IonCol>
                                                        ))}
                                                    </IonRow>
                                                </IonGrid>

                                                <div className="shop-all-cta">
                                                    <IonRouterLink routerLink="/shop" className="shop-all-link">
                                                        Shop All Products
                                                        <IonIcon icon={chevronForward} />
                                                    </IonRouterLink>
                                                </div>
                                            </div>
                                        )}

                                        {/* Lookbook tab content */}
                                        {activeTab === 'lookbook' && collection.lookbookImages && (
                                            <div className="collection-lookbook">
                                                <h2>Lookbook</h2>
                                                <div className="lookbook-grid">
                                                    {collection.lookbookImages.map((item, index) => (
                                                        <div key={index} className="lookbook-item">
                                                            {item.image && (
                                                                <img
                                                                    src={urlFor(item.image).width(800).url()}
                                                                    alt={item.alt || `${collection.title} lookbook image ${index + 1}`}
                                                                    loading="lazy"
                                                                    className="lookbook-image"
                                                                />
                                                            )}
                                                            {item.caption && (
                                                                <div className="lookbook-caption">{item.caption}</div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Empty states */}
                                        {activeTab === 'products' && (!collection.products || collection.products.length === 0) && (
                                            <div className="empty-state">
                                                <p>No products available in this collection yet.</p>
                                            </div>
                                        )}

                                        {activeTab === 'lookbook' && (!collection.lookbookImages || collection.lookbookImages.length === 0) && (
                                            <div className="empty-state">
                                                <p>No lookbook images available for this collection yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </IonContent>
        </IonPage>
    );
};

export default CollectionDetails;