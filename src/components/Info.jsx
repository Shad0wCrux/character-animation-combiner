import React from "react";

export default function Info() {
  return (
    <div className="text-white">
      <div className="border-b border-white/10 bg-neutral-900/60 px-4 py-3">
        <h2 className="text-lg font-semibold">Info</h2>
      </div>

      <div className="space-y-2 px-4 py-4 text-sm text-white/70">
        <p>
          Upload a base model and one or more animation files. Select animations
          from the list to preview.</p>

        <p>
          The "Lighting" section is only to assist in viewing your models / textures from the viewport.
          No changes are being done to the base model / animations.
        </p>
        <p>
          Use Export to save the combined result as GLTF or GLB when ready.
        </p>
      </div>
    </div>
  );
}

