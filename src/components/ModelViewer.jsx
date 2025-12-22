import React, { useRef, useEffect, useContext } from "react";
import * as THREE from "three";
import setCamera from "../helpers/setCamera";
import setControls from "../helpers/setControls";
import setLights from "../helpers/setLights";
import resizeWindow from "../helpers/resizeWindow";
import loadModel from "../helpers/loadModel";
import { Context as ModalContext } from "../context/ModelContext";


const ModelViewer = ({ model, fileExt, lighting }) => {
  const viewer = useRef(null);

  const hemiRef = useRef(null);
  const rendererRef = useRef(null);
  const dirRef = useRef(null);
  const {
    addMainModel,
    addAnimationFromMainModel,
    addMixer,
    toggleLoading,
  } = useContext(ModalContext);

  useEffect(() => {
    if (!model) return;

    const clock = new THREE.Clock();
    const container = viewer.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = setCamera(container);

    let mixer = null;
    let rafId = null;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    resizeWindow(camera, container, renderer);

    rendererRef.current = renderer;

    // Replace any previous canvas
    if (container.children.length) container.removeChild(container.lastChild);
    container.appendChild(renderer.domElement);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = -80;
    scene.add(ground);

    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    grid.position.y = -80;
    scene.add(grid);

    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
    scene.background = new THREE.Color(0xa0a0a0);

    // Lighting & controls
    setControls(camera, container);
    const { hemi, dir } = setLights(scene);
      hemiRef.current = hemi;
      dirRef.current = dir;

    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    // Modern three.js color management
    // (replaces renderer.outputEncoding = THREE.sRGBEncoding)
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    toggleLoading();
    loadModel(model, fileExt, (object) => {
      toggleLoading();

      if (object?.animations?.length) {
        object.animations.forEach((anim) => {
          if (anim.name === "Take 001") anim.name = "T-Pose (No Animation)";
        });
      }

      const mainModel = fileExt === "fbx" ? object : object.scene;
      scene.add(mainModel);

      addMainModel(mainModel);

      if (object?.animations?.length) {
        addAnimationFromMainModel(object.animations);
      }

      mixer = new THREE.AnimationMixer(mainModel);
      addMixer(mixer);
    });

    const onResize = () => resizeWindow(camera, container, renderer);
    window.addEventListener("resize", onResize);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (mixer) mixer.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);

      renderer.dispose();

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [model, fileExt]);

    useEffect(() => {
        if (!lighting) return;

        if (hemiRef.current) hemiRef.current.intensity = lighting.hemiIntensity;
        if (dirRef.current) dirRef.current.intensity = lighting.dirIntensity;

        if (rendererRef.current) {
            rendererRef.current.toneMappingExposure = lighting.exposure;
        }
    }, [lighting]);

  return <div style={{ height: "90vh" }} ref={viewer} />;
};

export default ModelViewer;

