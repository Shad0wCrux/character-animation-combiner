import React, { useEffect } from "react";
import M from "materialize-css";

/**
 * LightingControls
 * - UI-only component
 * - Controlled inputs: receives `lighting` + `setLighting` from parent
 * - Collapsible starts collapsed by default
 */
export default function LightingControls({ lighting, setLighting }) {
  useEffect(() => {
    const elems = document.querySelectorAll(".collapsible");
    M.Collapsible.init(elems);
  }, []);

  const resetLighting = () => {
    setLighting({
      hemiIntensity: 0.9,
      dirIntensity: 3.0,
      exposure: 1.0,
    });
  };
return (
  <ul className="collection with-header" style={{ marginTop: "25px" }}>
    <li className="collection-header grey darken-4 white-text">
      <h5 style={{ marginBottom: "10px" }}>Lighting</h5>

      {/* If you want it collapsible, keep this section inside a collapsible body-like container */}
      <div style={{ paddingTop: "5px" }}>
        {/* Fill */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Fill (Hemisphere)</span>
            <span>{lighting.hemiIntensity.toFixed(2)}</span>
          </div>
          <p className="range-field" style={{ margin: "6px 0 0" }}>
            <input
              type="range"
              min="0"
              max="3"
              step="0.05"
              value={lighting.hemiIntensity}
              onChange={(e) =>
                setLighting((v) => ({
                  ...v,
                  hemiIntensity: Number(e.target.value),
                }))
              }
            />
          </p>
        </div>

        {/* Key */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Key (Directional)</span>
            <span>{lighting.dirIntensity.toFixed(2)}</span>
          </div>
          <p className="range-field" style={{ margin: "6px 0 0" }}>
            <input
              type="range"
              min="0"
              max="6"
              step="0.1"
              value={lighting.dirIntensity}
              onChange={(e) =>
                setLighting((v) => ({
                  ...v,
                  dirIntensity: Number(e.target.value),
                }))
              }
            />
          </p>
        </div>

        {/* Exposure */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Exposure</span>
            <span>{lighting.exposure.toFixed(2)}</span>
          </div>
          <p className="range-field" style={{ margin: "6px 0 0" }}>
            <input
              type="range"
              min="0.75"
              max="2.5"
              step="0.05"
              value={lighting.exposure}
              onChange={(e) =>
                setLighting((v) => ({
                  ...v,
                  exposure: Number(e.target.value),
                }))
              }
            />
          </p>
        </div>

        <button className="btn" style={{ background: "#26a69a" }} onClick={resetLighting}>
          Reset Lighting
        </button>
      </div>
    </li>
  </ul>
);

}

