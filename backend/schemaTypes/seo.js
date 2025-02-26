export default {
    name: 'seo',
    title: 'SEO',
    type: 'object',
    fields: [
        {
            name: 'metaTitle',
            title: 'Meta Title',
            type: 'string',
            description: 'Title for browser tab and search results',
            validation: Rule => Rule.max(60).warning('Longer titles may be truncated in search results')
        },
        {
            name: 'metaDescription',
            title: 'Meta Description',
            type: 'text',
            description: 'Description for search engine results',
            validation: Rule => Rule.max(160).warning('Longer descriptions may be truncated in search results')
        },
        {
            name: 'keywords',
            title: 'Keywords',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags'
            },
            description: 'Keywords for search engines (comma separated)'
        },
        {
            name: 'ogImage',
            title: 'Social Media Image',
            type: 'image',
            description: 'Image shown when shared on social media (1200x630px recommended)',
            options: {
                hotspot: true
            }
        },
        {
            name: 'canonicalUrl',
            title: 'Canonical URL',
            type: 'url',
            description: 'Override the default canonical URL if needed'
        },
        {
            name: 'noIndex',
            title: 'No Index',
            type: 'boolean',
            description: 'Prevent search engines from indexing this page',
            initialValue: false
        }
    ]
}