// src/utils/imageUtils.ts
import { urlFor as sanityUrlFor } from '../../backend/services/sanityClient';

/**
 * Safely generates a URL for a Sanity image with specified width and height
 *
 * @param image Sanity image reference
 * @param width Desired width of the image
 * @param height Optional desired height of the image
 * @param fallback Optional fallback image URL if image is null/undefined
 * @returns URL string for the image or fallback
 */
export const getImageUrl = (
    image: any,
    width: number,
    height?: number,
    fallback: string = '/assets/placeholder.png'
): string => {
    if (!image) {
        return fallback;
    }

    try {
        let builder = sanityUrlFor(image).width(width);

        if (height) {
            builder = builder.height(height);
        }

        return builder.url();
    } catch (error) {
        console.error('Error generating image URL:', error);
        return fallback;
    }
};

/**
 * Gets a responsive image URL with appropriate size based on device
 *
 * @param image Sanity image reference
 * @param options Configuration options
 * @returns URL string for the responsive image
 */
export const getResponsiveImageUrl = (
    image: any,
    options: {
        mobile?: number;
        tablet?: number;
        desktop?: number;
        quality?: number;
        fallback?: string;
    } = {}
): string => {
    const {
        mobile = 400,
        tablet = 600,
        desktop = 800,
        quality = 75,
        fallback = '/assets/placeholder.png'
    } = options;

    if (!image) {
        return fallback;
    }

    try {
        // Determine image size based on viewport
        // This is simplified - in a real app, you'd use media queries or JS to detect viewport
        const width = window.innerWidth < 768 ? mobile :
            window.innerWidth < 1024 ? tablet : desktop;

        return sanityUrlFor(image)
            .width(width)
            .quality(quality)
            .url();
    } catch (error) {
        console.error('Error generating responsive image URL:', error);
        return fallback;
    }
};