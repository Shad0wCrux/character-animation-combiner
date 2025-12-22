import React from "react";
import UploadButton from "./UploadButton.jsx";

export default function UploadSection({ onMainModelUpload, onAnimationUpload }) {
  return (
    <div className="text-white">
      <div className="border-b border-white/10 bg-neutral-900/60 px-4 py-3">
        <h2 className="text-lg font-semibold">Upload</h2>
        <p className="mt-1 text-sm text-white/70">
          Main model: <span className="font-medium">.fbx / .gltf / .glb</span>
        </p>
      </div>

      <div className="space-y-4 px-4 py-4">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-white/85">Main Model</div>
          <UploadButton
            label="Upload Model"
            accept=".fbx,.gltf,.glb"
            multiple={false}
            onUpload={onMainModelUpload}
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-semibold text-white/85">Animations</div>
          <p className="text-xs text-white/60">
            Upload one or more animation files (FBX/GLTF/GLB).
          </p>
          <UploadButton
            label="Upload Animations"
            accept=".fbx,.gltf,.glb"
            multiple
            onUpload={onAnimationUpload}
          />
        </div>
      </div>
    </div>
  );
}

