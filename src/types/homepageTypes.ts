// types.ts
export interface MenuItem {
    _id: string;
    title: string;
    url: string;
}

export interface SocialLink {
    _id: string;
    id: string;
    label: string;
    url: string;
    color: string;
}

export interface Slug {
    _type: string;
    current: string;
}

export interface Category {
    _id: string;
    title: string;
    slug: Slug;
}

export interface PortableTextBlock {
    _key: string;
    _type: string;
    children: Array<{
        _key: string;
        _type: string;
        marks: string[];
        text: string;
    }>;
    markDefs: any[];
    style: string;
}

export interface ProductVariant {
    _id: string;
    title: string;
    sku: string;
    options: Array<{
        name: string;
        value: string;
    }>;
    price?: number;
    compareAtPrice?: number;
    inStock: boolean;
    inventory?: number;
    image?: any;
}

export interface Product {
    _id: string;
    name: string;
    slug: Slug;
    sku: string;
    mainImage: any; // Sanity image type
    images?: any[]; // Additional images
    price: number;
    compareAtPrice?: number;
    shortDescription?: string;
    description?: PortableTextBlock[]; // Portable Text content
    inStock: boolean;
    featured: boolean;
    new: boolean;
    categories?: Category[];
    variants?: ProductVariant[];
    relatedProducts?: Product[];
}

export interface Collection {
    _id: string;
    title: string;
    slug: Slug;
    mainImage: any; // Sanity image type
    description?: PortableTextBlock[]; // Portable Text content
    featured: boolean;
    products?: Product[];
    lookbookImages?: Array<{
        image: any;
        caption?: string;
        alt: string;
    }>;
}

export interface HomepageData {
    title: string;
    subtitle?: string;
    mainBanner?: any; // Sanity image type
    mainMenuItems: MenuItem[];
    socialLinks: SocialLink[];
    featuredProducts?: Product[];
    featuredCollections?: Collection[];
}