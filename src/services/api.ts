
import { HomepageData, Product, Collection } from '../types/homepageTypes';
import sanityClient from '../../backend/services/sanityClient';


// Get homepage content with expanded references
export const getHomepageContent = async (): Promise<HomepageData> => {
    const query = `*[_type == "homepage"][0]{
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
    },
    "featuredProducts": featuredProducts[]-> {
      _id,
      name,
      "slug": slug,
      sku,
      mainImage,
      price,
      compareAtPrice,
      shortDescription,
      inStock,
      featured,
      new,
      "categories": categories[]-> {
        _id,
        title,
        "slug": slug
      }
    },
    "featuredCollections": *[_type == "collection" && featured == true] {
      _id,
      title,
      "slug": slug,
      mainImage,
      featured
    }[0...4]
  }`;

    const data = await sanityClient.fetch(query);
    return data;
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
    const query = `*[_type == "collection"] {
    _id,
    title,
    "slug": slug,
    mainImage,
    description,
    featured,
    "products": products[]-> {
      _id,
      name,
      "slug": slug,
      mainImage,
      price
    }
  }`;

    const data = await sanityClient.fetch(query);
    return data;
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
      inventory
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
export const getCollectionBySlug = async (slug: string): Promise<Collection | null> => {
    const query = `*[_type == "collection" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug,
    mainImage,
    description,
    featured,
    lookbookImages,
    "products": products[]-> {
      _id,
      name,
      "slug": slug,
      mainImage,
      price,
      compareAtPrice,
      new,
      inStock
    }
  }`;

    const data = await sanityClient.fetch(query, { slug });
    return data;
};