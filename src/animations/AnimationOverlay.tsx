import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAnimation, AnimationType } from './AnimationContext';
import '../scss/animations/Animations.scss';

interface AnimationOverlayProps {
    duration?: number;
}

export const AnimationOverlay: React.FC<AnimationOverlayProps> = ({
                                                                      duration = 700
                                                                  }) => {
    const { currentAnimation, isAnimating, completeAnimation } = useAnimation();
    const [shouldRender, setShouldRender] = useState<boolean>(false);

    useEffect(() => {
        if (isAnimating) {
            setShouldRender(true);

            // Set a timeout to complete animation
            const timeout = setTimeout(() => {
                completeAnimation();
            }, duration);

            return () => clearTimeout(timeout);
        } else {
            // Add a small delay before unmounting to allow exit animations
            const timeout = setTimeout(() => {
                setShouldRender(false);
            }, 100);

            return () => clearTimeout(timeout);
        }
    }, [isAnimating, duration, completeAnimation]);

    // Don't render anything if we're not animating and element should not be in DOM
    if (!shouldRender) return null;

    // Create animation classes based on current animation type and state
    const animationClass = `animation-overlay animation-${currentAnimation} ${isAnimating ? 'animating' : 'completed'}`;

    // Render the overlay portal
    return createPortal(
        <div className={animationClass}>
            {currentAnimation === 'retro-fade' && <RetroFadeAnimation />}
            {currentAnimation === 'pixel-slide' && <PixelSlideAnimation />}
            {currentAnimation === 'glitch' && <GlitchAnimation />}
            {currentAnimation === 'crt-off' && <CRTOffAnimation />}
        </div>,
        document.body
    );
};

// Individual animation components
const RetroFadeAnimation: React.FC = () => {
    return (
        <div className="retro-fade-container">
            <div className="retro-fade-grid"></div>
        </div>
    );
};

const PixelSlideAnimation: React.FC = () => {
    return (
        <div className="pixel-slide-container">
            {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="pixel-row" style={{ animationDelay: `${index * 30}ms` }}></div>
            ))}
        </div>
    );
};

const GlitchAnimation: React.FC = () => {
    return (
        <div className="glitch-container">
            <div className="glitch-item"></div>
            <div className="glitch-scanlines"></div>
        </div>
    );
};

const CRTOffAnimation: React.FC = () => {
    return (
        <div className="crt-off-container">
            <div className="crt-line"></div>
        </div>
    );
};

export default AnimationOverlay;