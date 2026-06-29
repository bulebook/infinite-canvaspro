'use client';

import { useState, Suspense, useRef, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Button, Slider, Tooltip } from 'antd';
import { Play, Pause, RotateCw, ZoomIn, ZoomOut, Maximize, Camera } from 'lucide-react';

export default function DirectorPage() {
  return (
    <div className='relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-black'>
      <Canvas shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <Suspense fallback={null}>
          <DirectorScene />
        </Suspense>
      </Canvas>
      <DirectorToolbar />
      <DirectorInfo />
    </div>
  );
}

function DirectorScene() {
  const { camera } = useThree();
  const lightRef = useRef(null);

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.copy(state.camera.position);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[8, 6, 12]} fov={50} />
      <OrbitControls makeDefault enableDamping dampingFactor={0.1} minDistance={2} maxDistance={50} maxPolarAngle={Math.PI / 2.2} />
      
      <ambientLight intensity={0.4} />
      <directionalLight ref={lightRef} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-far={50} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} />
      <hemisphereLight args={['#87CEEB', '#362907', 0.6]} />
      
      <Grid infiniteGrid fadeDistance={50} fadeStrength={5} cellSize={1} cellThickness={0.5} cellColor='#333333' sectionSize={5} sectionThickness={1} sectionColor='#555555' />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>
      
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color='#4f46e5' roughness={0.3} metalness={0.2} />
      </mesh>
      
      <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
        <GizmoViewport axisColors={['#ff2060', '#20df80', '#2080ff']} labelColor='white' />
      </GizmoHelper>
    </>
  );
}

function DirectorToolbar() {
  return (
    <div className='absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 rounded-xl bg-black/60 px-4 py-2 backdrop-blur-md border border-white/10'>
      <Tooltip title='add cube'><Button type='text' icon={<div className='w-4 h-4 bg-indigo-500 rounded-sm' />} className='text-white' /></Tooltip>
      <Tooltip title='add sphere'><Button type='text' icon={<div className='w-4 h-4 bg-emerald-500 rounded-full' />} className='text-white' /></Tooltip>
      <div className='w-px bg-white/20 mx-1' />
      <Tooltip title='reset view'><Button type='text' icon={<RotateCw className='w-4 h-4' />} className='text-white/70 hover:text-white' /></Tooltip>
      <Tooltip title='top view'><Button type='text' icon={<Maximize className='w-4 h-4' />} className='text-white/70 hover:text-white' /></Tooltip>
      <Tooltip title='screenshot'><Button type='text' icon={<Camera className='w-4 h-4' />} className='text-white/70 hover:text-white' /></Tooltip>
    </div>
  );
}

function DirectorInfo() {
  return (
    <div className='absolute bottom-4 left-4 rounded-lg bg-black/50 px-4 py-2 backdrop-blur-md border border-white/10 text-white/60 text-xs'>
      <div>3D å¯¼æ¼å° v0.1</div>
      <div className='mt-1'>å³é®ææ½æè½¬ | æ»è½®ç¼©æ¾ | ä¸­é®å¹³ç§»</div>
    </div>
  );
}