// src/utils/animations.ts
// Centralized GSAP animation configuration for consistent vaporwave/cyberpunk aesthetic

/**
 * Timing Functions - Sharp, linear transitions for cyberpunk aesthetic
 * Avoid bouncy effects in favor of precise, mechanical movements
 */
export const CYBERPUNK_EASINGS = {
  // Sharp, instant transitions
  sharp: 'power4.inOut',
  
  // Linear mechanical movement
  linear: 'none',
  
  // Quick snap-in effect
  snapIn: 'power3.in',
  
  // Quick snap-out effect  
  snapOut: 'power3.out',
  
  // Subtle ease for smooth but controlled movement
  subtle: 'power2.inOut',
  
  // Digital glitch-like timing
  glitch: 'steps(12)',
  
  // Circuit-like precise timing
  circuit: 'power4.out',
  
  // Matrix-style digital rain
  matrix: 'power1.inOut',
  
  // Neon glow pulse
  pulse: 'sine.inOut'
} as const;

/**
 * Duration Constants - Consistent timing across the app
 */
export const ANIMATION_DURATIONS = {
  // Ultra fast - for micro-interactions
  instant: 0.15,
  
  // Fast - for UI state changes
  fast: 0.3,
  
  // Standard - for most transitions
  standard: 0.6,
  
  // Medium - for complex animations
  medium: 1.0,
  
  // Slow - for dramatic effects
  slow: 1.5,
  
  // Epic - for full page transitions
  epic: 2.0,
  
  // Ambient - for background effects
  ambient: 3.0
} as const;

/**
 * Animation Presets - Common animation combinations
 */
export const ANIMATION_PRESETS = {
  // UI Element Entrance
  uiEnter: {
    duration: ANIMATION_DURATIONS.fast,
    ease: CYBERPUNK_EASINGS.circuit
  },
  
  // UI Element Exit
  uiExit: {
    duration: ANIMATION_DURATIONS.fast,
    ease: CYBERPUNK_EASINGS.snapIn
  },
  
  // Page Transition In
  pageEnter: {
    duration: ANIMATION_DURATIONS.medium,
    ease: CYBERPUNK_EASINGS.sharp
  },
  
  // Page Transition Out
  pageExit: {
    duration: ANIMATION_DURATIONS.standard,
    ease: CYBERPUNK_EASINGS.sharp
  },
  
  // Product Card Hover
  cardHover: {
    duration: ANIMATION_DURATIONS.standard,
    ease: CYBERPUNK_EASINGS.circuit
  },
  
  // Button Press Effect
  buttonPress: {
    duration: ANIMATION_DURATIONS.instant,
    ease: CYBERPUNK_EASINGS.sharp
  },
  
  // Modal/Overlay Appearance  
  modalEnter: {
    duration: ANIMATION_DURATIONS.standard,
    ease: CYBERPUNK_EASINGS.circuit
  },
  
  // Glitch Effect
  glitch: {
    duration: ANIMATION_DURATIONS.instant,
    ease: CYBERPUNK_EASINGS.glitch
  },
  
  // Neon Glow Animation
  neonGlow: {
    duration: ANIMATION_DURATIONS.ambient,
    ease: CYBERPUNK_EASINGS.pulse
  },
  
  // Loading Animation
  loading: {
    duration: ANIMATION_DURATIONS.medium,
    ease: CYBERPUNK_EASINGS.linear
  },
  
  // Scroll-triggered Reveal
  scrollReveal: {
    duration: ANIMATION_DURATIONS.medium,
    ease: CYBERPUNK_EASINGS.circuit
  },
  
  // Text Typing Effect
  typewriter: {
    duration: ANIMATION_DURATIONS.slow,
    ease: CYBERPUNK_EASINGS.glitch
  }
} as const;

/**
 * Stagger Configurations - For sequential animations
 */
export const STAGGER_CONFIGS = {
  // Quick sequence
  fast: {
    amount: 0.1,
    ease: CYBERPUNK_EASINGS.circuit
  },
  
  // Standard sequence
  standard: {
    amount: 0.15,
    ease: CYBERPUNK_EASINGS.circuit
  },
  
  // Dramatic sequence
  dramatic: {
    amount: 0.3,
    ease: CYBERPUNK_EASINGS.sharp
  }
} as const;

/**
 * Transform Presets - Common transformation values
 */
