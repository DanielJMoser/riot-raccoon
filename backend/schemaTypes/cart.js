// cart.js
export default {
    name: 'cart',
    title: 'Cart',
    type: 'document',
    fields: [
        {
            name: 'cartId',
            title: 'Cart ID',
            type: 'string',
            description: 'Unique identifier for the cart',
            validation: Rule => Rule.required()
        },
        {
            name: 'userId',
            title: 'User ID',
            type: 'string',
            description: 'User ID if cart is associated with a logged-in user'
        },
        {
            name: 'items',
            title: 'Cart Items',
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
                            type: 'string',
                        },
                        {
                            name: 'quantity',
                            title: 'Quantity',
                            type: 'number',
                            validation: Rule => Rule.required().min(1).integer()
                        },
                        {
                            name: 'options',
                            title: 'Selected Options',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    fields: [
                                        {
                                            name: 'name',
                                            title: 'Option Name',
                                            type: 'string',
                                            validation: Rule => Rule.required()
                                        },
                                        {
                                            name: 'value',
                                            title: 'Option Value',
                                            type: 'string',
                                            validation: Rule => Rule.required()
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            validation: Rule => Rule.required()
        },
        {
            name: 'updatedAt',
            title: 'Updated At',
            type: 'datetime',
            validation: Rule => Rule.required()
        },
        {
            name: 'status',
            title: 'Cart Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Active', value: 'active' },
                    { title: 'Abandoned', value: 'abandoned' },
                    { title: 'Converted', value: 'converted' },
                ]
            },
            initialValue: 'active'
        },
        {
            name: 'metadata',
            title: 'Cart Metadata',
            type: 'object',
            fields: [
                {
                    name: 'couponCode',
                    title: 'Coupon Code',
                    type: 'string'
                },
                {
                    name: 'notes',
                    title: 'Cart Notes',
                    type: 'text'
                }
            ]
        }
    ],
    preview: {
        select: {
            title: 'cartId',
            subtitle: 'status',
            userId: 'userId',
            itemCount: 'items.length'
        },
        prepare({ title, subtitle, userId, itemCount = 0 }) {
            return {
                title: `Cart ${title.slice(0, 8)}...`,
                subtitle: `${subtitle} | ${itemCount} items | User: ${userId || 'Anonymous'}`
            };
        }
    }
};