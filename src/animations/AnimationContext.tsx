// src/animations/AnimationContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useIonRouter, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react';

// Animation types we'll support
export type AnimationType = 'retro-fade' | 'pixel-slide' | 'glitch' | 'crt-off' | 'none';

interface AnimationContextProps {
    currentAnimation: AnimationType;
    isAnimating: boolean;
    setCurrentAnimation: (animation: AnimationType) => void;
    triggerAnimation: () => void;
    completeAnimation: () => void;
}

const AnimationContext = createContext<AnimationContextProps>({
    currentAnimation: 'retro-fade',
    isAnimating: false,
    setCurrentAnimation: () => {},
    triggerAnimation: () => {},
    completeAnimation: () => {}
});

export const useAnimation = () => useContext(AnimationContext);

interface AnimationProviderProps {
    children: ReactNode;
    defaultAnimation?: AnimationType;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({
                                                                        children,
                                                                        defaultAnimation = 'retro-fade'
                                                                    }) => {
    const [currentAnimation, setCurrentAnimation] = useState<AnimationType>(defaultAnimation);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const triggerAnimation = () => {
        setIsAnimating(true);
    };

    const completeAnimation = () => {
        setIsAnimating(false);
    };

    return (
        <AnimationContext.Provider
            value={{
                currentAnimation,
                isAnimating,
                setCurrentAnimation,
                triggerAnimation,
                completeAnimation
            }}
        >
            {children}
        </AnimationContext.Provider>
    );
};

// Hook for page transitions
export const usePageTransition = (animation?: AnimationType) => {
    const { currentAnimation, triggerAnimation, completeAnimation, setCurrentAnimation } = useAnimation();
    const router = useIonRouter();

    useEffect(() => {
        if (animation) {
            setCurrentAnimation(animation);
        }
    }, [animation, setCurrentAnimation]);

    useIonViewWillEnter(() => {
        completeAnimation();
    });

    useIonViewWillLeave(() => {
        triggerAnimation();
    });

    const navigate = (path: string, animation?: AnimationType) => {
        if (animation) {
            setCurrentAnimation(animation);
        }
        triggerAnimation();

        // Allow the animation to start before navigation
        setTimeout(() => {
            router.push(path);
        }, 50); // Small delay to ensure animation starts
    };

    return {
        navigate,
        isAnimating: false // This will be updated from the context
    };
};