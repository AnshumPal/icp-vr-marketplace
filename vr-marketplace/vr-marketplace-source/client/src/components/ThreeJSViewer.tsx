import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ThreeJSViewerProps {
  modelUrl?: string;
  className?: string;
}

export default function ThreeJSViewer({ modelUrl, className }: ThreeJSViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const initThreeJS = async () => {
      try {
        // Dynamically import Three.js to avoid SSR issues
        const THREE = await import('three');
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a1a);

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 2, 5);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x00d4ff, 1);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x8b5cf6, 0.8, 100);
        pointLight.position.set(-5, 5, 5);
        scene.add(pointLight);

        // Add a default object if no model URL is provided
        if (!modelUrl) {
          const geometry = new THREE.BoxGeometry(2, 2, 2);
          const material = new THREE.MeshStandardMaterial({ 
            color: 0x00d4ff,
            metalness: 0.7,
            roughness: 0.3,
            emissive: 0x001122
          });
          const cube = new THREE.Mesh(geometry, material);
          cube.castShadow = true;
          cube.receiveShadow = true;
          scene.add(cube);

          // Add wireframe overlay
          const wireframeGeometry = new THREE.EdgesGeometry(geometry);
          const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x8b5cf6 });
          const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
          cube.add(wireframe);
        }

        // Animation loop
        const animate = () => {
          animationIdRef.current = requestAnimationFrame(animate);
          controls.update();
          
          // Rotate the default cube
          if (!modelUrl && scene.children.length > 3) {
            const cube = scene.children[3];
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
          }
          
          renderer.render(scene, camera);
        };

        animate();

        // Store references
        sceneRef.current = scene;
        rendererRef.current = renderer;

        // Handle resize
        const handleResize = () => {
          if (!container) return;
          const newWidth = container.clientWidth;
          const newHeight = container.clientHeight;
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // Keyboard controls
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'r' || event.key === 'R') {
            camera.position.set(0, 2, 5);
            controls.reset();
          }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('keydown', handleKeyDown);
        };

      } catch (error) {
        console.error('Error initializing Three.js:', error);
      }
    };

    initThreeJS();

    return () => {
      // Cleanup
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [modelUrl]);

  return (
    <div 
      ref={containerRef} 
      className={cn("w-full h-full relative overflow-hidden", className)}
    >
      {!modelUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center text-gray-400 bg-black/50 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm opacity-75">
              <p>3D Preview Demo</p>
              <p className="text-xs mt-1">Use mouse to rotate • Scroll to zoom • Press R to reset</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
