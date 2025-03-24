import React, { useState, useEffect } from 'react';
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
    IonToast,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol
} from '@ionic/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useCart } from '../context/CartContext';
import { createOrderFromCart } from '../services/api';
import { CustomerInfo } from '../types/homepageTypes';
import '../scss/Checkout.scss';
import SiteHeader from '../components/SiteHeader';
import PayPalCheckoutButton from '../components/cart/PayPalCheckoutButton';
import {
    cardOutline,
    cashOutline,
    arrowBackOutline,
    checkmarkCircleOutline,
    lockClosedOutline,
    logoPaypal
} from 'ionicons/icons';

const Checkout: React.FC = () => {
    const { cart, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    // Form state
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'FR',
        phone: '',
        paymentMethod: 'creditCard'
    });

    // Payment method
    const [paymentMethod, setPaymentMethod] = useState('creditCard');

    // Update customerInfo when payment method changes
    useEffect(() => {
        setCustomerInfo(prev => ({
            ...prev,
            paymentMethod
        }));
    }, [paymentMethod]);

    // Calculate order totals
    const subtotal = cart.totalPrice;
    const shipping = subtotal > 250 ? 0 : 10;
    const tax = subtotal * 0.2; // 20% tax
    const total = subtotal + shipping + tax;

    // Format currency
    const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

    // Check if cart is empty on initial load and redirect if needed
    useEffect(() => {
        if (cart.items.length === 0 && !orderPlaced) {
            // This could be replaced with a redirect, for now we'll just show a message
            setToastMessage('Your cart is empty');
            setShowToast(true);
        }
    }, [cart.items.length, orderPlaced]);

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

            // Ensure payment method is set in customer info
            const customerData: CustomerInfo = {
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

    // Get current date/time for cyberpunk header
    const getCurrentDateTime = () => {
        const now = new Date();
        const date = now.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const time = now.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${date} ${time}`;
    };

    // Handle successful PayPal payment
    const handlePayPalSuccess = (details: any) => {
        setOrderNumber(`PP-${Math.floor(100000 + Math.random() * 900000)}`);
        setOrderPlaced(true);
    };

    // Handle PayPal error
    const handlePayPalError = (error: any) => {
        console.error('PayPal payment error:', error);
        setToastMessage('Payment failed. Please try again.');
        setShowToast(true);
    };

    return (
        <PayPalScriptProvider
            options={{
                clientId: 'AZftd9zH5gCk6ucDk8LGTShn-tgr_W2IOKUxontLcYs8o2-d2YPbNc3fHbBcqb0opkv7uezihcedizVQ',
                currency: 'EUR'
            }}
        >
            <IonPage className="checkout-page retro-modern">
                <SiteHeader />

                <IonContent>
                    <div className="checkout-container">
                        <div className="checkout-header">
                            <h1>Checkout</h1>
                            <div className="cyberpunk-datetime">{getCurrentDateTime()}</div>
                        </div>

                        {orderPlaced ? (
                            <div className="order-confirmation">
                                <h2>Order Placed Successfully!</h2>
                                <div className="order-number">Order #: {orderNumber}</div>
                                <p>
                                    Thank you for your purchase. We've sent a confirmation email to{' '}
                                    <span className="highlight-text">{customerInfo.email}</span>.
                                </p>
                                <IonButton expand="block" routerLink="/" className="continue-shopping-btn">
                                    <IonIcon icon={arrowBackOutline} slot="start" />
                                    Return to Homepage
                                </IonButton>
                            </div>
                        ) : (
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="12" sizeMd="7">
                                        <div className="customer-info">
                                            <h2>
                                                <IonIcon icon={lockClosedOutline} />
                                                Shipping Information
                                            </h2>
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

                                                <IonRow>
                                                    <IonCol size="12" sizeMd="6">
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
                                                    </IonCol>
                                                    <IonCol size="12" sizeMd="6">
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
                                                    </IonCol>
                                                </IonRow>

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

                                                <IonRow>
                                                    <IonCol size="12" sizeMd="6">
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
                                                    </IonCol>
                                                    <IonCol size="12" sizeMd="6">
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
                                                    </IonCol>
                                                </IonRow>

                                                <IonRow>
                                                    <IonCol size="12" sizeMd="6">
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
                                                    </IonCol>
                                                    <IonCol size="12" sizeMd="6">
                                                        <IonItem>
                                                            <IonLabel position="floating">Country *</IonLabel>
                                                            <IonSelect
                                                                value={customerInfo.country}
                                                                onIonChange={(e) => handleInputChange('country', e.detail.value)}
                                                                className="retro-select"
                                                            >
                                                                <IonSelectOption value="AT">Austria</IonSelectOption>
                                                                <IonSelectOption value="DE">Germany</IonSelectOption>
                                                                <IonSelectOption value="IT">Italy</IonSelectOption>
                                                                <IonSelectOption value="ES">Spain</IonSelectOption>
                                                                <IonSelectOption value="FR">France</IonSelectOption>

                                                            </IonSelect>
                                                        </IonItem>
                                                    </IonCol>
                                                </IonRow>

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
                                            <h2>
                                                <IonIcon icon={cardOutline} />
                                                Payment Method
                                            </h2>
                                            <IonList>
                                                <IonItem>
                                                    <IonLabel>Select Payment Method</IonLabel>
                                                    <IonSelect
                                                        value={paymentMethod}
                                                        onIonChange={(e) => {
                                                            setPaymentMethod(e.detail.value);
                                                        }}
                                                        className="retro-select"
                                                    >
                                                        <IonSelectOption value="creditCard">
                                                            <IonIcon icon={cardOutline} /> Credit Card
                                                        </IonSelectOption>
                                                        <IonSelectOption value="paypal">
                                                            <IonIcon icon={logoPaypal} /> PayPal
                                                        </IonSelectOption>
                                                        <IonSelectOption value="bankTransfer">
                                                            <IonIcon icon={cashOutline} /> Bank Transfer
                                                        </IonSelectOption>
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
                                                    <div className="paypal-info">
                                                        <p>You'll be redirected to PayPal to complete your purchase securely.</p>
                                                    </div>
                                                    <PayPalCheckoutButton
                                                        amount={total}
                                                        customerInfo={customerInfo}
                                                        onSuccess={handlePayPalSuccess}
                                                        onError={handlePayPalError}
                                                    />
                                                </div>
                                            )}

                                            {paymentMethod === 'bankTransfer' && (
                                                <div className="credit-card-form">
                                                    <p className="payment-notice">
                                                        Bank transfer details will be sent to your email after placing the order.
                                                        Your order will be processed once payment is confirmed.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </IonCol>

                                    <IonCol size="12" sizeMd="5">
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

                                        {/* Order Items Summary */}
                                        {cart.items.length > 0 && (
                                            <div className="checkout-summary items-preview">
                                                <h2>Your Items</h2>
                                                <div className="items-list">
                                                    {cart.items.map((item, index) => (
                                                        <div className="item-row" key={`${item.productId}-${item.variantId || 'default'}-${index}`}>
                                                            <div className="item-info">
                                                                <span className="item-name">{item.productName}</span>
                                                                {item.options && item.options.length > 0 && (
                                                                    <span className="item-options">
                                                                        {item.options.map(opt => `${opt.name}: ${opt.value}`).join(', ')}
                                                                    </span>
                                                                )}
                                                                <span className="item-quantity">Qty: {item.quantity}</span>
                                                            </div>
                                                            <span className="item-price">{formatCurrency(item.price * item.quantity)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="checkout-actions">
                                            <IonButton fill="outline" routerLink="/shop" className="continue-shopping-btn">
                                                <IonIcon icon={arrowBackOutline} slot="start" />
                                                Continue Shopping
                                            </IonButton>

                                            {paymentMethod !== 'paypal' && (
                                                <IonButton
                                                    expand="block"
                                                    onClick={handlePlaceOrder}
                                                    className="place-order-btn"
                                                    disabled={cart.items.length === 0}
                                                >
                                                    <IonIcon icon={checkmarkCircleOutline} slot="start" />
                                                    Place Order ({formatCurrency(total)})
                                                </IonButton>
                                            )}
                                        </div>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
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
}

export default Checkout;