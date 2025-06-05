// src/components/CartModal.tsx
import React from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonNote,
    IonIcon,
    IonFooter,
    IonGrid,
    IonRow,
    IonCol,
    IonInput
} from '@ionic/react';
import { close, trashOutline, addOutline, removeOutline } from 'ionicons/icons';
import { useCart } from '../../context/CartContext';
import { urlFor } from '../../../backend/services/sanityClient';
/*
import '../scss/components/CartModal.scss';
*/

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
    const {
        cart,
        updateCartItem,
        removeFromCart,
        clearCart,
        applyCoupon,
        addNote
    } = useCart();
    const [couponCode, setCouponCode] = React.useState('');
    const [note, setNote] = React.useState('');

    // Handle quantity update
    const handleQuantityUpdate = (productId: string, variantId: string | undefined, newQuantity: number) => {
        updateCartItem(productId, variantId, newQuantity);
    };

    // Handle remove item
    const handleRemoveItem = (productId: string, variantId: string | undefined) => {
        removeFromCart(productId, variantId);
    };

    // Apply coupon
    const handleApplyCoupon = () => {
        if (couponCode.trim()) {
            applyCoupon(couponCode.trim());
        }
    };

    // Add note
    const handleAddNote = () => {
        if (note.trim()) {
            addNote(note.trim());
        }
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return `€${amount.toFixed(2)}`;
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="cart-modal">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Your Cart ({cart.totalItems} items)</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {cart.items.length === 0 ? (
                    <div className="empty-cart">
                        <h2>Your cart is empty</h2>
                        <p>Add some items to get started</p>
                        <IonButton expand="block" routerLink="/shop" onClick={onClose}>
                            Continue Shopping
                        </IonButton>
                    </div>
                ) : (
                    <>
                        <IonList className="cart-list">
                            {cart.items.map((item, index) => (
                                <IonItem key={`${item.productId}-${item.variantId || 'default'}-${index}`} className="cart-item">
                                    <IonThumbnail slot="start" className="cart-thumbnail">
                                        {item.image ? (
                                            <img src={urlFor(item.image).width(100).height(100).url()} alt={item.productName} />
                                        ) : (
                                            <div className="placeholder-image"></div>
                                        )}
                                    </IonThumbnail>

                                    <IonLabel className="cart-item-details">
                                        <h2>{item.productName}</h2>
                                        {item.options && item.options.length > 0 && (
                                            <p className="cart-item-options">
                                                {item.options.map(opt => `${opt.name}: ${opt.value}`).join(', ')}
                                            </p>
                                        )}
                                        <IonNote>{formatCurrency(item.price)}</IonNote>
                                    </IonLabel>

                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <IonButton
                                                size="small"
                                                fill="clear"
                                                onClick={() => handleQuantityUpdate(item.productId, item.variantId, item.quantity - 1)}
                                            >
                                                <IonIcon icon={removeOutline} />
                                            </IonButton>

                                            <span className="quantity">{item.quantity}</span>

                                            <IonButton
                                                size="small"
                                                fill="clear"
                                                onClick={() => handleQuantityUpdate(item.productId, item.variantId, item.quantity + 1)}
                                            >
                                                <IonIcon icon={addOutline} />
                                            </IonButton>
                                        </div>

                                        <IonButton
                                            fill="clear"
                                            color="danger"
                                            onClick={() => handleRemoveItem(item.productId, item.variantId)}
                                        >
                                            <IonIcon icon={trashOutline} />
                                        </IonButton>
                                    </div>

                                    <div className="cart-item-price" slot="end">
                                        {formatCurrency(item.price * item.quantity)}
                                    </div>
                                </IonItem>
                            ))}
                        </IonList>

                        <div className="cart-options">
                            <IonGrid>
                                <IonRow>
                                    <IonCol>
                                        <div className="coupon-section">
                                            <h3>Coupon Code</h3>
                                            <div className="coupon-input">
                                                <IonInput
                                                    value={couponCode}
                                                    placeholder="Enter coupon code"
                                                    onIonChange={e => setCouponCode(e.detail.value || '')}
                                                />
                                                <IonButton onClick={handleApplyCoupon}>Apply</IonButton>
                                            </div>
                                            {cart.metadata?.couponCode && (
                                                <div className="active-coupon">
                                                    Applied: {cart.metadata.couponCode}
                                                </div>
                                            )}
                                        </div>
                                    </IonCol>
                                </IonRow>

                                <IonRow>
                                    <IonCol>
                                        <div className="note-section">
                                            <h3>Order Notes</h3>
                                            <IonInput
                                                value={note}
                                                placeholder="Add notes to your order"
                                                onIonChange={e => setNote(e.detail.value || '')}
                                            />
                                            <IonButton fill="outline" onClick={handleAddNote}>
                                                Add Note
                                            </IonButton>
                                            {cart.metadata?.notes && (
                                                <div className="note-preview">
                                                    Note: {cart.metadata.notes}
                                                </div>
                                            )}
                                        </div>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </div>
                    </>
                )}
            </IonContent>

            {cart.items.length > 0 && (
                <IonFooter>
                    <div className="cart-summary">
                        <div className="cart-totals">
                            <div className="subtotal">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(cart.totalPrice)}</span>
                            </div>

                            <div className="shipping">
                                <span>Shipping:</span>
                                <span>{cart.totalPrice > 250 ? 'Free' : formatCurrency(10)}</span>
                            </div>

                            <div className="tax">
                                <span>Tax (20%):</span>
                                <span>{formatCurrency(cart.totalPrice * 0.2)}</span>
                            </div>

                            <div className="total">
                                <span>Total:</span>
                                <span>
                  {formatCurrency(
                      cart.totalPrice + (cart.totalPrice * 0.2) + (cart.totalPrice > 250 ? 0 : 10)
                  )}
                </span>
                            </div>
                        </div>

                        <div className="cart-actions">
                            <IonButton color="medium" onClick={clearCart}>
                                Clear Cart
                            </IonButton>

                            <IonButton color="primary" routerLink="/checkout" onClick={onClose}>
                                Checkout
                            </IonButton>
                        </div>

                        <div className="cart-info">
                            <p>* Free shipping on orders over €250</p>
                        </div>
                    </div>
                </IonFooter>
            )}
        </IonModal>
    );
};

export default CartModal;