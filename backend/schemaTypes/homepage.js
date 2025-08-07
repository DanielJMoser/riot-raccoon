export default {
    name: 'homepage',
    title: 'Homepage',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'RIOT RACCOON title',
            type: 'string',
            description: 'The main brand title displayed in the logo',
            validation: Rule => Rule.required()
        },
        {
            name: 'subtitle',
            title: 'Subtitle',
            type: 'text',
            description: 'Optional subtitle to display on the homepage'
        },
        {
            name: 'mainBanner',
            title: 'Main Banner',
            type: 'image',
            description: 'The main banner image displayed at the top of the homepage',
            options: {
                hotspot: true
            }
        },
        {
            name: 'mainMenuItems',
            title: 'Main Menu Items',
            type: 'array',
            description: 'The main navigation menu items',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'title',
                            title: 'Title',
                            type: 'string',
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'url',
                            title: 'URL',
                            type: 'string',
                            description: 'The URL path, e.g. /shop',
                            validation: Rule => Rule.required()
                        }
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            subtitle: 'url'
                        }
                    }
                }
            ],
            validation: Rule => Rule.required().min(1)
        },
        {
            name: 'socialLinks',
            title: 'Social Media Links',
            type: 'array',
            description: 'Social media links displayed on the homepage',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'id',
                            title: 'ID',
                            type: 'string',
                            description: 'Unique identifier for the social platform (e.g., instagram)',
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'label',
                            title: 'Label',
                            type: 'string',
                            description: 'Display name for the social platform',
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'url',
                            title: 'URL',
                            type: 'url',
                            description: 'Full URL to the social media profile',
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'color',
                            title: 'Color',
                            type: 'string',
                            description: 'Hex color code for the social icon (e.g., #f5c2e7)',
                            validation: Rule => Rule.required()
                        }
                    ],
                    preview: {
                        select: {
                            title: 'label',
                            subtitle: 'url'
                        }
                    }
                }
            ]
        },
        {
            name: 'featuredProducts',
            title: 'Featured Products',
            type: 'array',
            description: 'Products to highlight on the homepage',
            of: [
                {
                    type: 'reference',
                    to: [{type: 'product'}],
                    description: 'Select products to feature on the homepage'
                }
            ]
        }
    ],
    preview: {
        select: {
            title: 'title'
        },
        prepare(selection) {
            return {
                title: selection.title || 'Homepage',
                subtitle: 'Main site configuration'
            }
        }
    }
}