import React from 'react';
import { IonBadge, IonButton, IonIcon } from '@ionic/react';
import { cart } from 'ionicons/icons';
import { useCart } from '../../context/CartContext';
import '../scss/components/CartIcon.scss';

interface CartIconProps {
    onClick: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
    const { cart: cartState } = useCart();

    return (
        <div className="cart-icon-container">
            <IonButton fill="clear" onClick={onClick} className="cart-button">
                <IonIcon icon={cart} />
                {cartState.totalItems > 0 && (
                    <IonBadge color="primary" className="cart-badge">
                        {cartState.totalItems}
                    </IonBadge>
                )}
            </IonButton>
        </div>
    );
};

export default CartIcon;