export const TRANSFORM_PRESETS = {
  // Scale effects
  scaleHover: { scale: 1.05 },
  scalePress: { scale: 0.95 },
  scaleEnlarge: { scale: 1.1 },
  
  // Translation effects
  slideUp: { y: -20 },
  slideDown: { y: 20 },
  slideLeft: { x: -20 },
  slideRight: { x: 20 },
  
  // Rotation effects
  rotateSlightly: { rotation: 2 },
  rotateFull: { rotation: 360 },
  
  // Skew effects (for digital distortion)
  skewDigital: { skewX: 2, skewY: 1 },
  
  // 3D effects
  perspective: { rotationY: 10, transformPerspective: 1000 }
} as const;

/**
 * Color Animation Helpers
 */
export const COLOR_ANIMATIONS = {
  // Neon color cycle for vaporwave aesthetic
  neonCycle: [
    '#ff0080', // Hot pink
    '#00ff80', // Cyan
    '#8000ff', // Purple  
    '#ff8000', // Orange
    '#0080ff'  // Blue
  ],
  
  // Catppuccin theme colors for smooth transitions
  catppuccin: {
    primary: '#cba6f7',   // Mauve
    accent: '#f38ba8',    // Pink
    secondary: '#a6e3a1', // Green
    warning: '#f9e2af',   // Yellow
    danger: '#f38ba8',    // Pink
    surface: '#313244',   // Surface0
    background: '#1e1e2e' // Base
  }
} as const;

/**
 * Common Animation Utilities
 */
export const ANIMATION_UTILS = {
  /**
   * Create a consistent fade in animation
   */
  fadeIn: (_element: string | Element, delay: number = 0) => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: ANIMATION_DURATIONS.standard,
    ease: CYBERPUNK_EASINGS.circuit,
    delay
  }),
  
  /**
   * Create a slide up reveal animation
   */
  slideUpReveal: (_element: string | Element, delay: number = 0) => ({
    from: { y: 50, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: ANIMATION_DURATIONS.medium,
    ease: CYBERPUNK_EASINGS.circuit,
    delay
  }),
  
  /**
   * Create a scale entrance animation
   */
  scaleEntrance: (_element: string | Element, delay: number = 0) => ({
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    duration: ANIMATION_DURATIONS.standard,
    ease: CYBERPUNK_EASINGS.sharp,
    delay
  }),
  
  /**
   * Create a glitch effect animation
   */
  glitchEffect: (_element: string | Element) => [
    {
      duration: ANIMATION_DURATIONS.instant,
      x: -2,
      skewX: 2,
      ease: CYBERPUNK_EASINGS.glitch
    },
    {
      duration: ANIMATION_DURATIONS.instant,
      x: 2,
      skewX: -2,
      ease: CYBERPUNK_EASINGS.glitch,
      delay: ANIMATION_DURATIONS.instant
    },
    {
      duration: ANIMATION_DURATIONS.instant,
      x: 0,
      skewX: 0,
      ease: CYBERPUNK_EASINGS.sharp,
      delay: ANIMATION_DURATIONS.instant * 2
    }
  ],
  
  /**
   * Create a neon pulse animation
   */
  neonPulse: (_element: string | Element) => ({
    duration: ANIMATION_DURATIONS.ambient,
    repeat: -1,
    yoyo: true,
    ease: CYBERPUNK_EASINGS.pulse,
    filter: 'drop-shadow(0 0 20px currentColor)'
  })
} as const;

/**
 * Scroll-triggered Animation Settings
 */
export const SCROLL_TRIGGER_DEFAULTS = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse'
} as const;

/**
 * Mobile-specific Animation Adjustments
 */
export const MOBILE_ADJUSTMENTS = {
  // Reduce duration for mobile performance
  durationMultiplier: 0.7,
  
  // Simpler easing for mobile
  fallbackEasing: CYBERPUNK_EASINGS.subtle,
  
  // Reduced transform values for mobile
  transformScale: 0.8
} as const;

/**
 * Export everything as default for easy importing
 */
export default {
  easings: CYBERPUNK_EASINGS,
  durations: ANIMATION_DURATIONS,
  presets: ANIMATION_PRESETS,
  stagger: STAGGER_CONFIGS,
  transforms: TRANSFORM_PRESETS,
  colors: COLOR_ANIMATIONS,
  utils: ANIMATION_UTILS,
  scroll: SCROLL_TRIGGER_DEFAULTS,
  mobile: MOBILE_ADJUSTMENTS
};