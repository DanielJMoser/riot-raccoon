import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

// Catppuccin Mocha theme colors
const CATPPUCCIN_MOCHA = {
    mauve: 0xcba6f7,
    pink: 0xf5c2e7,
    blue: 0x89b4fa,
    base: 0x1e1e2e,
    text: 0xcdd6f4,
};

// SVG logo data (from original component)
const LOGO_SVG = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <g id="Inner_Circle">
    <circle fill="#FFFFFF" cx="256" cy="256" r="191"/>
  </g>
  <g id="Flags">
    <path fill="#000000" d="M125.667,122.917c0,0,28,33.083,89.25,34.333c61.251,1.25,95.917-37.917,130.917-33.333s63,43.333,77.75,50.167L333,425.75c0,0-1.833,1.334-11,4.667s-11.333,4.333-11.333,4.333l40.25-122.917c0,0-38.75-32.687-73.75-35c-35.001-2.313-50.917,23.75-110.083,13.75C107.917,280.583,69.5,243.5,69.5,243.5s-1.415-21.067,14.5-59.833C99.914,144.902,125.667,122.917,125.667,122.917z"/>
    <path fill="#FF0000" d="M69.917,251.25c0,0,41.084,38.416,102.417,46.083c61.332,7.667,67.039-14.491,100.916-14.25c21.548,0.153,29.334,9.584,29.334,9.584l-53.506,149.67c0,0-4.18-0.044-10.092-0.692c-5.911-0.648-9.541-1.294-9.541-1.294L257,357.5c0,0-13.584-8.707-27.25-10.5c-13.668-1.793-21.042,3-46.5,2.5c-24.073-0.473-71.25-12.75-93.333-45.75S69.917,251.25,69.917,251.25z"/>
  </g>
