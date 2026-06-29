
"use client";

import React, { useState } from "react";
import { Button } from "antd";
import type { Director3DScene } from "@/app/(user)/canvas/types";
import { Director3DViewport } from "./director3d-viewport";

type Director3DSettingsProps = {
    scene: Director3DScene;
    onSceneChange: (scene: Director3DScene) => void;
};

export function Director3DSettingsPanel({ scene, onSceneChange }: Director3DSettingsProps) {
    const addObject = () => {
        const obj = { id: "cube-" + Date.now(), type: "cube", position: [0, 1, 0], rotation: [0, 0, 0], scale: [1, 1, 1], color: "#4f8fff" };
        onSceneChange({ ...scene, objects: [...scene.objects, obj] });
    };
    return (
        <div className="p-3 min-w-[300px]">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-200">3D 导演台</span>
            </div>
            <Director3DViewport scene={scene} width={280} height={200} />
            <div className="mt-2 flex gap-1">
                <Button size="small" onClick={addObject}>+ 添加立方体</Button>
            </div>
        </div>
    );
}
