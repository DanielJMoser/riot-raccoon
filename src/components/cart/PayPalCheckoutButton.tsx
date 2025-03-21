import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';

interface PayPalCheckoutButtonProps {
    amount: number;
    onSuccess?: (details: any) => void;
    onError?: (error: any) => void;
}

const PayPalCheckoutButton: React.FC<PayPalCheckoutButtonProps> = ({
                                                                       amount,
                                                                       onSuccess,
                                                                       onError
                                                                   }) => {
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

                // Create the order on PayPal, keeping closer to original implementation
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
            onApprove={async (data, actions) => {
                try {
                    if (!actions || !actions.order) {
                        throw new Error('actions.order is undefined');
                    }

                    // Capture the order on PayPal
                    const details = await actions.order.capture();
                    const firstName = details?.payer?.name?.given_name ?? 'Unknown';
                    console.log('Transaction completed by', firstName);

                    // Call onSuccess callback if provided
                    if (onSuccess) {
                        onSuccess(details);
                    }
                } catch (err) {
                    console.error('PayPal checkout error', err);
                    if (onError) {
                        onError(err);
                    }
                }
            }}
            onError={(err) => {
                console.error('PayPal checkout error', err);
                if (onError) {
                    onError(err);
                }
            }}
        />
    );
};

export default PayPalCheckoutButton;