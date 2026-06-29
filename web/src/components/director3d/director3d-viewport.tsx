"use client";

import React, { useEffect, useRef, useCallback } from "react";
import type { Director3DScene, Director3DObject } from "@/app/(user)/canvas/types";

type Director3DViewportProps = {
    scene: Director3DScene;
    width?: number;
    height?: number;
    onSceneChange?: (scene: Director3DScene) => void;
};

const DEFAULT_SCENE: Director3DScene = {
    objects: [
        { id: "cube-1", type: "cube", position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], color: "#4f8fff" },
        { id: "plane-1", type: "plane", position: [0, -2, 0], rotation: [-Math.PI / 2, 0, 0], scale: [5, 5, 1], color: "#333333" },
    ],
    camera: { position: [3, 3, 5], target: [0, 0, 0] },
    background: "#1a1a2e",
    ambientLight: "#ffffff",
    directionalLight: { position: [5, 10, 5], intensity: 1 },
};

let THREE_MODULE: any = null;
async function loadThree() {
    if (THREE_MODULE) return THREE_MODULE;
    const mod = await import("three");
    THREE_MODULE = mod;
    return THREE_MODULE;
}

function renderObjects(scene: any, objects: Director3DObject[], objectMap: Map<string, any>, T: any) {
    objects.forEach((obj) => {
        let geometry: any;
        switch (obj.type) {
            case "cube": geometry = new T.BoxGeometry(1, 1, 1); break;
            case "sphere": geometry = new T.SphereGeometry(0.5, 32, 32); break;
            case "plane": geometry = new T.PlaneGeometry(1, 1); break;
            case "cylinder": geometry = new T.CylinderGeometry(0.5, 0.5, 1, 32); break;
            case "cone": geometry = new T.ConeGeometry(0.5, 1, 32); break;
            case "torus": geometry = new T.TorusGeometry(0.5, 0.2, 16, 32); break;
            default: geometry = new T.BoxGeometry(1, 1, 1);
        }
        const material = new T.MeshStandardMaterial({ color: obj.color || "#4f8fff", roughness: 0.5, metalness: 0.3 });
        const mesh = new T.Mesh(geometry, material);
        mesh.position.set(obj.position[0], obj.position[1], obj.position[2]);
        mesh.rotation.set(obj.rotation[0], obj.rotation[1], obj.rotation[2]);
        mesh.scale.set(obj.scale[0], obj.scale[1], obj.scale[2]);
        scene.add(mesh);
        objectMap.set(obj.id, mesh);
    });
}

export function Director3DViewport({ scene = DEFAULT_SCENE, width = 400, height = 300 }: Director3DViewportProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);
    const rendererRef = useRef<any>(null);
    const frameRef = useRef<number>(0);
    const objectsRef = useRef<Map<string, any>>(new Map());

    const initScene = useCallback(async () => {
        if (!containerRef.current || sceneRef.current) return;
        const T = await loadThree();
        if (!T || !containerRef.current) return;
        const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(scene.background);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;
        const s = new T.Scene();
        s.background = new T.Color(scene.background);
        sceneRef.current = s;
        const camPos = scene.camera.position;
        const camera = new T.PerspectiveCamera(50, width / height, 0.1, 100);
        camera.position.set(camPos[0], camPos[1], camPos[2]);
        camera.lookAt(scene.camera.target[0], scene.camera.target[1], scene.camera.target[2]);
        cameraRef.current = camera;
        s.add(new T.AmbientLight(scene.ambientLight, 0.6));
        const dirPos = scene.directionalLight.position;
        const dirLight = new T.DirectionalLight(0xffffff, scene.directionalLight.intensity);
        dirLight.position.set(dirPos[0], dirPos[1], dirPos[2]);
        s.add(dirLight);
        s.add(new T.GridHelper(10, 10, 0x444444, 0x222222));
        renderObjects(s, scene.objects, objectsRef.current, T);
        const animate = () => { frameRef.current = requestAnimationFrame(animate); renderer.render(s, camera); };
        animate();
    }, [scene, width, height]);

    useEffect(() => {
        initScene();
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            if (rendererRef.current) { rendererRef.current.dispose(); rendererRef.current = null; }
            if (containerRef.current) containerRef.current.innerHTML = "";
            sceneRef.current = null; cameraRef.current = null; objectsRef.current.clear();
        };
    }, [initScene]);

    return <div ref={containerRef} className="director3d-viewport rounded-lg overflow-hidden border border-stone-700" style={{ width, height, background: scene.background }} />;
}

export { DEFAULT_SCENE };
