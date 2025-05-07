// Create materials with proper colors for the logo
const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.4,
    emissive: 0xffffff,
    emissiveIntensity: 0.05
});

const blackMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x333333,
    emissiveIntensity: 0.1
});

const redMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    metalness: 0.6,
    roughness: 0.3,
    emissive: 0xff0000,
    emissiveIntensity: 0.15
});// src/components/AsciiAnimation.tsx
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

        // Camera setup - adjust for better view of this specific logo
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 400; // Move back further for this larger logo

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000); // Pure black

        // ASCII effect with improved settings for logo visibility
        const asciiEffect = new AsciiEffect(renderer, ' .:-+*=#%@', {
            invert: true,
            resolution: 0.4  // Higher resolution for more details
        });
        asciiEffect.setSize(width, height);
        asciiEffect.domElement.style.color = '#f5c2e7'; // Pink from your theme
        asciiEffect.domElement.style.backgroundColor = '#000000'; // Pure black background
        asciiEffect.domElement.style.fontSize = '5px'; // Smaller font size for more detail
        asciiEffect.domElement.style.letterSpacing = '0px';
        asciiEffect.domElement.style.lineHeight = '5px'; // 1:1 aspect ratio
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

        // Set up controls - adjust for this logo
        const controls = new OrbitControls(camera, asciiEffect.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = true;
        controls.minDistance = 200;
        controls.maxDistance = 600;

        // Minimal ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambient);

        // Strong directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(5, 5, 5);
        scene.add(mainLight);

        // Add colored rim lights
        const rimLight1 = new THREE.PointLight(COLORS.mauve, 0.8, 200);
        rimLight1.position.set(-50, 20, -30);
        scene.add(rimLight1);

        const rimLight2 = new THREE.PointLight(COLORS.blue, 0.8, 200);
        rimLight2.position.set(70, -30, -20);
        scene.add(rimLight2);

        // Add moving spotlight
        const spotLight = new THREE.SpotLight(COLORS.pink, 2);
        spotLight.position.set(0, 100, 100);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.2;
        spotLight.decay = 2;
        spotLight.distance = 500;
        scene.add(spotLight);

        // Group to hold all logo parts
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
                // Create extruded geometry for 3D effect
                const geometry = new THREE.ExtrudeGeometry(shape, {
                    depth: 10,
                    bevelEnabled: true,
                    bevelThickness: 2,
                    bevelSize: 1,
                    bevelOffset: 0,
                    bevelSegments: 3
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

                // Add to group
                logoGroup.add(mesh);
            });
        });

        // Center the logo
        let box = new THREE.Box3().setFromObject(logoGroup);
        let size = box.getSize(new THREE.Vector3());
        let center = box.getCenter(new THREE.Vector3());

        logoGroup.position.x = -center.x;
        logoGroup.position.y = -center.y;

        // Scale down if needed
        const maxDim = Math.max(size.x, size.y);
        if (maxDim > 100) {
            const scale = 100 / maxDim;
            logoGroup.scale.set(scale, scale, scale);
        }

        // Add particles
        const particles = new THREE.Group();
        scene.add(particles);

        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.5, 4, 4);
            const particleMaterial = new THREE.MeshStandardMaterial({
                color: i % 3 === 0 ? COLORS.mauve : i % 3 === 1 ? COLORS.pink : COLORS.blue,
                emissive: i % 3 === 0 ? COLORS.mauve : i % 3 === 1 ? COLORS.pink : COLORS.blue,
                emissiveIntensity: 0.5,
            });

            const particle = new THREE.Mesh(particleGeometry, particleMaterial);

            // Spread particles in a sphere around the center
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 2;
            const r = 50 + Math.random() * 50;

            particle.position.x = r * Math.sin(phi) * Math.cos(theta);
            particle.position.y = r * Math.sin(phi) * Math.sin(theta);
            particle.position.z = r * Math.cos(phi);

            // Store original position for animation
            particle.userData = {
                originalPosition: particle.position.clone(),
                speed: 0.005 + Math.random() * 0.01,
                amplitude: 0.2 + Math.random() * 0.8,
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

        // Mouse interaction
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();

        const handleMouseMove = (event: MouseEvent) => {
            if (!containerRef.current) return;

            // Calculate mouse position in normalized device coordinates
            const rect = containerRef.current.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;

            // Move spotlight based on mouse position
            spotLight.position.x = mouse.x * 50;
            spotLight.position.y = mouse.y * 50;

            // Slightly rotate the logo based on mouse position
            logoGroup.rotation.y = mouse.x * 0.2;
            logoGroup.rotation.x = mouse.y * 0.2;
        };

        const handleClick = () => {
            // Animate particles on click
            particles.children.forEach((particle) => {
                const p = particle as THREE.Mesh;
                p.userData.phase = Math.random() * Math.PI * 2;
                p.userData.amplitude = 1 + Math.random() * 1.5;
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

                // Animate particles
                particles.children.forEach((particle) => {
                    const p = particle as THREE.Mesh;
                    const data = p.userData;

                    // Orbit around original position
                    p.position.x = data.originalPosition.x + Math.sin(elapsedTime * data.speed + data.phase) * data.amplitude;
                    p.position.y = data.originalPosition.y + Math.cos(elapsedTime * data.speed + data.phase) * data.amplitude;
                    p.position.z = data.originalPosition.z + Math.sin(elapsedTime * data.speed * 0.5) * data.amplitude * 0.5;

                    // Gradually reduce amplitude over time to settle particles
                    if (data.amplitude > 0.3) {
                        data.amplitude *= 0.995;
                    }
                });

                // Update controls
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