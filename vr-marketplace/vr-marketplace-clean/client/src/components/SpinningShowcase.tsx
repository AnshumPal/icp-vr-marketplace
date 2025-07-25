import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SpinningShowcaseProps {
  width?: number;
  height?: number;
  item?: {
    title: string;
    imageUrl?: string;
  };
}

export function SpinningShowcase({ width = 400, height = 400, item }: SpinningShowcaseProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    animationId: number;
    podium: THREE.Group;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Create podium group
    const podiumGroup = new THREE.Group();

    // Base podium (cylinder)
    const baseGeometry = new THREE.CylinderGeometry(2, 2.2, 0.3, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x2a2a2a,
      shininess: 100,
      specular: 0x444444
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.15;
    base.castShadow = true;
    base.receiveShadow = true;
    podiumGroup.add(base);

    // Main podium platform
    const platformGeometry = new THREE.CylinderGeometry(1.8, 1.8, 0.2, 32);
    const platformMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x444444,
      shininess: 150,
      specular: 0x666666
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = 0.1;
    platform.castShadow = true;
    platform.receiveShadow = true;
    podiumGroup.add(platform);

    // Top surface (glossy)
    const topGeometry = new THREE.CylinderGeometry(1.7, 1.7, 0.05, 32);
    const topMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x666666,
      shininess: 200,
      specular: 0x888888
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 0.225;
    top.castShadow = true;
    top.receiveShadow = true;
    podiumGroup.add(top);

    // Holographic display area
    const displayGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.01, 32);
    const displayMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ffff,
      transparent: true,
      opacity: 0.3
    });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.y = 0.26;
    podiumGroup.add(display);

    // Floating item representation
    if (item) {
      // Create a floating cube or sphere to represent the item
      const itemGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const itemMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00aaff,
        transparent: true,
        opacity: 0.8,
        emissive: 0x001133
      });
      const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
      itemMesh.position.y = 1.5;
      itemMesh.castShadow = true;
      
      // Add text texture if item has title
      if (item.title) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        
        ctx.fillStyle = '#001133';
        ctx.fillRect(0, 0, 256, 256);
        
        ctx.fillStyle = '#00aaff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const words = item.title.split(' ');
        const lineHeight = 30;
        const startY = 128 - (words.length * lineHeight) / 2;
        
        words.forEach((word, index) => {
          ctx.fillText(word, 128, startY + index * lineHeight);
        });
        
        const textTexture = new THREE.CanvasTexture(canvas);
        itemMaterial.map = textTexture;
      }
      
      podiumGroup.add(itemMesh);
    }

    // Add neon ring lights around the podium
    const ringGeometry = new THREE.RingGeometry(2.1, 2.3, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    podiumGroup.add(ring);

    scene.add(podiumGroup);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Spotlight on the podium
    const spotlight = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 6, 0.1);
    spotlight.position.set(0, 8, 0);
    spotlight.target = podiumGroup;
    spotlight.castShadow = true;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    scene.add(spotlight);

    // Side lights for dramatic effect
    const sideLight1 = new THREE.DirectionalLight(0x00aaff, 0.3);
    sideLight1.position.set(5, 3, 5);
    scene.add(sideLight1);

    const sideLight2 = new THREE.DirectionalLight(0xaa00ff, 0.3);
    sideLight2.position.set(-5, 3, -5);
    scene.add(sideLight2);

    // Position camera
    camera.position.set(4, 3, 4);
    camera.lookAt(0, 0.5, 0);

    // Animation loop
    const animate = () => {
      // Rotate the entire podium
      podiumGroup.rotation.y += 0.01;
      
      // Float the item up and down if it exists
      if (item && podiumGroup.children.length > 4) {
        const itemMesh = podiumGroup.children[4];
        itemMesh.position.y = 1.5 + Math.sin(Date.now() * 0.002) * 0.2;
        itemMesh.rotation.x += 0.01;
        itemMesh.rotation.y += 0.015;
      }
      
      // Pulse the neon ring
      const ring = podiumGroup.children[3] as THREE.Mesh;
      if (ring && ring.material instanceof THREE.MeshBasicMaterial) {
        ring.material.opacity = 0.6 + Math.sin(Date.now() * 0.003) * 0.2;
      }
      
      renderer.render(scene, camera);
      const animationId = requestAnimationFrame(animate);
      
      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };
    
    animate();
    
    // Store scene references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      animationId: 0,
      podium: podiumGroup
    };

    return () => {
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        mountRef.current?.removeChild(sceneRef.current.renderer.domElement);
        sceneRef.current.renderer.dispose();
      }
    };
  }, [width, height, item]);

  return <div ref={mountRef} className="w-full h-full rounded-lg overflow-hidden" />;
}