import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { createOrderFromCart } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { CustomerInfo } from '../../types/homepageTypes';

interface PayPalCheckoutButtonProps {
    amount: number;
    onSuccess?: (details: any) => void;
    onError?: (error: any) => void;
    customerInfo?: CustomerInfo;
}

const PayPalCheckoutButton: React.FC<PayPalCheckoutButtonProps> = ({
                                                                       amount,
                                                                       onSuccess,
                                                                       onError,
                                                                       customerInfo
                                                                   }) => {
    const { cart, clearCart } = useCart();

    return (
        <PayPalButtons
            style={{
                layout: 'vertical',
                shape: 'pill',
                color: 'blue'
            }}
            createOrder={(data, actions) => {
                if (!actions.order) {
                    return Promise.reject(new Error('actions.order is undefined'));
                }

                // Create the order on PayPal
                return actions.order.create({
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            amount: {
                                currency_code: 'EUR',
                                value: amount.toFixed(2)
                            }
                        }
                    ]
                });
            }}
            // Enhanced version focusing on the key part
            onApprove={async (data, actions) => {
                try {
                    if (!actions || !actions.order) {
                        throw new Error('actions.order is undefined');
                    }

                    // Capture the PayPal order
                    const details = await actions.order.capture();
                    console.log('PayPal transaction completed', details);

                    // IMPORTANT: Check if customerInfo exists
                    if (!customerInfo) {
                        console.error('Customer info is missing for order creation');
                        return;
                    }

                    if (!cart || cart.items.length === 0) {
                        console.error('Cart is empty or missing for order creation');
                        return;
                    }

                    // Add PayPal details to customer info
                    const enhancedCustomerInfo = {
                        ...customerInfo,
                        paymentMethod: 'paypal',
                        paypalOrderId: details.id,
                        paypalPayerId: details.payer?.payer_id || 'unknown'
                    };

                    console.log('Creating order with data:', {
                        cart,
                        customerInfo: enhancedCustomerInfo
                    });

                    // Create the order in Sanity
                    try {
                        const orderResult = await createOrderFromCart(cart, enhancedCustomerInfo);
                        console.log('Sanity order created successfully:', orderResult);

                        // Clear cart and call success callback
                        clearCart();
                        if (onSuccess) {
                            onSuccess(details);
                        }
                    } catch (orderError) {
                        console.error('Failed to create order in Sanity:', orderError);
                        // Show error but don't block UI since payment was successful
                        alert('Payment successful but order registration failed. Please contact support.');
                    }
                } catch (err) {
                    console.error('PayPal checkout error', err);
                    if (onError) {
                        onError(err);
                    }
                }
            }}
        />
    );
};

export default PayPalCheckoutButton;