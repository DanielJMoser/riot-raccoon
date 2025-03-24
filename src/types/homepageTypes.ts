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
    active?: boolean;
    displayOrder?: number;
    releaseDate?: string; // Add this field
    products?: Product[];
    lookbookImages?: Array<{
        image: any;
        caption?: string;
        alt: string;
    }>;
    seo?: any;
    productCount?: number; // For displaying product count in collections list
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

export interface CartOption {
    name: string;
    value: string;
}

export interface CartItem {
    productId: string;
    productName: string;
    productSlug: string;
    variantId?: string;
    quantity: number;
    price: number;
    image?: any;
    options?: CartOption[];
}

export interface CartMetadata {
    couponCode?: string;
    notes?: string;
}

export interface Cart {
    id: string;
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    metadata?: CartMetadata;
}

// Order Types

export interface CustomerInfo {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    paymentMethod: string;
    paypalOrderId?: string;
    paypalPayerId?: string;
}

export interface OrderItemOption {
    key: string;
    value: string;
}

export interface OrderItem {
    productId: string;
    variantId?: string;
    name: string;
    price: number;
    quantity: number;
    options?: {
        fields: OrderItemOption[];
    };
    sku?: string;
}

export interface OrderShipping {
    method: string;
    price: number;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
}

export interface OrderPayment {
    method: 'creditCard' | 'paypal' | 'bankTransfer';
    cardLast4?: string;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    discountCode?: string;
    discountAmount?: number;
}

export interface Order {
    _id?: string;
    orderNumber: string;
    customerInfo: CustomerInfo;
    items: OrderItem[];
    shipping: OrderShipping;
    payment: OrderPayment;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    notes?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface OrderCreateResponse {
    orderId: string;
    orderNumber: string;
}

