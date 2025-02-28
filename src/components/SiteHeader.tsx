// src/components/SiteHeader.tsx
import React, { useEffect, useState } from 'react';
import {
    IonHeader,
    IonRouterLink,
    IonSkeletonText
} from '@ionic/react';
import CartButton from '../components/cart/CartButton';
import '../scss/components/SiteHeader.scss';

interface HeaderProps {
    brandTitle?: string;
    loading?: boolean;
}

const SiteHeader: React.FC<HeaderProps> = ({ brandTitle = 'BRAND', loading = false }) => {
    const [dateTime, setDateTime] = useState<string>('');

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

    return (
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
                            {loading ? (
                                <IonSkeletonText animated style={{ width: '80%', height: '24px' }} />
                            ) : (
                                brandTitle
                            )}
                        </div>
                    </IonRouterLink>
                </div>

                <div className="header-actions">
                    <CartButton />
                    <div className="date-time">
                        <h2>{dateTime}</h2>
                    </div>
                </div>
            </div>
        </IonHeader>
    );
};

export default SiteHeader;