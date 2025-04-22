import { useCallback } from 'react';
import { useIonRouter } from '@ionic/react';
import { useAnimation, AnimationType } from '../animations/AnimationContext';

/**
 * Custom hook for animated navigation between pages
 *
 * @param defaultAnimation - Default animation type to use
 * @returns Navigation methods
 */
export const useAnimatedNavigation = (defaultAnimation: AnimationType = 'retro-fade') => {
    const { setCurrentAnimation, triggerAnimation } = useAnimation();
    const router = useIonRouter();

    /**
     * Navigate to a new page with animation
     *
     * @param path - Target path
     * @param animation - Animation type (optional, uses default if not provided)
     * @param options - Additional navigation options
     */
    const navigate = useCallback((
        path: string,
        animation?: AnimationType,
        options?: {
            animationDuration?: number
        }
    ) => {
        // Set the animation
        setCurrentAnimation(animation || defaultAnimation);

        // Trigger the animation
        triggerAnimation();

        // Short delay to ensure animation starts
        const { animationDuration = 50 } = options || {};

        setTimeout(() => {
            // Navigate using appropriate method
            router.push(path);
        }, animationDuration);
    }, [setCurrentAnimation, triggerAnimation, defaultAnimation, router]);

    /**
     * Go back with animation
     *
     * @param animation - Animation type (optional, uses default if not provided)
     * @param fallbackPath - Fallback path if can't go back
     */
    const goBack = useCallback((
        animation?: AnimationType,
        fallbackPath?: string
    ) => {
        // Set the animation
        setCurrentAnimation(animation || defaultAnimation);

        // Trigger the animation
        triggerAnimation();

        setTimeout(() => {
            // Check if we can go back
            if (router.canGoBack()) {
                router.goBack();
            } else if (fallbackPath) {
                router.push(fallbackPath);
            }
        }, 50);
    }, [setCurrentAnimation, triggerAnimation, defaultAnimation, router]);

    return {
        navigate,
        goBack
    };
};

export default useAnimatedNavigation;