// src/components/cart/CartWidget.tsx
import React, { useState, useEffect } from 'react';
import {
    IonButton,
    IonBadge,
    IonIcon,
    IonPopover,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonNote,
    IonRouterLink
} from '@ionic/react';
import { cartOutline, closeCircleOutline } from 'ionicons/icons';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageUtils';
import '../../scss/components/CartWidget.scss';

const CartWidget: React.FC = () => {
    const { cart, removeFromCart } = useCart();
    const [popoverEvent, setPopoverEvent] = useState<any>(null);
    const [showAnimation, setShowAnimation] = useState<boolean>(false);

    // Show animation when cart items change
    useEffect(() => {
        if (cart.items.length > 0) {
            setShowAnimation(true);
            const timer = setTimeout(() => {
                setShowAnimation(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [cart.totalItems]);

    // Handle remove item
    const handleRemoveItem = (productId: string, variantId: string | undefined) => {
        removeFromCart(productId, variantId);
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return `€${amount.toFixed(2)}`;
    };

    return (
        <>
            <IonButton
                className={`cart-widget-button ${showAnimation ? 'cart-animation' : ''}`}
                fill="clear"
                onClick={(e) => setPopoverEvent(e)}
            >
                <IonIcon icon={cartOutline} />
                {cart.totalItems > 0 && (
                    <IonBadge color="primary" className="cart-badge">
                        {cart.totalItems}
                    </IonBadge>
                )}
            </IonButton>

            <IonPopover
                event={popoverEvent}
                isOpen={!!popoverEvent}
                onDidDismiss={() => setPopoverEvent(null)}
                className="cart-popover"
            >
                <div className="cart-widget-header">
                    <h3>Your Cart ({cart.totalItems})</h3>
                </div>

                {cart.items.length === 0 ? (
                    <div className="empty-cart">
                        <p>Your cart is empty</p>
                        <IonButton
                            fill="solid"
                            routerLink="/shop"
                            onClick={() => setPopoverEvent(null)}
                            className="continue-shopping-btn"
                        >
                            Start Shopping
                        </IonButton>
                    </div>
                ) : (
                    <>
                        <IonList className="cart-items-list">
                            {cart.items.map((item, index) => (
                                <IonItem key={`${item.productId}-${item.variantId || ''}-${index}`} className="cart-mini-item">
                                    <IonThumbnail slot="start" className="cart-mini-thumbnail">
                                        {item.image ? (
                                            <img
                                                src={getImageUrl(item.image, 80, 80)}
                                                alt={item.productName}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="placeholder-image"></div>
                                        )}
                                    </IonThumbnail>

                                    <IonLabel className="cart-mini-details">
                                        <h4>{item.productName}</h4>
                                        {item.options && item.options.length > 0 && (
                                            <p className="cart-mini-options">
                                                {item.options.map(opt => `${opt.name}: ${opt.value}`).join(', ')}
                                            </p>
                                        )}
                                        <div className="cart-mini-pricing">
                                            <span className="cart-mini-quantity">
                                                {item.quantity} ×
                                            </span>
                                            <IonNote>{formatCurrency(item.price)}</IonNote>
                                        </div>
                                    </IonLabel>

                                    <IonButton
                                        fill="clear"
                                        className="remove-mini-item"
                                        onClick={() => handleRemoveItem(item.productId, item.variantId)}
                                    >
                                        <IonIcon slot="icon-only" icon={closeCircleOutline} />
                                    </IonButton>
                                </IonItem>
                            ))}
                        </IonList>

                        <div className="cart-widget-footer">
                            <div className="cart-widget-subtotal">
                                <span>Subtotal:</span>
                                <span className="cart-widget-price">{formatCurrency(cart.totalPrice)}</span>
                            </div>

                            <div className="cart-widget-actions">
                                <IonButton
                                    fill="outline"
                                    routerLink="/cart"
                                    className="view-cart-btn"
                                    onClick={() => setPopoverEvent(null)}
                                >
                                    View Cart
                                </IonButton>

                                <IonButton
                                    fill="solid"
                                    routerLink="/checkout"
                                    className="checkout-btn"
                                    onClick={() => setPopoverEvent(null)}
                                >
                                    Checkout
                                </IonButton>
                            </div>

                            <div className="free-shipping-indicator">
                                {cart.totalPrice >= 250 ? (
                                    <div className="free-shipping-qualified">
                                        ✓ You qualify for free shipping!
                                    </div>
                                ) : (
                                    <div className="free-shipping-progress">
                                        <div className="shipping-progress-text">
                                            {formatCurrency(250 - cart.totalPrice)} away from free shipping
                                        </div>
                                        <div className="shipping-progress-bar">
                                            <div
                                                className="shipping-progress-fill"
                                                style={{ width: `${Math.min(100, (cart.totalPrice / 250) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </IonPopover>
        </>
    );
};

export default CartWidget;