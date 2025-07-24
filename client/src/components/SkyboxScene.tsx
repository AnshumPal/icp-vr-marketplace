import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SkyboxSceneProps {
  width?: number;
  height?: number;
}

export function SkyboxScene({ width = 800, height = 600 }: SkyboxSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create skybox with moving clouds
    const skyboxGeometry = new THREE.SphereGeometry(500, 32, 32);
    
    // Create cloud texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient background (sky)
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.7, '#98D8E8'); // Light blue
    gradient.addColorStop(1, '#F0F8FF'); // Alice blue
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);
    
    // Add moving clouds
    const drawClouds = (time: number) => {
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 512);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      
      // Cloud 1
      const cloud1X = (time * 0.02) % 1200 - 100;
      ctx.beginPath();
      ctx.arc(cloud1X, 150, 40, 0, Math.PI * 2);
      ctx.arc(cloud1X + 30, 140, 50, 0, Math.PI * 2);
      ctx.arc(cloud1X + 60, 150, 45, 0, Math.PI * 2);
      ctx.fill();
      
      // Cloud 2
      const cloud2X = (time * 0.015) % 1200 - 150;
      ctx.beginPath();
      ctx.arc(cloud2X, 250, 35, 0, Math.PI * 2);
      ctx.arc(cloud2X + 25, 240, 40, 0, Math.PI * 2);
      ctx.arc(cloud2X + 50, 250, 38, 0, Math.PI * 2);
      ctx.fill();
      
      // Cloud 3
      const cloud3X = (time * 0.025) % 1200 - 200;
      ctx.beginPath();
      ctx.arc(cloud3X, 100, 30, 0, Math.PI * 2);
      ctx.arc(cloud3X + 20, 95, 35, 0, Math.PI * 2);
      ctx.arc(cloud3X + 40, 100, 32, 0, Math.PI * 2);
      ctx.fill();
    };
    
    const skyboxTexture = new THREE.CanvasTexture(canvas);
    const skyboxMaterial = new THREE.MeshBasicMaterial({
      map: skyboxTexture,
      side: THREE.BackSide
    });
    
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);
    
    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    // Add directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.set(0, 0, 0);
    
    // Animation loop
    const animate = () => {
      const time = Date.now();
      
      // Update clouds
      drawClouds(time);
      skyboxTexture.needsUpdate = true;
      
      // Slowly rotate the skybox
      skybox.rotation.y += 0.0005;
      
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
      animationId: 0
    };

    // Handle resize
    const handleResize = () => {
      if (sceneRef.current) {
        sceneRef.current.camera.aspect = width / height;
        sceneRef.current.camera.updateProjectionMatrix();
        sceneRef.current.renderer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        mountRef.current?.removeChild(sceneRef.current.renderer.domElement);
        sceneRef.current.renderer.dispose();
      }
    };
  }, [width, height]);

  return <div ref={mountRef} className="w-full h-full" />;
}