</svg>`;

// Create materials with Catppuccin colors
const createCoinMaterials = () => {
    const whiteMaterial = new THREE.MeshStandardMaterial({
        color: CATPPUCCIN_MOCHA.text,
        metalness: 0.2,
        roughness: 0.3,
        emissive: CATPPUCCIN_MOCHA.text,
        emissiveIntensity: 0.05
    });

    const blackMaterial = new THREE.MeshStandardMaterial({
        color: CATPPUCCIN_MOCHA.base,
        metalness: 0.8,
        roughness: 0.2,
        emissive: CATPPUCCIN_MOCHA.mauve,
        emissiveIntensity: 0.1
    });

    const redMaterial = new THREE.MeshStandardMaterial({
        color: CATPPUCCIN_MOCHA.pink,
        metalness: 0.6,
        roughness: 0.2,
        emissive: CATPPUCCIN_MOCHA.pink,
        emissiveIntensity: 0.15
    });

    return { whiteMaterial, blackMaterial, redMaterial };
};

interface AsciiCoinProps {
    maxRotationDegrees?: number;
    containerClassName?: string;
    width?: number;
    height?: number;
}

const AsciiCoin: React.FC<AsciiCoinProps> = ({
                                                 maxRotationDegrees = 20,
                                                 containerClassName = "ascii-coin-container",
                                                 width = 400,
                                                 height = 400
                                             }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const asciiEffectRef = useRef<AsciiEffect | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const coinGroupRef = useRef<THREE.Group | null>(null);
    const initialRotationRef = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0));
    const maxRotationRadians = (maxRotationDegrees * Math.PI) / 180;
    const isUserInteractingRef = useRef<boolean>(false);
    const springBackRef = useRef<{
        isAnimating: boolean;
        startPolar: number;
        startAzimuth: number;
        targetPolar: number;
        targetAzimuth: number;
        startTime: number;
        duration: number;
    } | null>(null);

    // Create coin from SVG data
    const createCoinFromSVG = async (scene: THREE.Scene): Promise<void> => {
        try {
            const { whiteMaterial, blackMaterial, redMaterial } = createCoinMaterials();

            // Create group to hold all coin parts
            const coinGroup = new THREE.Group();
            coinGroupRef.current = coinGroup;
            scene.add(coinGroup);

            // Load SVG
            const loader = new SVGLoader();
            const svgData = loader.parse(LOGO_SVG);

            // Create 3D geometry from SVG paths
            svgData.paths.forEach((path) => {
                const shapes = SVGLoader.createShapes(path);

                shapes.forEach((shape) => {
                    // Create extruded geometry for coin thickness
                    const geometry = new THREE.ExtrudeGeometry(shape, {
                        depth: 2, // Much flatter coin thickness
                        bevelEnabled: true,
                        bevelThickness: 0.3, // Reduced bevel thickness
                        bevelSize: 0.2, // Reduced bevel size
                        bevelOffset: 0,
                        bevelSegments: 2 // Fewer segments for less rounded appearance
                    });

                    // Select material based on SVG fill color
                    let material;
                    const pathColor = path.color.getHex();

                    if (pathColor === 0xff0000) {
                        material = redMaterial;
                    } else if (pathColor === 0x000000) {
                        material = blackMaterial;
                    } else {
                        material = whiteMaterial; // Default for white and unknown colors
                    }

                    // Create mesh
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;

                    coinGroup.add(mesh);
                });
            });

            // Center and scale the coin
            const box = new THREE.Box3().setFromObject(coinGroup);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            // Move to origin first
            coinGroup.position.set(-center.x, -center.y, -center.z);

            // Scale to much larger size for ASCII visibility
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetSize = 120; // Much larger for ASCII visibility
            if (maxDim > 0) {
                const scale = targetSize / maxDim;
                coinGroup.scale.setScalar(scale);
            }

            // Ensure coin is at exact origin after scaling
            coinGroup.updateMatrixWorld(true);
            const finalBox = new THREE.Box3().setFromObject(coinGroup);
            const finalCenter = finalBox.getCenter(new THREE.Vector3());
            coinGroup.position.sub(finalCenter);

            // Set initial rotation (face forward)
            coinGroup.rotation.set(0, 0, 0);

            console.log("Coin created successfully", {
                meshCount: coinGroup.children.length,
                boundingBox: box,
                scale: coinGroup.scale,
                position: coinGroup.position
            });
        } catch (err) {
            console.error("Error creating coin:", err);
            throw new Error("Failed to create 3D coin");
        }
    };

    // Setup interaction listeners for spring-back animation
    const setupInteractionListeners = (controls: OrbitControls): void => {
        if (!controls.domElement) return;

        const startInteraction = (): void => {
            isUserInteractingRef.current = true;
            springBackRef.current = null; // Cancel any ongoing spring-back
        };

        const endInteraction = (): void => {
            isUserInteractingRef.current = false;
            // Start spring-back animation after a short delay
            setTimeout(() => {
                if (!isUserInteractingRef.current && controlsRef.current) {
                    startSpringBackAnimation();
                }
            }, 150); // Small delay to avoid immediate spring-back
        };

        // Listen for interaction events
        controls.domElement.addEventListener('mousedown', startInteraction);
        controls.domElement.addEventListener('mouseup', endInteraction);
        controls.domElement.addEventListener('touchstart', startInteraction);
        controls.domElement.addEventListener('touchend', endInteraction);

        // Also listen for when mouse leaves the element
        controls.domElement.addEventListener('mouseleave', endInteraction);
    };

    // Start spring-back animation to return to original position
    const startSpringBackAnimation = (): void => {
        if (!controlsRef.current) return;

        const controls = controlsRef.current;
        const currentPolar = controls.getPolarAngle();
        const currentAzimuth = controls.getAzimuthalAngle();

        // Target is the center position (original rotation)
        const targetPolar = Math.PI / 2; // 90 degrees - front facing
        const targetAzimuth = 0; // 0 degrees - centered

        // Only animate if we're not already at target
        const polarDiff = Math.abs(currentPolar - targetPolar);
        const azimuthDiff = Math.abs(currentAzimuth - targetAzimuth);

        if (polarDiff < 0.01 && azimuthDiff < 0.01) {
            return; // Already at target
        }

        springBackRef.current = {
            isAnimating: true,
            startPolar: currentPolar,
            startAzimuth: currentAzimuth,
            targetPolar,
            targetAzimuth,
            startTime: performance.now(),
            duration: 800 // 800ms for smooth spring-back
        };

        console.log("Spring-back animation started");
    };

    // Easing function for spring-like animation
    const easeOutElastic = (t: number): number => {
        const p = 0.3;
        return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    };

    // Update spring-back animation
    const updateSpringBackAnimation = (): void => {
        if (!springBackRef.current || !controlsRef.current) return;

        const spring = springBackRef.current;
        const controls = controlsRef.current;
        const elapsed = performance.now() - spring.startTime;
        const progress = Math.min(elapsed / spring.duration, 1);

        if (progress >= 1) {
            // Animation complete
            controls.object.position.setFromSphericalCoords(
                controls.getDistance(),
                spring.targetPolar,
                spring.targetAzimuth
            );
            controls.update();
            springBackRef.current = null;
            console.log("Spring-back animation completed");
            return;
        }

        // Apply easing
        const easedProgress = easeOutElastic(progress);

        // Interpolate angles
        const currentPolar = spring.startPolar + (spring.targetPolar - spring.startPolar) * easedProgress;
        const currentAzimuth = spring.startAzimuth + (spring.targetAzimuth - spring.startAzimuth) * easedProgress;

        // Update camera position
        controls.object.position.setFromSphericalCoords(
            controls.getDistance(),
            currentPolar,
            currentAzimuth
        );
        controls.update();
    };

    // Setup camera controls with rotation limits
    const setupControls = (camera: THREE.PerspectiveCamera, asciiEffect: AsciiEffect): void => {
        const controls = new OrbitControls(camera, asciiEffect.domElement);

        // Configure control limitations
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = false;

        // Disable zoom and pan
        controls.enableZoom = false;
        controls.enablePan = false;

        // Set rotation limits
        controls.minPolarAngle = Math.PI / 2 - maxRotationRadians;
        controls.maxPolarAngle = Math.PI / 2 + maxRotationRadians;
        controls.minAzimuthAngle = -maxRotationRadians;
        controls.maxAzimuthAngle = maxRotationRadians;

        // Store initial camera position
        controls.target.set(0, 0, 0);
        controls.update();

        controlsRef.current = controls;
        console.log(`Controls set up with ${maxRotationDegrees}° rotation limit`);

        // Add interaction event listeners for spring-back behavior
        setupInteractionListeners(controls);
    };

    // Render loop
    const startRenderLoop = (scene: THREE.Scene, camera: THREE.PerspectiveCamera, asciiEffect: AsciiEffect): void => {
        const animate = (): void => {
            animationFrameRef.current = requestAnimationFrame(animate);

            // Update spring-back animation if active
            if (springBackRef.current && !isUserInteractingRef.current) {
                updateSpringBackAnimation();
            }

            // Update controls
            if (controlsRef.current) {
                controlsRef.current.update();
            }

            // Render with ASCII effect
            asciiEffect.render(scene, camera);
        };

        animate();
        console.log("Render loop started");
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const initializeScene = async () => {
            try {
                console.log("Initializing AsciiCoin...");

                // Scene setup with transparent background
                const scene = new THREE.Scene();
                // No background color set - will be transparent
                sceneRef.current = scene;

                // Camera setup - positioned for optimal coin viewing
                const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
                camera.position.set(0, 0, 150); // Closer to the coin
                cameraRef.current = camera;

                // Renderer setup with alpha for transparency and willReadFrequently fix
                const renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true, // Enable transparency
                    preserveDrawingBuffer: false,
                    powerPreference: "default"
                });
                renderer.setSize(width, height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.setClearColor(0x000000, 0); // Transparent background
                rendererRef.current = renderer;

                // ASCII effect with transparency and Catppuccin styling
                const asciiEffect = new AsciiEffect(renderer, ' .:-+*=#%@', {
                    invert: false,
                    resolution: 0.15 // Much lower for bigger, more visible characters
                });
                asciiEffect.setSize(width, height);

                // Style the ASCII effect with Catppuccin colors
                const asciiElement = asciiEffect.domElement;
                asciiElement.style.color = '#f5c2e7'; // Pink for better visibility
                asciiElement.style.backgroundColor = 'transparent';
                asciiElement.style.fontSize = '12px'; // Much larger for visibility
                asciiElement.style.letterSpacing = '0px';
                asciiElement.style.lineHeight = '10px'; // Slightly condensed
                asciiElement.style.fontFamily = 'monospace';
                asciiElement.style.fontWeight = 'bold'; // Bold for better visibility
                asciiElement.style.width = '100%';
                asciiElement.style.height = '100%';
                asciiElement.style.textShadow = '0 0 3px #f5c2e7'; // Glow effect

                // Fix Canvas2D willReadFrequently warning
                const canvas = asciiElement.querySelector('canvas');
                if (canvas) {
                    const context = canvas.getContext('2d', { willReadFrequently: true });
                }

                asciiEffectRef.current = asciiEffect;

                // Add ASCII effect to container
                if (containerRef.current && containerRef.current.childElementCount === 0) {
                    containerRef.current.appendChild(asciiEffect.domElement);
                }

                // Basic lighting setup - enhanced for visibility
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Brighter ambient
                scene.add(ambientLight);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Much brighter
                directionalLight.position.set(0, 50, 100);
                scene.add(directionalLight);

                // Add additional front light for ASCII visibility
                const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
                frontLight.position.set(0, 0, 50);
                scene.add(frontLight);

                // Create the 3D coin from SVG
                await createCoinFromSVG(scene);

                // Set up controls with rotation limits
                setupControls(camera, asciiEffect);

                // Start render loop
                startRenderLoop(scene, camera, asciiEffect);

                setLoading(false);
                console.log("Scene initialization complete");

            } catch (err) {
                console.error("Error initializing AsciiCoin:", err);
                setError("Failed to initialize 3D scene");
                setLoading(false);
            }
        };

        initializeScene();

        // Handle window resize
        const handleResize = (): void => {
            if (!containerRef.current || !rendererRef.current || !asciiEffectRef.current || !cameraRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const newWidth = rect.width || width;
            const newHeight = rect.height || height;

            // Update camera
            cameraRef.current.aspect = newWidth / newHeight;
            cameraRef.current.updateProjectionMatrix();

            // Update renderer and ASCII effect
            rendererRef.current.setSize(newWidth, newHeight);
            asciiEffectRef.current.setSize(newWidth, newHeight);
        };

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Initial resize check
        setTimeout(handleResize, 100);

        // Cleanup function
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            // Remove resize listener
            window.removeEventListener('resize', handleResize);

            if (containerRef.current && asciiEffectRef.current) {
                const asciiElement = asciiEffectRef.current.domElement;
                if (containerRef.current.contains(asciiElement)) {
                    containerRef.current.removeChild(asciiElement);
                }
            }

            // Dispose Three.js resources
            if (sceneRef.current) {
                sceneRef.current.traverse((object) => {
                    if (object instanceof THREE.Mesh) {
                        if (object.geometry) object.geometry.dispose();
                        if (object.material) {
                            if (Array.isArray(object.material)) {
                                object.material.forEach(material => material.dispose());
                            } else {
                                object.material.dispose();
                            }
                        }
                    }
                });
            }

            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
            if (controlsRef.current) {
                controlsRef.current.dispose();
            }
        };
    }, [width, height, maxRotationDegrees]);

    if (error) {
        return (
            <div
                className={containerClassName}
                style={{
                    width,
                    height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f38ba8' // Catppuccin red for errors
                }}
            >
                Error: {error}
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={containerClassName}
            style={{
                width: '100%',
                maxWidth: `${width}px`,
                height: `${height}px`,
                minHeight: '300px', // Increased minimum height
                position: 'relative',
                overflow: 'hidden',
                fontFamily: 'monospace',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                margin: '2rem auto', // Added margin for spacing
                padding: '2rem', // Added padding
                cursor: 'grab', // Indicate interactivity
            }}
            onMouseDown={(e) => {
                if (e.currentTarget.style.cursor === 'grab') {
                    e.currentTarget.style.cursor = 'grabbing';
                }
            }}
            onMouseUp={(e) => {
                e.currentTarget.style.cursor = 'grab';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.cursor = 'grab';
            }}
        >
            {loading && (
                <div style={{
                    color: '#cba6f7',
                    position: 'absolute',
                    zIndex: 10,
                    fontSize: '14px',
                    fontFamily: 'monospace'
                }}>
                    Loading coin...
                </div>
            )}
        </div>
    );
};

export default AsciiCoin;