// import { Canvas, useLoader, ThreeElements } from '@react-three/fiber';
// import { OrbitControls, Plane, Box,Text } from '@react-three/drei';
// import * as THREE from 'three';
// import React, { Suspense } from 'react';

// // ====================================================================
// // 1. ArtPiece Component
// // ====================================================================

// interface ArtPieceProps {
//   imagePath: string;
//   position: ThreeElements['group']['position'];
//   rotation: ThreeElements['group']['rotation'];
//   size: [number, number]; // [width, height]
//   frameColor: string;
// }

// const ArtPiece: React.FC<ArtPieceProps> = ({ 
//   imagePath, 
//   position, 
//   rotation, 
//   size, 
//   frameColor 
// }) => {
//   // Use suspense to handle texture loading
//   const texture = useLoader(THREE.TextureLoader, imagePath);
//   const [width, height] = size;
//   const frameThickness = 0.1;
//   const frameDepth = 0.05;

//   return (
//     <group position={position} rotation={rotation as any}>
//       {/* The Art Plane (the image itself) */}
//       <Plane args={[width, height]} receiveShadow>
//         <meshStandardMaterial map={texture} />
//       </Plane>

//       {/* The Frame (a thin box around the image) */}
//       <Box
//         args={[width + frameThickness, height + frameThickness, frameDepth]}
//         position={[0, 0, -(frameDepth / 2)]} // Positioned slightly behind the image plane
//         castShadow
//         receiveShadow
//       >
//         <meshStandardMaterial color={frameColor} />
//       </Box>
//     </group>
//   );
// };

// // ====================================================================
// // 2. GalleryRoom Component
// // ====================================================================

// const GalleryRoom: React.FC = () => {
//   const roomSize: [number, number, number] = [10, 5, 10]; // Width, Height, Depth

//   // Define materials
//   const wallMaterial = new THREE.MeshStandardMaterial({ 
//     color: '#ffffff', 
//     side: THREE.BackSide, // Important: Renders the *inside* of the box
//   });

//   const floorMaterial = new THREE.MeshStandardMaterial({ 
//     color: '#3d3d3d', // Darker floor for contrast
//     roughness: 0.8,
//     metalness: 0.1,
//   });

//   return (
//     <group>
//       {/* Floor */}
//       <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
//         <planeGeometry args={[roomSize[0], roomSize[2]]} />
//         <primitive object={floorMaterial} attach="material" />
//       </mesh>

//       {/* Walls (using a Box, with BackSide rendering the interior) */}
//       <mesh castShadow receiveShadow position={[0, roomSize[1] / 2, 0]}>
//         <boxGeometry args={roomSize} />
//         <primitive object={wallMaterial} attach="material" />
//       </mesh>
//     </group>
//   );
// };

// // ====================================================================
// // 3. Main ArtGallery Component
// // ====================================================================

// const ArtGallery: React.FC = () => {
//   // NOTE: Ensure your images (e.g., /art-texture-1.jpg, /art-texture-2.jpg) 
//   // are placed in your project's public folder.

//   return (
//     <div style={{ width: '100vw', height: '100vh' }}>
//       <Canvas 
//         shadows 
//         dpr={[1, 2]} 
//         // Set the camera's initial position
//         camera={{ position: [0, 2, 5], fov: 75 }}
//       >
//         <Suspense fallback={<Text color="black" anchorX="center" anchorY="middle">Loading...</Text>}>
//           {/* Lighting: Creates a soft, overall brightness */}
//           <ambientLight intensity={0.5} />
          
//           {/* Lighting: Spot light for dramatic effect and focusing on the art */}
//           <spotLight 
//             position={[5, 5, 5]} 
//             angle={0.3} 
//             penumbra={1} 
//             intensity={2} 
//             castShadow 
//             shadow-mapSize-width={2048}
//             shadow-mapSize-height={2048}
//           />
          
//           {/* Gallery Structure */}
//           <GalleryRoom />

