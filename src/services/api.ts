
import {Product, Collection, CartOption} from '../types/homepageTypes';
import sanityClient from '../../backend/services/sanityClient';
import {Cart, CartItem} from "../context/CartContext";
import client from "../../backend/services/sanityClient";


// Get homepage content with expanded references
export const getHomepageContent = async () => {
    try {
        const query = `{
      "homepage": *[_type == "homepage"][0] {
        title,
        subtitle,
        mainBanner,
        mainMenuItems[] {
          _id,
          title, 
          url
        },
        socialLinks[] {
          _id,
          id,
          label,
          url,
          color
        }
      },
      "featuredProducts": *[_type == "product" && featured == true] {
        _id,
        name,
        slug,
        mainImage,
        images,
        price, 
        compareAtPrice,
        shortDescription,
        inStock,
        inventory,
        lowInventoryThreshold,
        featured,
        new,
        "categories": categories[] -> {
          _id,
          title,
          slug
        }
      },
      "featuredCollections": *[_type == "collection" && featured == true && active != false] {
        _id,
        title,
        slug,
        mainImage,
        releaseDate
      }
    }`;

        const data = await client.fetch(query);

        // Combine the homepage data with featured products and collections
        return {
            ...data.homepage,
            featuredProducts: data.featuredProducts,
            featuredCollections: data.featuredCollections
        };
    } catch (error) {
        console.error('Error fetching homepage content:', error);
        throw error;
    }
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
    const query = `*[_type == "product"] {
    _id,
    name,
    "slug": slug,
    sku,
    mainImage,
    price,
    compareAtPrice,
    shortDescription,
    inStock,
    inventory,
    lowInventoryThreshold,
    featured,
    new,
    "categories": categories[]-> {
      _id,
      title,
      "slug": slug
    }
  }`;

    const data = await sanityClient.fetch(query);
    return data;
};

// Get all collections
export const getCollections = async (): Promise<Collection[]> => {
    try {
        const query = `*[_type == "collection" && active != false] {
      _id,
      title,
      slug,
      mainImage,
      releaseDate,
      featured,
      "productCount": count(products)
    } | order(displayOrder asc, releaseDate desc)`;

        const collections = await client.fetch<Collection[]>(query);
        return collections;
    } catch (error) {
        console.error('Error fetching collections:', error);
        throw error;
    }
};

