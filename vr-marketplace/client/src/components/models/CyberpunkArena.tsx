
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Html } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
// import { Html } from '@react-three/drei';

type Props = {
  modelUrl?: string;
  showHelpers?: boolean;
};

function RotatingRing() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => (ref.current.rotation.z += delta * 0.15));
  return (
    <mesh ref={ref} position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[6.5, 0.18, 32, 200]} />
      <meshStandardMaterial
        metalness={0.9}
        roughness={0.2}
        emissive={[0.0, 0.7, 1]}
        emissiveIntensity={1.6}
      />
    </mesh>
  );
}

function NeonPillar({ x, z, height = 4 }: { x: number; z: number; height?: number }) {
  return (
    <group position={[x, height / 2 - 0.6, z]}>
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, height, 24]} />
        <meshStandardMaterial
          color="#06050a"
          metalness={2.6}
          roughness={0.35}
          emissive={[0.5, 0.05, 0.8]}
          emissiveIntensity={2.0}
        />
      </mesh>
      <mesh position={[0, height / 2 + 0.1, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial
          color="#07050f"
          emissive={[0.8, 0.1, 0.4]}
          emissiveIntensity={1.2}
          roughness={0.3}
          metalness={1.0}
        />
      </mesh>
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial metalness={0.2} roughness={0.4} color="#0b0f14" />
    </mesh>
  );
}
function HologramSign({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <Html position={position} center style={{ pointerEvents: 'none' }}>
      <div
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '26px',
          fontWeight: 700,
          letterSpacing: '2px',
          color: '#00f6ff',
          padding: '10px 18px',
          background: 'rgba(0, 20, 30, 0.35)',
          border: '1px solid rgba(0, 255, 255, 0.4)',
          boxShadow: '0 0 12px rgba(0,255,255,0.7), 0 0 32px rgba(0,255,255,0.3)',
          textShadow: '0 0 5px #00f6ff, 0 0 15px #00f6ff, 0 0 30px #00f6ff',
          borderRadius: '8px',
          backdropFilter: 'blur(4px)',
        }}
      >
        {text}
      </div>
    </Html>
  );
}
function ArenaModel({ modelUrl }: { modelUrl?: string }) {
  if (modelUrl) return <GLTFPlaceholder url={modelUrl} />;

  return (
    <group>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[3.3, 3.3, 0.36, 64]} />
        <meshStandardMaterial color="#050812" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 0.2, 64]} />
        <meshStandardMaterial
          emissive={[0.1, 0.6, 1]}
          emissiveIntensity={1.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <RotatingRing />
    </group>
  );
}

function GLTFPlaceholder({ url }: { url: string }) {
  const { scene } = useGLTF(url) as any;
  return <primitive object={scene} scale={1.0} position={[0, -0.6, 0]} />;
}

function ScoreboardDisk() {
  const ref = useRef<THREE.Group>(null!);
  const scores = ['TEAM A: 45', 'TEAM B: 38', 'ROUND 3', 'TIME: 02:15'];
  
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3; // rotation speed
    }
  });

  return (
    <group position={[0, 6, 0]} ref={ref}>

      {/* Score text positioned around edge */}
      {scores.map((text, i) => {
        const angle = (i / scores.length) * Math.PI * 2;
        const radius = 8.5;
        return (
          <Html
            key={i}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[0, -angle, 0]}
            style={{
              color: '#40c0ff',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '18px',
              textShadow: '0 0 8px rgba(0, 229, 255, 0.8)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}
          >
            {text}
          </Html>
        );
      })}
    </group>
  );
}


export default function CyberpunkArena({ modelUrl }: Props) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas style={{ width: '100%', height: '100%' }} shadows camera={{ position: [12, 6, 12], fov: 50 }}>
        <Suspense fallback={<Html center>Loading...</Html>}>
          <PerspectiveCamera makeDefault position={[10, 6, 10]} fov={50} />
          <Environment preset="city" />
          <ambientLight intensity={0.08} /> {/* darker ambience */}
          <directionalLight
            intensity={0.5}
            position={[-8, 6, -6]}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[0, 5, 0]} intensity={2.8} distance={12} decay={2} color={'#40c0ff'} />
          <pointLight position={[6, 3, -4]} intensity={2} distance={8} decay={2} color={'#a84d9a'} />
          <pointLight position={[-6, 3, 4]} intensity={2} distance={8} decay={2} color={'#7aff6b'} />

          <Floor />
          {[ -9, -5, -1, 3, 7 ].map((x, i) => (
            <NeonPillar key={i} x={x} z={-10} height={4 + (i % 2) * 1.2} />
          ))}
          {[ -9, -5, -1, 3, 7 ].map((x, i) => (
            <NeonPillar key={i + 10} x={x} z={10} height={4 + (i % 2) * 1.2} />
          ))}

          <ScoreboardDisk />
          <ArenaModel modelUrl={modelUrl} />

          <mesh position={[0, 1.6, 0]}>
            <sphereGeometry args={[18, 32, 32]} />
            <meshBasicMaterial transparent opacity={0.0} />
          </mesh>

          <HologramSign text="CYBERPUNK ARENA — SECTOR 9" position={[0, 3.8, -4.4]} />

          <OrbitControls enablePan enableZoom enableRotate />

          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.6} />
            <DepthOfField focusDistance={0.02} focalLength={0.8} bokehScale={2} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}