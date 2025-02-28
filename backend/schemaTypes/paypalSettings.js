export default {
    name: 'paypalSettings',
    title: 'PayPal Settings',
    type: 'document',
    fields: [
        {
            name: 'clientId',
            title: 'Client ID',
            type: 'string',
            description: 'Your PayPal client ID from developer.paypal.com',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'currency',
            title: 'Currency',
            type: 'string',
            description: 'ISO currency code (e.g., USD, EUR)',
            initialValue: 'USD',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'environment',
            title: 'Environment',
            type: 'string',
            description: 'PayPal environment (sandbox or production)',
            options: {
                list: [
                    { title: 'Sandbox', value: 'sandbox' },
                    { title: 'Production', value: 'production' },
                ],
            },
            initialValue: 'sandbox',
            validation: (Rule) => Rule.required(),
        },
    ],
    preview: {
        select: {
            title: 'environment',
            subtitle: 'clientId',
        },
        prepare({ title, subtitle }) {
            return {
                title: `PayPal: ${title}`,
                subtitle: subtitle ? `Client: ${subtitle}` : '',
            };
        },
    },
};