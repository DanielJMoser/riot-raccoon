import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { getEnvironmentConfig } from '../../src/config/env';

const config = getEnvironmentConfig();

const client = sanityClient({
    projectId: config.VITE_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2023-03-01',
    token: config.VITE_SANITY_API_TOKEN,
    useCdn: false,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => builder.image(source);
export default client;
