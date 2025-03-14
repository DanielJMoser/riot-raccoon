// src/components/SiteHeader.tsx
import React, { useEffect, useState } from 'react';
import {
    IonHeader,
    IonRouterLink,
    IonIcon,
    IonButton,
    IonSkeletonText
} from '@ionic/react';
import { searchOutline, personOutline } from 'ionicons/icons';
import CartWidget from './cart/CartWidget';
import '../scss/components/SiteHeader.scss';

interface HeaderProps {
    loading?: boolean;
}

const SiteHeader: React.FC<HeaderProps> = ({ loading = false }) => {
    const [dateTime, setDateTime] = useState<string>('');
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    // Brand title is now fixed
    const brandTitle = "Riot Raccoon";

    // Update date and time
    useEffect(() => {
        const updateDateTime = () => {
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
            setDateTime(`${formattedDate} ${formattedTime}`);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    // Track scroll for header style changes
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <IonHeader className={`site-header retro-modern ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
                <div className="header-left">
                    <div className="nav-back">
                        <IonRouterLink routerLink="/" className="caret-link">
                            <span className="caret-icon">▲</span>
                        </IonRouterLink>
                    </div>

                    <div className="header-nav">
                        <IonRouterLink routerLink="/shop" className="nav-link">Shop</IonRouterLink>
                        <IonRouterLink routerLink="/collections" className="nav-link">Collections</IonRouterLink>
                        <IonRouterLink routerLink="/about" className="nav-link">About</IonRouterLink>
                    </div>
                </div>

                <div className="logo-container">
                    <IonRouterLink routerLink="/" className="logo-link">
                        <div className="logo">
                            {loading ? (
                                <IonSkeletonText animated style={{ width: '80%', height: '24px' }} />
                            ) : (
                                brandTitle
                            )}
                        </div>
                    </IonRouterLink>
                </div>

                <div className="header-actions">
                    <IonButton fill="clear" className="search-button">
                        <IonIcon icon={searchOutline} />
                    </IonButton>

                    <IonButton fill="clear" className="account-button" routerLink="/account">
                        <IonIcon icon={personOutline} />
                    </IonButton>

                    <CartWidget />

                    <div className="date-time">
                        <h2>{dateTime}</h2>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation (visible on small screens) */}
            <div className="mobile-nav">
                <IonRouterLink routerLink="/shop" className="mobile-nav-item">
                    <span className="mobile-nav-label">Shop</span>
                </IonRouterLink>

                <IonRouterLink routerLink="/search" className="mobile-nav-item">
                    <IonIcon icon={searchOutline} />
                    <span className="mobile-nav-label">Search</span>
                </IonRouterLink>

                <IonRouterLink routerLink="/" className="mobile-nav-item home-icon">
                    <span className="home-icon-shape">▲</span>
                </IonRouterLink>

                <IonRouterLink routerLink="/account" className="mobile-nav-item">
                    <IonIcon icon={personOutline} />
                    <span className="mobile-nav-label">Account</span>
                </IonRouterLink>

                <div className="mobile-nav-item cart-button-container">
                    <CartWidget />
                    <span className="mobile-nav-label">Cart</span>
                </div>
            </div>
        </IonHeader>
    );
};

export default SiteHeader;