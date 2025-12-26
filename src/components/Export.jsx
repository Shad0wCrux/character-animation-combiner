import React, { useContext, useState } from "react";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { Context as ModelContext } from "../context/ModelContext.jsx";

function saveArrayBuffer(buffer, filename) {
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function Export() {
  const { state } = useContext(ModelContext);
  const [busy, setBusy] = useState(false);

  const exportScene = (binary) => {
    if (!state?.mainModel) return;

  setBusy(true);

  const exporter = new GLTFExporter();
  exporter.parse(
    state.mainModel,
    (result) => {
      const ts = new Date().getTime();
      if (binary) {
        saveArrayBuffer(result, `cac-${ts}.glb`);
      } else {
        const output = JSON.stringify(result, null, 2);
        const blob = new Blob([output], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `cac-${ts}.gltf`;
        link.click();
        URL.revokeObjectURL(link.href);
      }
      setBusy(false);
    },
    (error) => {
      console.error(error);
      setBusy(false);
    },
    {
      binary,
      animations: state.animations,
    }
  );
};

  console.log("Export sees scene:", state?.mainModel);


  return (
    <div className="text-white">
      <div className="border-b border-white/10 bg-neutral-900/60 px-4 py-3">
        <h2 className="text-lg font-semibold">Export</h2>
        <p className="mt-1 text-sm text-white/70">
          Export your combined model as GLTF or GLB.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 px-4 py-4">
        <button
          type="button"
          disabled={busy || !state?.mainModel}
          onClick={() => exportScene(false)}
          className="inline-flex w-full items-center justify-center bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export GLTF
        </button>

        <button
          type="button"
          disabled={busy || !state?.mainModel}
          onClick={() => exportScene(true)}
          className="inline-flex w-full items-center justify-center bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export GLB
        </button>

        {!state?.scene && (
          <div className="text-xs text-white/60">
            Load a model first to enable export.
          </div>
        )}
      </div>
    </div>
  );
}

