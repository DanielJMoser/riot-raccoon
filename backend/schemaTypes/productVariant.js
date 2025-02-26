export default {
    name: 'productVariant',
    title: 'Product Variant',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Variant Title',
            type: 'string',
            description: 'Name of this variant (e.g., "Small / Black")',
            validation: Rule => Rule.required()
        },
        {
            name: 'sku',
            title: 'SKU',
            type: 'string',
            description: 'Unique variant identifier',
            validation: Rule => Rule.required()
        },
        {
            name: 'options',
            title: 'Options',
            type: 'array',
            description: 'Variant options like size, color, etc.',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'name',
                            title: 'Option Name',
                            type: 'string',
                            description: 'Name of the option (e.g., "Size", "Color")',
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'value',
                            title: 'Option Value',
                            type: 'string',
                            description: 'Value of the option (e.g., "Small", "Black")',
                            validation: Rule => Rule.required()
                        }
                    ]
                }
            ],
            validation: Rule => Rule.required()
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
            description: 'Price of this variant (if different from base product)',
        },
        {
            name: 'compareAtPrice',
            title: 'Compare At Price',
            type: 'number',
            description: 'Original price for sale/discount display'
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            description: 'Image specific to this variant',
            options: {
                hotspot: true
            }
        },
        {
            name: 'inStock',
            title: 'In Stock',
            type: 'boolean',
            description: 'Is this variant currently in stock?',
            initialValue: true
        },
        {
            name: 'inventory',
            title: 'Inventory',
            type: 'number',
            description: 'Current inventory count',
            validation: Rule => Rule.integer().min(0)
        },
        {
            name: 'lowInventoryThreshold',
            title: 'Low Inventory Threshold',
            type: 'number',
            description: 'Threshold for "low stock" warning',
            validation: Rule => Rule.integer().positive()
        },
        {
            name: 'dimensions',
            title: 'Dimensions',
            type: 'object',
            description: 'Physical dimensions of this variant',
            fields: [
                {
                    name: 'weight',
                    title: 'Weight (g)',
                    type: 'number',
                    description: 'Weight in grams'
                },
                {
                    name: 'width',
                    title: 'Width (cm)',
                    type: 'number',
                    description: 'Width in centimeters'
                },
                {
                    name: 'height',
                    title: 'Height (cm)',
                    type: 'number',
                    description: 'Height in centimeters'
                },
                {
                    name: 'depth',
                    title: 'Depth (cm)',
                    type: 'number',
                    description: 'Depth in centimeters'
                }
            ]
        }
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'price',
            media: 'image'
        },
        prepare({ title, subtitle, media }) {
            return {
                title,
                subtitle: subtitle ? `$${subtitle.toFixed(2)}` : 'Uses base price',
                media
            };
        }
    }
}