// Get a single product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
    const query = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug,
    sku,
    mainImage,
    images,
    price,
    compareAtPrice,
    description,
    shortDescription,
    inStock,
    inventory,
    lowInventoryThreshold,
    featured,
    new,
    "categories": categories[]-> {
      _id,
      title,
      "slug": slug
    },
    "variants": variants[]-> {
      _id,
      title,
      sku,
      options,
      price,
      inStock,
      inventory,
      lowInventoryThreshold
    },
    "relatedProducts": relatedProducts[]-> {
      _id,
      name,
      "slug": slug,
      mainImage,
      price
    }
  }`;

    const data = await sanityClient.fetch(query, { slug });
    return data;
};

// Get a single collection by slug
export const getCollectionBySlug = async (slug: string): Promise<Collection> => {
    try {
        const query = `*[_type == "collection" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      mainImage,
      description,
      releaseDate,
      active,
      featured,
      lookbookImages[] {
        image,
        caption,
        alt
      },
      "products": products[] -> {
        _id,
        name,
        slug,
        mainImage,
        images,
        price,
        compareAtPrice,
        shortDescription,
        inStock,
        featured,
        new,
        "categories": categories[] -> {
          _id,
          title,
          slug
        },
        "variants": *[_type == "productVariant" && references(^._id)] {
          _id,
          title,
          sku,
          price,
          compareAtPrice,
          inStock,
          image,
          options
        }
      }
    }`;

        const collection = await client.fetch<Collection>(query, { slug });

        if (!collection) {
            throw new Error('Collection not found');
        }

        return collection;
    } catch (error) {
        console.error(`Error fetching collection with slug ${slug}:`, error);
        throw error;
    }
};

// Save a cart to Sanity (for persistent storage)
export const saveCart = async (cart: Cart) => {
    try {
        // First, check if a cart with this ID already exists
        const existingCart = await sanityClient.fetch(
            `*[_type == "cart" && cartId == $cartId][0]`,
            { cartId: cart.id }
        );

        const now = new Date().toISOString();

        if (existingCart) {
            // Update existing cart
            await sanityClient
                .patch(existingCart._id)
                .set({
                    items: cart.items.map((item: CartItem) => ({
                        productId: item.productId,
                        variantId: item.variantId || null,
                        quantity: item.quantity,
                        options: item.options || []
                    })),
                    updatedAt: now,
                    metadata: cart.metadata || {}
                })
                .commit();

            return existingCart._id;
        } else {
            // Create new cart document
            const result = await sanityClient.create({
                _type: 'cart',
                cartId: cart.id,
                items: cart.items.map((item: CartItem) => ({
                    productId: item.productId,
                    variantId: item.variantId || null,
                    quantity: item.quantity,
                    options: item.options || []
                })),
                createdAt: now,
                updatedAt: now,
                status: 'active',
                metadata: cart.metadata || {}
            });

            return result._id;
        }
    } catch (error) {
        console.error('Error saving cart to Sanity:', error);
        throw error;
    }
};

// Define an interface for Sanity cart items
interface SanityCartItem {
    productId: string;
    variantId: string | null;
    quantity: number;
    options: CartOption[];
}

// Fetch a saved cart from Sanity
export const getCartById = async (cartId: string): Promise<Cart | null> => {
    try {
        const cart = await sanityClient.fetch(
            `*[_type == "cart" && cartId == $cartId][0]{
        cartId,
        items[] {
          productId,
          variantId,
          quantity,
          options
        },
        status,
        metadata
      }`,
            { cartId }
        );

        if (!cart) {
            throw new Error('Cart not found');
        }

        // Enhance cart with product details
        const enhancedItems = await Promise.all(
            cart.items.map(async (item: SanityCartItem) => {
                // Fetch product details
                const product = await getProductById(item.productId);

                // Fetch variant details if available
                let variant = null;
                if (item.variantId && product?.variants) {
                    variant = product.variants.find((v: any) => v._id === item.variantId);
                }

                return {
                    ...item,
                    productName: product?.name || 'Unknown Product',
                    productSlug: product?.slug?.current || '',
                    price: variant?.price || product?.price || 0,
                    image: variant?.image || product?.mainImage || null
                };
            })
        );

        // Calculate totals
        const totalItems = enhancedItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
        const totalPrice = enhancedItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);

        return {
            id: cart.cartId,
            items: enhancedItems,
            totalItems,
            totalPrice,
            metadata: cart.metadata
        };
    } catch (error) {
        console.error('Error fetching cart from Sanity:', error);
        throw error;
    }
};

/*export interface CustomerInfo {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    paymentMethod?: string;
}*/
// Convert cart to order
export const createOrderFromCart = async (cart: any, customerInfo: any) => {
    try {
        // Create an order in Sanity
        const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
        const now = new Date().toISOString();

        // Map cart items to order items
        const orderItems = await Promise.all(
            cart.items.map(async (item: any) => {
                const product = await getProductById(item.productId);
                return {
                    productId: item.productId,
                    variantId: item.variantId || null,
                    name: product?.name || 'Unknown Product',
                    price: item.price,
                    quantity: item.quantity,
                    options: {
                        fields: item.options?.map((opt: any) => ({
                            key: opt.name,
                            value: opt.value
                        })) || []
                    },
                    sku: product?.sku || ''
                };
            })
        );

        // Calculate subtotal, tax, etc.
        const subtotal = cart.totalPrice;
        const tax = subtotal * 0.20; // Example: 20% tax
        const shippingCost = subtotal > 250 ? 0 : 10; // Free shipping over €250
        const total = subtotal + tax + shippingCost;

        const orderData = {
            _type: 'order',
            orderNumber,
            customerInfo,
            items: orderItems,
            shipping: {
                method: 'Standard Shipping',
                price: shippingCost
            },
            payment: {
                method: 'creditCard', // Default, would be set by checkout process
                subtotal,
                shipping: shippingCost,
                tax,
                total,
                discountCode: cart.metadata?.couponCode || '',
                discountAmount: 0 // Would be calculated based on the coupon
            },
            status: 'pending',
            notes: cart.metadata?.notes || '',
            createdAt: now,
            updatedAt: now
        };

        const result = await sanityClient.create(orderData);

        // Update the cart status to 'converted'
        if (cart.id) {
            const cartDoc = await sanityClient.fetch(
                `*[_type == "cart" && cartId == $cartId][0]._id`,
                { cartId: cart.id }
            );

            if (cartDoc) {
                await sanityClient
                    .patch(cartDoc)
                    .set({
                        status: 'converted',
                        updatedAt: now
                    })
                    .commit();
            }
        }

        return {
            orderId: result._id,
            orderNumber
        };
    } catch (error) {
        console.error('Error creating order from cart:', error);
        throw error;
    }
};

// Helper to get a product by ID
const getProductById = async (productId: string) => {
    try {
        return await sanityClient.fetch(
            `*[_type == "product" && _id == $productId][0]`,
            { productId }
        );
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};