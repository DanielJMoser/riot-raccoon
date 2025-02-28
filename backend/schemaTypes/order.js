export default {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        {
            name: 'orderNumber',
            title: 'Order Number',
            type: 'string',
            description: 'Unique order identifier',
            validation: Rule => Rule.required()
        },
        {
            name: 'customerInfo',
            title: 'Customer Information',
            type: 'object',
            fields: [
                {
                    name: 'email',
                    title: 'Email',
                    type: 'string',
                    validation: Rule => Rule.required().email()
                },
                {
                    name: 'firstName',
                    title: 'First Name',
                    type: 'string',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'lastName',
                    title: 'Last Name',
                    type: 'string',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'address',
                    title: 'Address',
                    type: 'string',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'city',
                    title: 'City',
                    type: 'string',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'state',
                    title: 'State/Province',
                    type: 'string',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'postalCode',
                    title: 'Postal Code',
                    type: 'string',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'country',
                    title: 'Country',
                    type: 'string',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'phone',
                    title: 'Phone',
                    type: 'string'
                }
            ],
            validation: Rule => Rule.required()
        },
        {
            name: 'items',
            title: 'Order Items',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'productId',
                            title: 'Product ID',
                            type: 'string',
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'variantId',
                            title: 'Variant ID',
                            type: 'string'
                        },
                        {
                            name: 'name',
                            title: 'Product Name',
                            type: 'string',
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'price',
                            title: 'Price',
                            type: 'number',
                            validation: Rule => Rule.required().positive()
                        },
                        {
                            name: 'quantity',
                            title: 'Quantity',
                            type: 'number',
                            validation: Rule => Rule.required().positive().integer()
                        },
                        {
                            name: 'options',
                            title: 'Product Options',
                            type: 'object',
                            fields: [
                                {
                                    name: 'fields',
                                    title: 'Option Fields',
                                    type: 'array',
                                    of: [
                                        {
                                            type: 'object',
                                            fields: [
                                                {
                                                    name: 'key',
                                                    title: 'Option Name',
                                                    type: 'string'
                                                },
                                                {
                                                    name: 'value',
                                                    title: 'Option Value',
                                                    type: 'string'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: 'sku',
                            title: 'SKU',
                            type: 'string'
                        }
                    ]
                }
            ],
            validation: Rule => Rule.required().min(1)
        },
        {
            name: 'shipping',
            title: 'Shipping Information',
            type: 'object',
            fields: [
                {
                    name: 'method',
                    title: 'Shipping Method',
                    type: 'string',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'price',
                    title: 'Shipping Cost',
                    type: 'number',
                    validation: Rule => Rule.required().min(0)
                },
                {
                    name: 'trackingNumber',
                    title: 'Tracking Number',
                    type: 'string'
                },
                {
                    name: 'carrier',
                    title: 'Shipping Carrier',
                    type: 'string'
                },
                {
                    name: 'estimatedDelivery',
                    title: 'Estimated Delivery Date',
                    type: 'date'
                }
            ],
            validation: Rule => Rule.required()
        },
        {
            name: 'payment',
            title: 'Payment Information',
            type: 'object',
            fields: [
                {
                    name: 'method',
                    title: 'Payment Method',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Credit Card', value: 'creditCard' },
                            { title: 'PayPal', value: 'paypal' },
                            { title: 'Bank Transfer', value: 'bankTransfer' }
                        ]
                    }
                },
                {
                    name: 'cardLast4',
                    title: 'Last 4 Digits of Card',
                    type: 'string'
                },
                {
                    name: 'subtotal',
                    title: 'Subtotal',
                    type: 'number',
                    validation: Rule => Rule.required().positive()
                },
                {
                    name: 'shipping',
                    title: 'Shipping Cost',
                    type: 'number',
                    validation: Rule => Rule.required().min(0)
                },
                {
                    name: 'tax',
                    title: 'Tax Amount',
                    type: 'number',
                    validation: Rule => Rule.required().min(0)
                },
                {
                    name: 'total',
                    title: 'Total Amount',
                    type: 'number',
                    validation: Rule => Rule.required().positive()
                },
                {
                    name: 'discountCode',
                    title: 'Discount Code',
                    type: 'string'
                },
                {
                    name: 'discountAmount',
                    title: 'Discount Amount',
                    type: 'number'
                }
            ],
            validation: Rule => Rule.required()
        },
        {
            name: 'status',
            title: 'Order Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Processing', value: 'processing' },
                    { title: 'Shipped', value: 'shipped' },
                    { title: 'Delivered', value: 'delivered' },
                    { title: 'Cancelled', value: 'cancelled' }
                ]
            },
            initialValue: 'pending',
            validation: Rule => Rule.required()
        },
        {
            name: 'notes',
            title: 'Order Notes',
            type: 'text'
        },
        {
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            validation: Rule => Rule.required()
        },
        {
            name: 'updatedAt',
            title: 'Last Updated',
            type: 'datetime'
        }
    ],
    preview: {
        select: {
            title: 'orderNumber',
            subtitle: 'status',
            customer: 'customerInfo.email'
        },
        prepare({ title, subtitle, customer }) {
            return {
                title: `Order ${title}`,
                subtitle: `${subtitle.charAt(0).toUpperCase() + subtitle.slice(1)} - ${customer}`
            };
        }
    }
};