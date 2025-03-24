import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const client = sanityClient({
    projectId: process.env.PROJECT_ID,
    dataset: 'production',        // or your chosen dataset name
    apiVersion: '2023-03-01',     // use the latest API version
    token: process.env.SANITY_API_TOKEN_RW,
    useCdn: false,                 // set to `false` for real-time data
});

// Set up a helper function for generating image URLs
const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => {
    return builder.image(source);
};

export default client;