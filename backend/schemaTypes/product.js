export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Product Name',
            type: 'string',
            description: 'Name of the product',
            validation: Rule => Rule.required()
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description: 'URL-friendly version of the product name',
            options: {
                source: 'name',
                maxLength: 96
            },
            validation: Rule => Rule.required()
        },
        {
            name: 'sku',
            title: 'SKU',
            type: 'string',
            description: 'Unique product identifier',
            validation: Rule => Rule.required().custom(sku => {
                if (!/^[A-Z0-9-]+$/.test(sku)) {
                    return 'SKU must contain only uppercase letters, numbers, and hyphens';
                }
                return true;
            })
        },
        {
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
            description: 'Primary product image',
            options: {
                hotspot: true
            },
            validation: Rule => Rule.required()
        },
        {
            name: 'images',
            title: 'Additional Images',
            type: 'array',
            description: 'Additional product images for gallery view',
            of: [
                {
                    type: 'image',
                    options: {
                        hotspot: true
                    }
                }
            ]
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
            description: 'Current product price',
            validation: Rule => Rule.required().positive()
        },
        {
            name: 'compareAtPrice',
            title: 'Compare At Price',
            type: 'number',
            description: 'Original price for sale/discount display'
        },
        {
            name: 'description',
            title: 'Description',
            type: 'array',
            of: [
                {
                    type: 'block'
                }
            ],
            description: 'Full product description',
            validation: Rule => Rule.required()
        },
        {
            name: 'shortDescription',
            title: 'Short Description',
            type: 'text',
            description: 'Brief product summary for listings and previews',
            validation: Rule => Rule.max(160)
        },
        {
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'category' }]
                }
            ],
            description: 'Product categories for organization and filtering'
        },
        {
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags'
            },
            description: 'Keywords for product discovery and filtering'
        },
        {
            name: 'variants',
            title: 'Variants',
            type: 'array',
            description: 'Different product options like sizes, colors, etc.',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'productVariant' }]
                }
            ]
        },
        {
            name: 'inStock',
            title: 'In Stock',
            type: 'boolean',
            description: 'Is the product currently in stock?',
            initialValue: true
        },
        {
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            description: 'Mark as a featured product',
            initialValue: false
        },
        {
            name: 'new',
            title: 'New',
            type: 'boolean',
            description: 'Mark as a new product',
            initialValue: false
        },
        {
            name: 'relatedProducts',
            title: 'Related Products',
            type: 'array',
            description: 'Products to suggest alongside this one',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'product' }]
                }
            ],
            validation: Rule => Rule.unique()
        },
        {
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            description: 'Search engine optimization fields'
        },
        {
            name: 'availableFrom',
            title: 'Available From',
            type: 'datetime',
            description: 'When this product becomes available (for pre-orders or scheduled launches)'
        }
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'price',
            media: 'mainImage'
        },
        prepare({ title, subtitle, media }) {
            return {
                title,
                subtitle: subtitle ? `$${subtitle.toFixed(2)}` : 'No price set',
                media
            };
        }
    }
}