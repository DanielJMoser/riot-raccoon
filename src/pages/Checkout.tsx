import React, { useState } from 'react';
import {
    IonContent,
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonLoading,
    IonToast
} from '@ionic/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useCart } from '../context/CartContext';
import { createOrderFromCart } from '../services/api';
import '../scss/Checkout.scss';
import SiteHeader from '../components/SiteHeader';
import PayPalCheckoutButton from '../components/cart/PayPalCheckoutButton';

const Checkout: React.FC = () => {
    const { cart, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    // Form state
    const [customerInfo, setCustomerInfo] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'FR',
        phone: ''
    });

    // Payment method
    const [paymentMethod, setPaymentMethod] = useState('creditCard');

    // Calculate order totals
    const subtotal = cart.totalPrice;
    const shipping = subtotal > 250 ? 0 : 10;
    const tax = subtotal * 0.2; // 20% tax
    const total = subtotal + shipping + tax;

    // Format currency
    const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

    const handleInputChange = (field: string, value: string) => {
        setCustomerInfo((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        const requiredFields = [
            'email',
            'firstName',
            'lastName',
            'address',
            'city',
            'state',
            'postalCode',
            'country'
        ];

        for (const field of requiredFields) {
            if (!customerInfo[field as keyof typeof customerInfo]) {
                setToastMessage(
                    `Please fill in the required field: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
                );
                setShowToast(true);
                return false;
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerInfo.email)) {
            setToastMessage('Please enter a valid email address');
            setShowToast(true);
            return false;
        }

        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        if (cart.items.length === 0) {
            setToastMessage('Your cart is empty');
            setShowToast(true);
            return;
        }

        try {
            setLoading(true);

            // Add payment method to customer info
            const customerData = {
                ...customerInfo,
                paymentMethod
            };

            // Create order in Sanity
            const order = await createOrderFromCart(cart, customerData);

            // Clear the cart
            clearCart();

            // Show success
            setOrderNumber(order.orderNumber);
            setOrderPlaced(true);
        } catch (error) {
            console.error('Error placing order:', error);
            setToastMessage('Failed to place your order. Please try again.');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PayPalScriptProvider
            options={{
                clientId: 'API-KEY',
                currency: 'EUR'
            }}
        >
            <IonPage>
                <SiteHeader />

                <IonContent>
                    <div className="checkout-container">
                        <div className="checkout-header">
                            <h1>Checkout</h1>
                        </div>

                        {orderPlaced ? (
                            <div className="order-confirmation">
                                <h2>Order Placed Successfully!</h2>
                                <p className="order-number">Order #: {orderNumber}</p>
                                <p>
                                    Thank you for your purchase. We've sent a confirmation email to{' '}
                                    {customerInfo.email}.
                                </p>
                                <IonButton expand="block" routerLink="/" className="continue-shopping-btn">
                                    Return to Homepage
                                </IonButton>
                            </div>
                        ) : (
                            <>
                                <div className="checkout-summary">
                                    <h2>Order Summary</h2>
                                    <div className="summary-details">
                                        <div className="summary-row">
                                            <span>Items ({cart.totalItems}):</span>
                                            <span>{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Shipping:</span>
                                            <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Tax (20%):</span>
                                            <span>{formatCurrency(tax)}</span>
                                        </div>
                                        {cart.metadata?.couponCode && (
                                            <div className="summary-row discount">
                                                <span>Discount ({cart.metadata.couponCode}):</span>
                                                <span>-€0.00</span>
                                            </div>
                                        )}
                                        <div className="summary-row total">
                                            <span>Total:</span>
                                            <span>{formatCurrency(total)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="customer-info">
                                    <h2>Shipping Information</h2>
                                    <IonList>
                                        <IonItem>
                                            <IonLabel position="floating">Email *</IonLabel>
                                            <IonInput
                                                type="email"
                                                value={customerInfo.email}
                                                onIonChange={(e) =>
                                                    handleInputChange('email', e.detail.value || '')
                                                }
                                                required
                                            />
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">First Name *</IonLabel>
                                            <IonInput
                                                value={customerInfo.firstName}
                                                onIonChange={(e) =>
                                                    handleInputChange('firstName', e.detail.value || '')
                                                }
                                                required
                                            />
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">Last Name *</IonLabel>
                                            <IonInput
                                                value={customerInfo.lastName}
                                                onIonChange={(e) =>
                                                    handleInputChange('lastName', e.detail.value || '')
                                                }
                                                required
                                            />
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">Address *</IonLabel>
                                            <IonInput
                                                value={customerInfo.address}
                                                onIonChange={(e) =>
                                                    handleInputChange('address', e.detail.value || '')
                                                }
                                                required
                                            />
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">City *</IonLabel>
                                            <IonInput
                                                value={customerInfo.city}
                                                onIonChange={(e) =>
                                                    handleInputChange('city', e.detail.value || '')
                                                }
                                                required
                                            />
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">State/Province *</IonLabel>
                                            <IonInput
                                                value={customerInfo.state}
                                                onIonChange={(e) =>
                                                    handleInputChange('state', e.detail.value || '')
                                                }
                                                required
                                            />
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">Postal Code *</IonLabel>
                                            <IonInput
                                                value={customerInfo.postalCode}
                                                onIonChange={(e) =>
                                                    handleInputChange('postalCode', e.detail.value || '')
                                                }
                                                required
                                            />
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">Country *</IonLabel>
                                            <IonSelect
                                                value={customerInfo.country}
                                                onIonChange={(e) => handleInputChange('country', e.detail.value)}
                                            >
                                                <IonSelectOption value="FR">France</IonSelectOption>
                                                <IonSelectOption value="DE">Germany</IonSelectOption>
                                                <IonSelectOption value="IT">Italy</IonSelectOption>
                                                <IonSelectOption value="ES">Spain</IonSelectOption>
                                                <IonSelectOption value="UK">United Kingdom</IonSelectOption>
                                                <IonSelectOption value="US">United States</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="floating">Phone</IonLabel>
                                            <IonInput
                                                type="tel"
                                                value={customerInfo.phone}
                                                onIonChange={(e) =>
                                                    handleInputChange('phone', e.detail.value || '')
                                                }
                                            />
                                        </IonItem>
                                    </IonList>
                                </div>

                                <div className="payment-info">
                                    <h2>Payment Method</h2>
                                    <IonList>
                                        <IonItem>
                                            <IonLabel>Payment Method</IonLabel>
                                            <IonSelect
                                                value={paymentMethod}
                                                onIonChange={(e) => {
                                                    console.log('Payment method changed to:', e.detail.value);
                                                    setPaymentMethod(e.detail.value);
                                                }}
                                            >
                                                <IonSelectOption value="creditCard">Credit Card</IonSelectOption>
                                                <IonSelectOption value="paypal">PayPal</IonSelectOption>
                                                <IonSelectOption value="bankTransfer">Bank Transfer</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                    </IonList>

                                    {paymentMethod === 'creditCard' && (
                                        <div className="credit-card-form">
                                            <p className="payment-notice">
                                                This is a demo checkout page. In a production app, you would integrate
                                                with a payment processor like Stripe or PayPal here.
                                            </p>
                                        </div>
                                    )}

                                    {paymentMethod === 'paypal' && (
                                        <div className="paypal-button-container">
                                            <PayPalCheckoutButton amount={total} />
                                        </div>
                                    )}
                                </div>

                                <div className="checkout-actions">
                                    <IonButton fill="outline" routerLink="/shop" className="continue-shopping-btn">
                                        Continue Shopping
                                    </IonButton>

                                    <IonButton
                                        expand="block"
                                        onClick={handlePlaceOrder}
                                        className="place-order-btn"
                                        disabled={cart.items.length === 0}
                                    >
                                        Place Order ({formatCurrency(total)})
                                    </IonButton>
                                </div>
                            </>
                        )}
                    </div>

                    <IonLoading isOpen={loading} message="Processing your order..." />

                    <IonToast
                        isOpen={showToast}
                        onDidDismiss={() => setShowToast(false)}
                        message={toastMessage}
                        duration={3000}
                        position="bottom"
                        color="danger"
                    />
                </IonContent>
            </IonPage>
        </PayPalScriptProvider>
    );
};

export default Checkout;
