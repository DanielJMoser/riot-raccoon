import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';

interface PayPalCheckoutButtonProps {
    amount: number;
}

const PayPalCheckoutButton: React.FC<PayPalCheckoutButtonProps> = ({ amount }) => {
    return (
        <PayPalButtons
            style={{ layout: 'vertical', shape: 'pill' }}
            createOrder={(data, actions) => {
                if (!actions.order) {
                    // Return a rejected promise if actions.order is unavailable
                    return Promise.reject(new Error('actions.order is undefined'));
                }

                // Create the order on PayPal, specifying currency_code
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
                    // Check if actions.order is available
                    if (!actions || !actions.order) {
                        throw new Error('actions.order is undefined');
                    }

                    // Capture the order on PayPal
                    const details = await actions.order.capture();
                    const firstName = details?.payer?.name?.given_name ?? 'Unknown';

                    console.log('Transaction completed by', firstName);
                    // TODO: Use these `details` to create or update an order in your DB
                } catch (err) {
                    console.error('PayPal checkout error', err);
                }
            }}
            onError={(err) => {
                console.error('PayPal checkout error', err);
            }}
        />
    );
};

export default PayPalCheckoutButton;
