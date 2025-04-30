// src/animations/RouteTransition.tsx
import React, { ReactNode } from 'react';
import { IonRouterOutlet } from '@ionic/react';
import { IonRouterOutletCustomEvent } from '@ionic/core';
import { AnimationProvider } from './AnimationContext';
import AnimationOverlay from './AnimationOverlay';

interface RouteTransitionProps {
    children: ReactNode;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
    // Setup animation provider with default animation
    return (
        <AnimationProvider defaultAnimation="retro-fade">
            {children}
            <AnimationOverlay />
        </AnimationProvider>
    );
};

// Component for wrapping IonRouterOutlet with animations
export const AnimatedRouterOutlet: React.FC = () => {
    return (
        <IonRouterOutlet animated={false} animation={undefined} />
    );
};

// Higher order component to apply animations to a page
export function withPageTransition<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options?: {
        animationClass?: string;
        animationDelay?: number;
    }
) {
    const { animationClass = 'pixelate-in', animationDelay = 300 } = options || {};

    // Return a new component with the animation applied
    // Using React.ComponentProps<typeof WrappedComponent> ensures type safety
    const WithPageTransition: React.FC<P> = (props) => {
        return (
            <div
                className={animationClass}
                style={{
                    animationDelay: `${animationDelay}ms`,
                    animationFillMode: 'backwards'
                }}
            >
                <WrappedComponent {...props as P} />
            </div>
        );
    };

    // Set display name for debugging
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    WithPageTransition.displayName = `withPageTransition(${displayName})`;

    return WithPageTransition;
}

export default RouteTransition;