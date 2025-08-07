// src/pages/Collections.tsx
// Fixed TypeScript errors
import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonRouterLink,
    IonSpinner,
    IonText,
    IonGrid,
    IonRow,
    IonCol
} from '@ionic/react';
import { getCollections } from '../services/api';
import { Collection } from '../types/homepageTypes';
import { urlFor } from '../../backend/services/sanityClient';
import '../scss/Collections.scss';
import SiteHeader from '../components/SiteHeader';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const Collections: React.FC = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                setLoading(true);
                const data = await getCollections();
                setCollections(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching collections:', err);
                setError('Failed to load collections. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    // Get collection URL
    const getCollectionUrl = (collection: Collection) => {
        return `/collection/${collection.slug.current}`;
    };

    // Format release date
    const formatReleaseDate = (dateString?: string) => {
        if (!dateString) return null;

        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <IonPage className="collections-page retro-modern">
            <SiteHeader loading={loading} />

            <IonContent fullscreen>
                <main id="MainContent">
                    <div className="collections-container">
                        {/* Page title */}
                        <header className="collections-header">
                            <h1>Collections</h1>
                            <div className="retro-line"></div>
                        </header>

                        {/* Loading state */}
                        {loading && (
                            <div className="loading-container">
                                <LoadingSkeleton variant="card" count={6} />
                                <p>Loading collections...</p>
                            </div>
                        )}

                        {/* Error state */}
                        {error && !loading && (
                            <div className="error-container">
                                <IonText color="danger">{error}</IonText>
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && !error && collections.length === 0 && (
                            <div className="empty-collections">
                                <h2>No Collections Found</h2>
                                <p>Check back later for new collections!</p>
                            </div>
                        )}

                        {/* Collections grid */}
                        {!loading && !error && collections.length > 0 && (
                            <div className="collections-grid">
                                <IonGrid>
                                    <IonRow>
                                        {collections.map(collection => (
                                            <IonCol size="12" sizeMd="6" key={collection._id}>
                                                <div className="collection-card">
                                                    <IonRouterLink routerLink={getCollectionUrl(collection)}>
                                                        <div className="collection-image-container">
                                                            {collection.mainImage ? (
                                                                <img
                                                                    src={urlFor(collection.mainImage).width(600).height(400).url()}
                                                                    alt={collection.title}
                                                                    className="collection-image"
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <div className="placeholder-image">
                                                                    <div className="retro-grid"></div>
                                                                </div>
                                                            )}
                                                            <div className="collection-overlay"></div>

                                                            {/* Collection badges */}
                                                            {collection.featured && (
                                                                <div className="collection-badge featured-badge">
                                                                    Featured
                                                                </div>
                                                            )}

                                                            {collection.releaseDate && new Date(collection.releaseDate) > new Date() && (
                                                                <div className="collection-badge coming-soon-badge">
                                                                    Coming Soon
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="collection-info">
                                                            <h2 className="collection-title">{collection.title}</h2>

                                                            {collection.releaseDate && (
                                                                <p className="collection-release-date">
                                                                    {formatReleaseDate(collection.releaseDate)}
                                                                </p>
                                                            )}

                                                            {collection.products && (
                                                                <p className="collection-product-count">
                                                                    {collection.products.length} {collection.products.length === 1 ? 'product' : 'products'}
                                                                </p>
                                                            )}

                                                            <div className="view-collection-button">
                                                                Explore Collection
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

export default Collections;