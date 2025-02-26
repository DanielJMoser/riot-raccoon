export default {
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Name of the category',
            validation: Rule => Rule.required()
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description: 'URL-friendly version of the category name',
            options: {
                source: 'title',
                maxLength: 96
            },
            validation: Rule => Rule.required()
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Category description for SEO and display purposes'
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            description: 'Category image for banners and navigation',
            options: {
                hotspot: true
            }
        },
        {
            name: 'parent',
            title: 'Parent Category',
            type: 'reference',
            description: 'Parent category (for hierarchical categorization)',
            to: [{ type: 'category' }],
            options: {
                filter: ({ document }) => {
                    // Prevent self-referencing
                    return {
                        filter: '_id != $id',
                        params: { id: document._id }
                    }
                }
            }
        },
        {
            name: 'displayOrder',
            title: 'Display Order',
            type: 'number',
            description: 'Order to display categories in navigation (lower numbers displayed first)',
            validation: Rule => Rule.integer()
        },
        {
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            description: 'Feature this category in navigation or homepage',
            initialValue: false
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
            subtitle: 'parent.title',
            media: 'image'
        },
        prepare({ title, subtitle, media }) {
            return {
                title,
                subtitle: subtitle ? `Parent: ${subtitle}` : 'Top-level category',
                media
            };
        }
    }
}