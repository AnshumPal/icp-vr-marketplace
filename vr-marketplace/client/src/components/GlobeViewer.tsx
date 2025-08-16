import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import './GlobeViewer.css';

interface GlobeViewerProps {
  modelUrl: string;
  backgroundUrl: string;
}

const GlobeViewer: React.FC<GlobeViewerProps> = ({ modelUrl, backgroundUrl }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode || mountNode.clientWidth === 0) return;

    // 1. SCENE & CAMERA (Adapted from your script.js)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000);
    camera.position.set(-5, 3, 5);

    // 2. RENDERER (Adapted for the component)
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountNode.appendChild(renderer.domElement);

    // 3. CONTROLS (Adapted for the component)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 2;
    controls.maxDistance = 50;
    controls.target.set(0, 0, 0);

    // 4. HDRI LIGHTING
    new RGBELoader().load(backgroundUrl, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });

    // 5. KEY LIGHT & SHADOWS
    const sunLight = new THREE.DirectionalLight(0xffffff, 3.0);
    sunLight.position.set(10, 5, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    scene.add(sunLight);

    // 6. MODEL LOADER with CENTERING & SHADOWS
    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(model);
    });

    // 7. POST-PROCESSING (BLOOM)
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(mountNode.clientWidth, mountNode.clientHeight),
      0.4, // strength
      0,   // radius
      0.85 // threshold
    );
    const outputPass = new OutputPass();
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);
    
    // 8. ANIMATION LOOP
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      composer.render();
    };
    animate();

    // 9. RESIZE OBSERVER
    const resizeObserver = new ResizeObserver(() => {
        if (!mountNode || mountNode.clientWidth === 0) return;
        const width = mountNode.clientWidth;
        const height = mountNode.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        composer.setSize(width, height);
    });
    resizeObserver.observe(mountNode);

    // 10. CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.unobserve(mountNode);
      if (renderer.domElement) {
        mountNode.removeChild(renderer.domElement);
      }
      // You can also dispose of geometries, materials, etc. here for larger apps
    };
  }, [modelUrl, backgroundUrl]);

  return <div className="globe-container" ref={mountRef} />;
};

export default GlobeViewer;