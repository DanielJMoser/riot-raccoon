export default {
    name: 'collection',
    title: 'Collection',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Name of the collection',
            validation: Rule => Rule.required()
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description: 'URL-friendly version of the collection name',
            options: {
                source: 'title',
                maxLength: 96
            },
            validation: Rule => Rule.required()
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
            description: 'Collection description'
        },
        {
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
            description: 'Collection cover image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'products',
            title: 'Products',
            type: 'array',
            description: 'Products in this collection',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'product' }]
                }
            ],
            validation: Rule => Rule.unique()
        },
        {
            name: 'displayOrder',
            title: 'Display Order',
            type: 'number',
            description: 'Order to display collections (lower numbers displayed first)',
            validation: Rule => Rule.integer()
        },
        {
            name: 'releaseDate',
            title: 'Release Date',
            type: 'datetime',
            description: 'When this collection was or will be released'
        },
        {
            name: 'active',
            title: 'Active',
            type: 'boolean',
            description: 'Is this collection currently visible on the site?',
            initialValue: true
        },
        {
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            description: 'Feature this collection on the homepage or in navigation',
            initialValue: false
        },
        {
            name: 'lookbookImages',
            title: 'Lookbook Images',
            type: 'array',
            description: 'Images for the collection lookbook',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'image',
                            title: 'Image',
                            type: 'image',
                            options: {
                                hotspot: true
                            },
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'caption',
                            title: 'Caption',
                            type: 'string',
                            description: 'Optional caption for the image'
                        },
                        {
                            name: 'alt',
                            title: 'Alt Text',
                            type: 'string',
                            description: 'Accessibility text describing the image',
                            validation: Rule => Rule.required()
                        }
                    ],
                    preview: {
                        select: {
                            title: 'caption',
                            media: 'image'
                        },
                        prepare({ title, media }) {
                            return {
                                title: title || 'Untitled Image',
                                media
                            };
                        }
                    }
                }
            ]
        },
        {
            name: 'seo',
            title: 'SEO',
            type: 'seo',
            description: 'Search engine optimization fields'
        }
    ],
    preview: {
        select: {
            title: 'title',
            media: 'mainImage'
        }
    }
}