//           {/* Art Piece 1: Left Wall */}
//           <ArtPiece 
//             imagePath="/3d-assets/art-pieces/art1.jpg"
//             position={[-4.95, 1.5, 0]} 
//             rotation={[0, Math.PI / 2, 0]} // Rotate 90 degrees around Y to face Z
//             size={[2.5, 3]}
//             frameColor="#4a4a4a"
//           />

//           {/* Art Piece 2: Back Wall */}
//           <ArtPiece 
//             imagePath="/3d-assets/art-pieces/art2.jpg"
//             position={[0, 1.5, -4.95]} 
//             rotation={[0, 0, 0]} 
//             size={[3.5, 2]}
//             frameColor="#8b4513"
//           />

//           {/* Art Piece 3: Right Wall */}
//           <ArtPiece 
//             imagePath="/3d-assets/art-pieces/art3.jpg"
//             position={[4.95, 2, 1.5]} 
//             rotation={[0, -Math.PI / 2, 0]} // Rotate -90 degrees around Y
//             size={[1.8, 1.8]}
//             frameColor="#000000"
//           />

//           {/* Controls: Allows user to move around the scene */}
//           <OrbitControls 
//             enableDamping 
//             dampingFactor={0.05} 
//             minPolarAngle={Math.PI / 4} // Prevent camera from going under the floor
//             maxPolarAngle={Math.PI / 2}
//           />
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// };

// export default ArtGallery;

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Plane, Box, Text } from '@react-three/drei';
import * as THREE from 'three';
import React, { Suspense, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';

// ===========================================================
// ArtPiece Component
// ===========================================================
interface ArtPieceProps {
  imagePath: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  frameColor: string;
}

const ArtPiece: React.FC<ArtPieceProps> = ({
  imagePath,
  position,
  rotation,
  size,
  frameColor,
}) => {
  // ✅ Correct way: useLoader suspends until the texture is ready
  const texture = useLoader(THREE.TextureLoader, imagePath);

  const [width, height] = size;
  const frameThickness = 0.1;
  const frameDepth = 0.05;
  const zOffset = 0.01;

  return (
    <group position={position} rotation={new THREE.Euler(...rotation)}>
      {/* Art Plane */}
      <Plane args={[width, height]} position={[0, 0, zOffset]}>
        <meshStandardMaterial map={texture} side={THREE.FrontSide} toneMapped={false} />
      </Plane>

      {/* Frame - Top */}
      <Box
        args={[width + frameThickness * 2, frameThickness, frameDepth]}
        position={[0, height / 2 + frameThickness / 2, frameDepth / 2 + zOffset]}
      >
        <meshStandardMaterial color={frameColor} />
      </Box>

      {/* Frame - Bottom */}
      <Box
        args={[width + frameThickness * 2, frameThickness, frameDepth]}
        position={[0, -height / 2 - frameThickness / 2, frameDepth / 2 + zOffset]}
      >
        <meshStandardMaterial color={frameColor} />
      </Box>

      {/* Frame - Left */}
      <Box
        args={[frameThickness, height, frameDepth]}
        position={[-width / 2 - frameThickness / 2, 0, frameDepth / 2 + zOffset]}
      >
        <meshStandardMaterial color={frameColor} />
      </Box>

      {/* Frame - Right */}
      <Box
        args={[frameThickness, height, frameDepth]}
        position={[width / 2 + frameThickness / 2, 0, frameDepth / 2 + zOffset]}
      >
        <meshStandardMaterial color={frameColor} />
      </Box>
    </group>
  );
};

// ===========================================================
// GalleryRoom Component
// ===========================================================
const GalleryRoom: React.FC = () => {
  const roomWidth = 15;
  const roomHeight = 6;
  const roomDepth = 20;

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    side: THREE.BackSide,
  });

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: '#f5f5f5',
    roughness: 0.9,
    metalness: 0.1,
  });

  const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: '#eaeaea',
    roughness: 1,
    metalness: 0,
  });

  const pillarMaterial = new THREE.MeshStandardMaterial({
    color: '#dcdcdc',
    roughness: 1,
    metalness: 0,
  });

  // Define pillar positions as explicit tuples to satisfy TypeScript
  const pillarPositions: [number, number, number][] = [
    [-5, 3, -7],
    [-5, 3, 7],
    [5, 3, -7],
    [5, 3, 7],
  ];

  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} frustumCulled={false}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]} frustumCulled={false}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <primitive object={ceilingMaterial} attach="material" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, roomHeight / 2, -roomDepth / 2]} frustumCulled={false}>
        <boxGeometry args={[roomWidth, roomHeight, 0.2]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh position={[0, roomHeight / 2, roomDepth / 2]} frustumCulled={false}>
        <boxGeometry args={[roomWidth, roomHeight, 0.2]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} frustumCulled={false}>
        <boxGeometry args={[0.2, roomHeight, roomDepth]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} frustumCulled={false}>
        <boxGeometry args={[0.2, roomHeight, roomDepth]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Pillars */}
      {/* {pillarPositions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.3, roomHeight, 32]} />
          <primitive object={pillarMaterial} attach="material" />
        </mesh>
      ))} */}
    </group>
  );
};

