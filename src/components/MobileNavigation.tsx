// src/components/MobileNavigation.tsx
import React from 'react';
import {
    IonRouterLink,
    IonIcon
} from '@ionic/react';
import { searchOutline, personOutline, homeOutline, bagOutline, cartOutline } from 'ionicons/icons';
import { useCart } from '../context/CartContext';
import '../scss/components/MobileNavigation.scss';

const MobileNavigation: React.FC = () => {
    const { cart } = useCart();

    return (
        <div className="mobile-nav">
            {/* Shop */}
            <IonRouterLink routerLink="/shop" className="mobile-nav-item">
                <IonIcon icon={bagOutline} />
            </IonRouterLink>

            {/* Search */}
            <IonRouterLink routerLink="/search" className="mobile-nav-item">
                <IonIcon icon={searchOutline} />
            </IonRouterLink>

            {/* Home - Special styling */}
            <IonRouterLink routerLink="/" className="mobile-nav-item home-icon">
                <div className="home-icon-shape">
                    <IonIcon icon={homeOutline} />
                </div>
            </IonRouterLink>

            {/* Account */}
            <IonRouterLink routerLink="/account" className="mobile-nav-item">
                <IonIcon icon={personOutline} />
            </IonRouterLink>

            {/* Cart */}
            <IonRouterLink routerLink="/checkout" className="mobile-nav-item cart-button-container">
                <div className="cart-icon-wrapper">
                    <IonIcon icon={cartOutline} />
                    {cart.totalItems > 0 && (
                        <span className="cart-badge">{cart.totalItems}</span>
                    )}
                </div>
            </IonRouterLink>
        </div>
    );
};

export default MobileNavigation;