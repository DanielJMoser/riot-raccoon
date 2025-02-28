// src/components/CartButton.tsx
import React, { useState } from 'react';
import { IonButton, IonBadge, IonIcon } from '@ionic/react';
import { cartOutline } from 'ionicons/icons';
import { useCart } from '../../context/CartContext';
import CartModal from './CartModal';
import '../../scss/components/CartButton.scss';

const CartButton: React.FC = () => {
    const { cart } = useCart();
    const [showCartModal, setShowCartModal] = useState(false);

    return (
        <>
            <IonButton
                className="cart-button"
                fill="clear"
                onClick={() => setShowCartModal(true)}
            >
                <IonIcon icon={cartOutline} />
                {cart.totalItems > 0 && (
                    <IonBadge color="primary" className="cart-badge">
                        {cart.totalItems}
                    </IonBadge>
                )}
            </IonButton>

            <CartModal
                isOpen={showCartModal}
                onClose={() => setShowCartModal(false)}
            />
        </>
    );
};

export default CartButton;