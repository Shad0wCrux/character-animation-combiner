import React, { useContext, useEffect, useMemo, useState } from "react";
import { Context as ModalContext } from "../context/ModelContext.jsx";

export default function AnimationList() {
  const {
    state: { animations, mixer },
    changeName,
    deleteAnimation,
  } = useContext(ModalContext);

  const [playingId, setPlayingId] = useState(null);
  const [action, setAction] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState("");

  const hasMixer = useMemo(
    () => !!mixer && typeof mixer.clipAction === "function",
    [mixer]
  );

  useEffect(() => {
    if (action) action.play();
  }, [action]);

  useEffect(() => {
    if (!hasMixer) {
      if (action) action.stop();
      setAction(null);
      setPlayingId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMixer]);

  const stopAll = () => {
    if (action) action.stop();
    setAction(null);
    setPlayingId(null);
  };

  const playAnimation = (clip) => {
    if (!hasMixer) return;
    if (!clip?.uuid) return;
    if (clip.uuid === playingId) return;

    if (action) action.stop();

    const next = mixer.clipAction(clip);
    setAction(next);
    setPlayingId(clip.uuid);
  };

  const commitRename = (clip) => {
    const name = (draftName || "").trim();
    if (name.length) {
      clip.name = name;
      changeName(clip);
    }
    setEditingId(null);
    setDraftName("");
  };

  const removeAnimation = (animationId) => {
    if (action && action?._clip?.uuid === animationId) {
      action.stop();
      setAction(null);
      setPlayingId(null);
    }
    deleteAnimation(animationId);
  };

  return (
    <div className="border border-white/15 bg-neutral-900/50">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Animations ({animations?.length || 0})
          </h3>

          <button
            type="button"
            onClick={stopAll}
            disabled={!animations?.length}
            className={[
              "rounded px-2 py-1 text-xs font-semibold",
              animations?.length
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-white/10 text-white/40",
            ].join(" ")}
            title="Stop animation"
          >
            Stop Animation
          </button>
        </div>

        <p className="mt-1 text-xs text-white/60">
          Click to play · Double-click to rename
        </p>

        {!hasMixer && (
          <p className="mt-2 text-xs text-amber-300">
            Model not loaded (no mixer). Load a model to play animations.
          </p>
        )}
      </div>

      {/* List */}
      <div className="max-h-[75vh] overflow-auto p-2">
        {!animations?.length ? (
          <div className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            No animations found.
          </div>
        ) : (
          <ul className="space-y-2">
            {animations.map((clip) => {
              const isPlaying = clip.uuid === playingId;

              if (clip.uuid === editingId) {
                return (
                  <li key={clip.uuid}>
                    <input
                      className="w-full rounded border border-white/15 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                      defaultValue={clip.name}
                      autoFocus
                      placeholder="Rename"
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename(clip);
                        if (e.key === "Escape") {
                          setEditingId(null);
                          setDraftName("");
                        }
                      }}
                      onBlur={() => commitRename(clip)}
                    />
                  </li>
                );
              }

              return (
                <li key={clip.uuid}>
                  <div
                    className={[
                      "flex items-stretch gap-2 rounded border",
                      isPlaying
                        ? // Stronger “selected blue” treatment
                          "border-blue-400/70 bg-blue-600/25 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.35)]"
                        : "border-white/10 bg-neutral-800/40",
                      !hasMixer ? "opacity-60" : "",
                    ].join(" ")}
                  >
                    {/* Row button (play + rename) */}
                    <button
                      type="button"
                      onClick={() => playAnimation(clip)}
                      onDoubleClick={() => {
                        setEditingId(clip.uuid);
                        setDraftName(clip.name || "");
                      }}
                      disabled={!hasMixer}
                      className={[
                        "flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm",
                        "hover:bg-neutral-800/70",
                        isPlaying ? "text-white" : "text-white",
                        !hasMixer ? "cursor-not-allowed" : "cursor-pointer",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-2">
                        {/* Play icon (visible only when playing) */}
                        <span className="inline-flex w-4 items-center justify-center">
                          {isPlaying ? (
                            <svg
                              viewBox="0 0 16 16"
                              className="h-3.5 w-3.5 text-blue-200"
                              aria-hidden="true"
                            >
                              <path
                                fill="currentColor"
                                d="M6 3.5v9l8-4.5-8-4.5z"
                              />
                            </svg>
                          ) : (
                            <span className="h-3.5 w-3.5" />
                          )}
                        </span>

                        <span>{clip.name}</span>
                      </span>
                    </button>

                    {/* Delete button (sibling — NOT nested) */}
                    <button
                      type="button"
                      title="Delete animation"
                      onClick={() => removeAnimation(clip.uuid)}
                      className="shrink-0 self-center rounded border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

