import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const client = sanityClient({
    projectId: 'l6v56id4',
    dataset: 'production',        // or your chosen dataset name
    apiVersion: '2023-03-01',     // use the latest API version
    token: 'sklK22Xj5wMVdyxTb1OUUM1XcPoDtOnuisIvQWmZVj3buBZvo1KBNkQPMrvctVW5cza5GdjcYMNhQFsKkjFaQ2OE9lVvdlsGt9xMjabAcAivZi6ffoW77Q85ncK83zBROsT6ebBFdYRNeb7zRa8pQZYFnsY5vb8mJY7RwXxDJtOdtaDgFsf8',
    useCdn: false,                 // set to `false` for real-time data
});

// Set up a helper function for generating image URLs
const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => {
    return builder.image(source);
};

export default client;