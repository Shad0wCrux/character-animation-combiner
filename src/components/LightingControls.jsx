import React, { useMemo, useState } from "react";

export default function LightingControls({
  lighting,
  setLighting,
  bgMode,
  setBgMode,
}) {
  const [open, setOpen] = useState(false);

  const display = useMemo(() => {
    const safe = lighting || { hemiIntensity: 0, dirIntensity: 0, exposure: 1 };
    return {
      hemi: Number(safe.hemiIntensity ?? 0),
      dir: Number(safe.dirIntensity ?? 0),
      exp: Number(safe.exposure ?? 1),
    };
  }, [lighting]);

  const resetLighting = () => {
    setLighting({
      hemiIntensity: 0.9,
      dirIntensity: 3.0,
      exposure: 1.0,
    });
  };

  return (
    <div className="text-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between border-b border-white/10 bg-neutral-900/60 px-4 py-3 text-left"
      >
        <span className="text-lg font-semibold">Lighting</span>
        <span className="text-sm text-white/70">{open ? "Hide" : "Show"}</span>
      </button>

      {open && (
        <div className="space-y-4 px-4 py-4">
          {/* Background toggle */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-white/85">Background</span>

            <div className="inline-flex overflow-hidden rounded-md border border-white/15">
              <button
                type="button"
                onClick={() => setBgMode("light")}
                className={[
                  "px-3 py-1 text-xs",
                  bgMode === "light"
                    ? "bg-white/15 text-white"
                    : "bg-transparent text-white/70 hover:text-white",
                ].join(" ")}
              >
                Light
              </button>

              <button
                type="button"
                onClick={() => setBgMode("dark")}
                className={[
                  "px-3 py-1 text-xs",
                  bgMode === "dark"
                    ? "bg-white/15 text-white"
                    : "bg-transparent text-white/70 hover:text-white",
                ].join(" ")}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Fill */}
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-white/85">Fill (Hemisphere)</span>
              <span className="tabular-nums text-white/70">
                {display.hemi.toFixed(2)}
              </span>
            </div>
            <input
              className="w-full"
              type="range"
              min="0"
              max="3"
              step="0.05"
              value={display.hemi}
              onChange={(e) =>
                setLighting((v) => ({
                  ...(v || {}),
                  hemiIntensity: Number(e.target.value),
                }))
              }
            />
          </div>

          {/* Key */}
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-white/85">Key (Directional)</span>
              <span className="tabular-nums text-white/70">
                {display.dir.toFixed(2)}
              </span>
            </div>
            <input
              className="w-full"
              type="range"
              min="0"
              max="6"
              step="0.1"
              value={display.dir}
              onChange={(e) =>
                setLighting((v) => ({
                  ...(v || {}),
                  dirIntensity: Number(e.target.value),
                }))
              }
            />
          </div>

          {/* Exposure */}
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-white/85">Exposure</span>
              <span className="tabular-nums text-white/70">
                {display.exp.toFixed(2)}
              </span>
            </div>
            <input
              className="w-full"
              type="range"
              min="0.75"
              max="2.5"
              step="0.05"
              value={display.exp}
              onChange={(e) =>
                setLighting((v) => ({
                  ...(v || {}),
                  exposure: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={resetLighting}
              className="inline-flex w-full items-center justify-center bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
            >
              Reset Lighting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