// ===========================================================
// Main ArtGallery Component
// ===========================================================
const ArtGallery: React.FC = () => {
  const artPieces = [
    {
      imagePath: '/3d-assets/art-pieces/art1.jpg',
      position: [-6.5, 2, -7] as [number, number, number],
      rotation: [0, Math.PI / 2, 0] as [number, number, number],
      size: [2, 2.5] as [number, number],
      frameColor: '#4a4a4a',
    },
    {
      imagePath: '/3d-assets/art-pieces/art2.jpg',
      position: [0, 2, -9.9] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      size: [3, 2] as [number, number],
      frameColor: '#8b4513',
    },
    {
      imagePath: '/3d-assets/art-pieces/art3.jpg',
      position: [6.5, 2, -7] as [number, number, number],
      rotation: [0, -Math.PI / 2, 0] as [number, number, number],
      size: [2, 2.5] as [number, number],
      frameColor: '#000000',
    },
     { imagePath: '/3d-assets/art-pieces/art4.jpg',
         position: [-6.5, 2, 2] as [number, number, number],
          rotation: [0, Math.PI/2, 0] as [number, number, number], 
          size: [2, 3] as [number, number], 
          frameColor: '#2f4f4f' },
    { imagePath: '/3d-assets/art-pieces/art5.jpg', 
        position: [7.4, 2, 0] as [number, number, number], 
        rotation: [0, -Math.PI / 2, 0] as [number, number, number], 
        size: [2, 3] as [number, number], 
        frameColor: '#556b2f' },
    
  ];

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 3, 15], fov: 75 }} gl={{ powerPreference: 'high-performance' }}>
        <Suspense fallback={<Text color="black" anchorX="center" anchorY="middle">Loading...</Text>}>
          {/* Lights */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={0.7}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={1}
            shadow-camera-far={20}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          {/* Spotlights along ceiling */}
          {[-5, 0, 5].map(x => (
            <spotLight
              key={x}
              position={[x, 5.8, -9.5]}
              angle={0.3}
              intensity={1.5}
              penumbra={0.8}
              castShadow
              shadow-mapSize-width={512}
              shadow-mapSize-height={512}
            />
          ))}

          {/* Gallery Room */}
          <GalleryRoom />

          {/* Art Pieces */}
          {artPieces.map((art, i) => (
            <ArtPiece
              key={i}
              imagePath={art.imagePath}
              position={art.position}
              rotation={art.rotation}
              size={art.size}
              frameColor={art.frameColor}
            />
          ))}

          {/* Controls */}
          <OrbitControls enableDamping dampingFactor={0.05} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.2} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ArtGallery;
