'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';
import { Button, Tooltip } from 'antd';
import { RotateCw, Maximize, Camera } from 'lucide-react';


export default function DirectorPage() {
  return (
    <div style={{ height: 'calc(100vh - 4rem)' }} className='relative w-full overflow-hidden bg-black'>
      <Canvas shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </Canvas>
      <Toolbar />
      <InfoPanel />
    </div>
  );
}

function Scene3D() {
  const lightRef = useRef(null);
  useFrame((state) => {
    if (lightRef.current) lightRef.current.position.copy(state.camera.position);
  });
  return (
    <>
      <OrbitControls makeDefault enableDamping minDistance={2} maxDistance={50} maxPolarAngle={Math.PI/2.2} />
      <ambientLight intensity={0.4} />
      <directionalLight ref={lightRef} intensity={1.5} castShadow shadow-mapSize={[2048,2048]} />
      <hemisphereLight args={['#87CEEB', '#362907', 0.6]} />
      <Grid infiniteGrid fadeDistance={50} cellSize={1} cellThickness={0.5} cellColor='#333' sectionSize={5} sectionThickness={1} sectionColor='#555' />
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.01,0]} receiveShadow>
        <planeGeometry args={[30,30]} />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>
      <mesh position={[0,0.5,0]} castShadow>
        <boxGeometry args={[1,1,1]} />
        <meshStandardMaterial color='#4f46e5' roughness={0.3} />
      </mesh>
      <GizmoHelper alignment='bottom-right' margin={[80,80]}>
        <GizmoViewport axisColors={['#ff2060', '#20df80', '#2080ff']} />
      </GizmoHelper>
    </>
  );
}

function Toolbar() {
  return (
    <div className='absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 rounded-xl bg-black/60 px-4 py-2 backdrop-blur-md border border-white/10 z-10'>
      <Button type='text' className='text-white/70 hover:text-white' icon={<RotateCw size={16} />} />
      <Button type='text' className='text-white/70 hover:text-white' icon={<Maximize size={16} />} />
      <Button type='text' className='text-white/70 hover:text-white' icon={<Camera size={16} />} />
    </div>
  );
}

function InfoPanel() {
  return (
    <div className='absolute bottom-4 left-4 rounded-lg bg-black/50 px-4 py-2 backdrop-blur-md border border-white/10 text-white/60 text-xs z-10'>
      <div>3D 导演台</div>
      <div className='mt-1'>右键拖拽旋转 | 滚轮缩放 | 中键平移</div>
    </div>
  );
}