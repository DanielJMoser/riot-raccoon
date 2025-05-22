// src/components/AsciiAnimation.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

// Catppuccin Mocha theme colors
const COLORS = {
    mauve: 0xcba6f7,
    pink: 0xf5c2e7,
    blue: 0x89b4fa,
    base: 0x1e1e2e,
    text: 0xcdd6f4,
};

// SVG string for the logo
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

// Create materials with proper colors for the logo
const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.3,
    emissive: 0xffffff,
    emissiveIntensity: 0.08
});

const blackMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.9,
    roughness: 0.1,
    emissive: 0x222222,
    emissiveIntensity: 0.15
});

const redMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    metalness: 0.7,
    roughness: 0.2,
    emissive: 0xff0000,
    emissiveIntensity: 0.2
});

interface AsciiAnimationProps {
    containerClassName?: string;
}

const AsciiAnimation: React.FC<AsciiAnimationProps> = ({
                                                           containerClassName = "ascii-animation-container",
                                                       }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!containerRef.current) return;

        setLoading(true);
        console.log("Initializing ASCII animation...");

        // Ensure container has non-zero dimensions
        const updateDimensions = () => {
            if (!containerRef.current) return { width: 800, height: 600 };

            // Get container dimensions
            const width = containerRef.current.clientWidth || 800;
            const height = containerRef.current.clientHeight || 600;

            return { width, height };
        };

        // Initialize with current dimensions
        const { width, height } = updateDimensions();

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000); // Pure black background

        // Camera setup - positioned for optimal coin viewing
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 180); // Closer to logo for prominent front view

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000); // Pure black
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // ASCII effect with improved settings for logo visibility
        const asciiEffect = new AsciiEffect(renderer, ' .:-+*=#%@', {
            invert: true,
            resolution: 0.35  // Optimized resolution for coin details
        });
        asciiEffect.setSize(width, height);
        asciiEffect.domElement.style.color = '#f5c2e7'; // Pink from your theme
        asciiEffect.domElement.style.backgroundColor = '#000000'; // Pure black background
        asciiEffect.domElement.style.fontSize = '4px'; // Smaller font for more detail
        asciiEffect.domElement.style.letterSpacing = '0px';
        asciiEffect.domElement.style.lineHeight = '4px'; // 1:1 aspect ratio
        asciiEffect.domElement.style.fontFamily = 'monospace';

        // Wait a frame before adding to DOM
        setTimeout(() => {
            if (containerRef.current) {
                if (containerRef.current.childElementCount === 0) {
                    containerRef.current.appendChild(asciiEffect.domElement);
                }
                setLoading(false);
            }
        }, 100);

        // Set up controls - disabled auto-rotation for better control
        const controls = new OrbitControls(camera, asciiEffect.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = false; // Disabled for manual control
        controls.enableZoom = true;
        controls.minDistance = 120;
        controls.maxDistance = 400;
        controls.enablePan = false; // Disable panning to keep coin centered

        // Limit vertical rotation to prevent flipping
        controls.maxPolarAngle = Math.PI * 0.8;
        controls.minPolarAngle = Math.PI * 0.2;

        // Enhanced lighting setup for void effect
        const ambient = new THREE.AmbientLight(0x404040, 0.15); // Very dim ambient
        scene.add(ambient);

        // Main key light from front-top
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(0, 50, 100);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        scene.add(keyLight);

        // Rim light from behind to create depth
        const rimLight = new THREE.DirectionalLight(0x89b4fa, 0.6);
        rimLight.position.set(0, 0, -50);
        scene.add(rimLight);

        // Colored accent lights for atmosphere
        const accentLight1 = new THREE.PointLight(COLORS.mauve, 0.5, 200);
        accentLight1.position.set(-80, 40, 0);
        scene.add(accentLight1);

        const accentLight2 = new THREE.PointLight(COLORS.pink, 0.5, 200);
        accentLight2.position.set(80, -40, 0);
        scene.add(accentLight2);

        // Dynamic spotlight that follows mouse
        const spotLight = new THREE.SpotLight(COLORS.blue, 1.5);
        spotLight.position.set(0, 100, 80);
        spotLight.angle = Math.PI / 8;
        spotLight.penumbra = 0.3;
        spotLight.decay = 2;
        spotLight.distance = 300;
        spotLight.castShadow = true;
        scene.add(spotLight);

        // Group to hold all logo parts - this will be our coin
        const logoGroup = new THREE.Group();
        scene.add(logoGroup);

        // SVG loader
        const loader = new SVGLoader();

        // Load from SVG string
        const svgData = loader.parse(LOGO_SVG);

        // Create geometry from paths
        svgData.paths.forEach((path) => {
            const shapes = SVGLoader.createShapes(path);

            shapes.forEach((shape) => {
                // Create extruded geometry for 3D coin effect
                const geometry = new THREE.ExtrudeGeometry(shape, {
                    depth: 8, // Coin thickness
                    bevelEnabled: true,
                    bevelThickness: 1.5,
                    bevelSize: 1,
                    bevelOffset: 0,
                    bevelSegments: 5
                });

                // Select material based on fill color from SVG
                let material;
                if (path.color.getHex() === 0xff0000) {
                    material = redMaterial;
                } else if (path.color.getHex() === 0x000000) {
                    material = blackMaterial;
                } else if (path.color.getHex() === 0xffffff) {
                    material = whiteMaterial;
                } else {
                    // Default to white if color doesn't match
                    material = whiteMaterial;
                }

                // Create mesh
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // Add to group
                logoGroup.add(mesh);
            });
        });

        // Center the logo properly
        const box = new THREE.Box3().setFromObject(logoGroup);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Move logo to center at origin
        logoGroup.position.set(-center.x, -center.y, -center.z);

        // Scale to appropriate size
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 80) {
            const scale = 80 / maxDim;
            logoGroup.scale.setScalar(scale);
        }

        // Set initial rotation to face user directly
        logoGroup.rotation.set(0, 0, 0);

        // Add subtle floating particles for void atmosphere
        const particles = new THREE.Group();
        scene.add(particles);

        const particleCount = 50; // Reduced for less distraction
        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.3, 4, 4);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: i % 3 === 0 ? COLORS.mauve : i % 3 === 1 ? COLORS.pink : COLORS.blue,
                transparent: true,
                opacity: 0.3
            });

            const particle = new THREE.Mesh(particleGeometry, particleMaterial);

            // Spread particles in a distant sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 2;
            const r = 150 + Math.random() * 100;

            particle.position.x = r * Math.sin(phi) * Math.cos(theta);
            particle.position.y = r * Math.sin(phi) * Math.sin(theta);
            particle.position.z = r * Math.cos(phi);

            // Store original position for animation
            particle.userData = {
                originalPosition: particle.position.clone(),
                speed: 0.002 + Math.random() * 0.005,
                amplitude: 0.1 + Math.random() * 0.3,
                phase: Math.random() * Math.PI * 2,
            };

            particles.add(particle);
        }

        // Handle window resize
        const handleResize = () => {
            if (!containerRef.current) return;

            const { width, height } = updateDimensions();

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
            asciiEffect.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Improved mouse interaction for spotlight only
        const mouse = new THREE.Vector2();

        const handleMouseMove = (event: MouseEvent) => {
            if (!containerRef.current) return;

            // Calculate mouse position in normalized device coordinates
            const rect = containerRef.current.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;

            // Move spotlight based on mouse position for dynamic lighting
            spotLight.position.x = mouse.x * 60;
            spotLight.position.y = mouse.y * 60;
        };

        // Particle burst effect on click
        const handleClick = () => {
            particles.children.forEach((particle) => {
                const p = particle as THREE.Mesh;
                p.userData.phase = Math.random() * Math.PI * 2;
                p.userData.amplitude = 0.5 + Math.random() * 0.8;
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        containerRef.current.addEventListener('click', handleClick);

        // Animation loop
        const clock = new THREE.Clock();
        let animationFrameId: number;

        const animate = () => {
            try {
                animationFrameId = requestAnimationFrame(animate);

                const elapsedTime = clock.getElapsedTime();



                // Animate particles subtly
                particles.children.forEach((particle) => {
                    const p = particle as THREE.Mesh;
                    const data = p.userData;

                    // Gentle floating motion
                    p.position.x = data.originalPosition.x + Math.sin(elapsedTime * data.speed + data.phase) * data.amplitude;
                    p.position.y = data.originalPosition.y + Math.cos(elapsedTime * data.speed + data.phase) * data.amplitude;
                    p.position.z = data.originalPosition.z + Math.sin(elapsedTime * data.speed * 0.7) * data.amplitude * 0.5;

                    // Gradually settle particles
                    if (data.amplitude > 0.1) {
                        data.amplitude *= 0.998;
                    }
                });

                // Animate accent lights for atmospheric effect
                accentLight1.intensity = 0.5 + Math.sin(elapsedTime * 0.7) * 0.2;
                accentLight2.intensity = 0.5 + Math.cos(elapsedTime * 0.9) * 0.2;

                // Update controls (handles user rotation)
                controls.update();

                // Render
                asciiEffect.render(scene, camera);
            } catch (error) {
                console.error("Error in animation loop:", error);
                cancelAnimationFrame(animationFrameId);
            }
        };

        // Start animation after a short delay to ensure DOM is ready
        setTimeout(() => {
            animate();
            setLoading(false);
            console.log("Animation started");
        }, 500);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', handleMouseMove);

            if (containerRef.current) {
                if (containerRef.current.contains(asciiEffect.domElement)) {
                    containerRef.current.removeChild(asciiEffect.domElement);
                }
                containerRef.current.removeEventListener('click', handleClick);
            }

            // Dispose resources
            scene.traverse((object) => {
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

            renderer.dispose();
            if (controls) controls.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={containerClassName}
            style={{
                width: '100%',
                height: '60vh',
                minHeight: '400px',
                overflow: 'hidden',
                position: 'relative',
                fontFamily: 'monospace',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {loading && (
                <div style={{ color: '#f5c2e7' }}>Loading ASCII animation...</div>
            )}
        </div>
    );
};

export default AsciiAnimation;