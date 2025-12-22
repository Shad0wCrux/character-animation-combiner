import React, { useContext, useEffect, useMemo, useState } from "react";
import UploadButton from "./UploadButton";
import { Context as ModelContext } from "../context/ModelContext.jsx";
import * as THREE from "three";
import { TextureLoader } from "three";

const ChangeTexture = () => {
  const [texture, setTexture] = useState(null);
  const [defaultTexture, setDefaultTexture] = useState(null);

  const {
    state: { mainModel },
  } = useContext(ModelContext);

  // Capture the model's "original" texture once per model load.
  useEffect(() => {
    if (!mainModel) return;

    let found = null;

    mainModel.traverse((child) => {
      if (!found && child?.isMesh && child?.material && child.material.map) {
        found = child.material.map;
      }
    });

    setTexture(found);        // current texture state (may be null)
    setDefaultTexture(found); // what "Default Texture" means for this model
  }, [mainModel]);

  // Apply current texture to all meshes
  useEffect(() => {
    if (!mainModel) return;
    // Allow "null" to mean "no map"
    mainModel.traverse((child) => {
      if (child?.isMesh && child?.material && "map" in child.material) {
        child.material.map = texture ?? null;
        child.material.needsUpdate = true;
      }
    });
  }, [texture, mainModel]);

  const onTextureUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    changeTexture(url);
  };

  const changeTexture = (url) => {
    const loader = new TextureLoader();
    loader.setCrossOrigin("anonymous");

    loader.load(url, (loadedTexture) => {
      // three r152+ color management
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
      loadedTexture.needsUpdate = true;
      setTexture(loadedTexture);
    });
  };

  const hasDefault = !!defaultTexture;
  const hasCustom = texture !== defaultTexture; // works fine for object identity here
  const hasAnyTexture = !!texture;

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Change Texture</h3>
          <p className="mt-1 text-xs text-white/60">(.png / .jpg)</p>
        </div>
      </div>

      <div className="mt-3">
        <UploadButton
            label="Upload Texture"
            accept=".png,.jpg"
            onUpload={onTextureUpload}
            hint="PNG/JPG recommended"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {/* Delete current texture (removes material.map) */}
        {hasAnyTexture && (
          <button
            type="button"
            onClick={() => setTexture(null)}
            className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-500 active:bg-red-700"
          >
            Delete Current Texture
          </button>
        )}

        {/* Restore model's original texture */}
        {hasDefault && hasCustom && (
          <button
            type="button"
            onClick={() => setTexture(defaultTexture)}
            className="rounded-md bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/15 active:bg-white/20"
          >
            Restore Default Texture
          </button>
        )}
      </div>

      {/* Optional: status line */}
      <div className="mt-3 text-xs text-white/50">
        {!mainModel
          ? "Load a model to enable texture changes."
          : !texture
          ? "No texture applied."
          : hasCustom
          ? "Custom texture applied."
          : "Default texture active."}
      </div>
    </div>
  );
};

export default ChangeTexture;

