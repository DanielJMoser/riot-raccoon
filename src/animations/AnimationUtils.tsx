// src/animations/AnimationUtils.tsx
import React, { ReactNode, useRef, useEffect, useState } from 'react';
import './AnimationUtils.scss';

type AnimationEffect =
    | 'fade-in'
    | 'slide-up'
    | 'slide-down'
    | 'slide-left'
    | 'slide-right'
    | 'zoom-in'
    | 'zoom-out'
    | 'glitch'
    | 'pixelate'
    | 'crt-in';

interface AnimatedElementProps {
    children: ReactNode;
    animation: AnimationEffect;
    delay?: number;
    duration?: number;
    threshold?: number; // Intersection observer threshold
    once?: boolean; // Only animate once
    className?: string;
}

// Component for animating individual elements
export const AnimatedElement: React.FC<AnimatedElementProps> = ({
                                                                    children,
                                                                    animation,
                                                                    delay = 0,
                                                                    duration = 500,
                                                                    threshold = 0.1,
                                                                    once = true,
                                                                    className = '',
                                                                }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) {
                        observer.unobserve(entry.target);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold }
        );

        const currentElement = elementRef.current;

        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [once, threshold]);

    // Construct animation class name
    const animationClass = `animation-${animation} ${isVisible ? 'visible' : ''}`;

    return (
        <div
            ref={elementRef}
            className={`animated-element ${animationClass} ${className}`}
            style={{
                '--animation-delay': `${delay}ms`,
                '--animation-duration': `${duration}ms`,
            } as React.CSSProperties}
        >
            {children}
        </div>
    );
};

// Component for staggered animations on child elements
interface StaggeredAnimationProps {
    children: ReactNode[];
    baseAnimation: AnimationEffect;
    baseDelay?: number;
    staggerDelay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
    className?: string;
}

export const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
                                                                          children,
                                                                          baseAnimation,
                                                                          baseDelay = 0,
                                                                          staggerDelay = 100,
                                                                          duration = 500,
                                                                          threshold = 0.1,
                                                                          once = true,
                                                                          className = '',
                                                                      }) => {
    return (
        <div className={`staggered-container ${className}`}>
            {React.Children.map(children, (child, index) => (
                <AnimatedElement
                    animation={baseAnimation}
                    delay={baseDelay + index * staggerDelay}
                    duration={duration}
                    threshold={threshold}
                    once={once}
                >
                    {child}
                </AnimatedElement>
            ))}
        </div>
    );
};

// Text glitch effect component
interface GlitchTextProps {
    text: string;
    color?: string;
    glitchColor1?: string;
    glitchColor2?: string;
    className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
                                                          text,
                                                          color = '#cdd6f4', // Default text color from Catppuccin Mocha
                                                          glitchColor1 = '#f5c2e7', // Pink
                                                          glitchColor2 = '#89b4fa', // Blue
                                                          className = '',
                                                      }) => {
    return (
        <div
            className={`glitch-text ${className}`}
            style={{
                '--text-color': color,
                '--glitch-color-1': glitchColor1,
                '--glitch-color-2': glitchColor2,
            } as React.CSSProperties}
        >
            <div className="glitch-text-item">{text}</div>
            <div className="glitch-text-item">{text}</div>
            <div className="glitch-text-item">{text}</div>
        </div>
    );
};

// CRT screen component for retro computer/terminal look
interface CRTScreenProps {
    children: ReactNode;
    scanlines?: boolean;
    flicker?: boolean;
    rounded?: boolean;
    glow?: boolean;
    className?: string;
}

export const CRTScreen: React.FC<CRTScreenProps> = ({
                                                        children,
                                                        scanlines = true,
                                                        flicker = true,
                                                        rounded = true,
                                                        glow = true,
                                                        className = '',
                                                    }) => {
    const crtClasses = [
        'crt-screen',
        scanlines ? 'with-scanlines' : '',
        flicker ? 'with-flicker' : '',
        rounded ? 'rounded' : '',
        glow ? 'with-glow' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={crtClasses}>
            <div className="crt-content">{children}</div>
            {scanlines && <div className="crt-scanlines"></div>}
            {flicker && <div className="crt-flicker"></div>}
        </div>
    );
};

// Hook to animate components on mount
export const useAnimateOnMount = (
    animation: AnimationEffect = 'fade-in',
    duration: number = 500,
    delay: number = 0
) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return {
        className: `animation-${animation} ${isVisible ? 'visible' : ''}`,
        style: {
            '--animation-duration': `${duration}ms`,
        } as React.CSSProperties,
    };
};