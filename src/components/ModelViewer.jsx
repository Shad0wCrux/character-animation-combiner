import React, { useRef, useEffect, useContext } from "react";
import * as THREE from "three";
import setCamera from "../helpers/setCamera";
import setControls from "../helpers/setControls";
import setLights from "../helpers/setLights";
import resizeWindow from "../helpers/resizeWindow";
import loadModel from "../helpers/loadModel";
import { Context as ModalContext } from "../context/ModelContext.jsx";


const ModelViewer = ({ model, fileExt, lighting, bgMode }) => {
  const viewer = useRef(null);
  const sceneRef = useRef(null);
  const groundMatRef = useRef(null);
  const gridMatRef = useRef(null);


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
    sceneRef.current = scene;
    const camera = setCamera(container);

    let mixer = null;
    let rafId = null;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    resizeWindow(camera, container, renderer);
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;


    const existingCanvas = container.querySelector("canvas");
    if (existingCanvas) existingCanvas.remove();
    container.appendChild(renderer.domElement);

    // Ground
    const groundMaterial = new THREE.MeshPhongMaterial({
        color: 0x999999,
        depthWrite: false,
    });
    groundMatRef.current = groundMaterial;

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000),
        groundMaterial
    );

    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = -80;
    scene.add(ground);

    

    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    grid.position.y = -80;
    gridMatRef.current = grid.material;
    scene.add(grid);


// Standard - Light
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);


// Darker (slate)
//    scene.background = new THREE.Color(0x111827);
//    scene.fog = new THREE.Fog(0x111827, 200, 1200);


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

        const existingCanvas = container.querySelector("canvas");
        if (existingCanvas) existingCanvas.remove();
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

    useEffect(() => {
  const scene = sceneRef.current;
  if (!scene) return;

  const isDark = bgMode === "dark";

  // Background + fog
  const bgColor = isDark ? 0x111827 : 0xa0a0a0;
  scene.background = new THREE.Color(bgColor);
  scene.fog = new THREE.Fog(bgColor, 200, 1000);

  // Ground
  if (groundMatRef.current) {
    groundMatRef.current.color.setHex(isDark ? 0x374151 : 0x999999);
    groundMatRef.current.needsUpdate = true;
  }

  // Grid
  if (gridMatRef.current) {
    // Keep subtle grid; slightly brighter in dark mode
    gridMatRef.current.opacity = isDark ? 0.25 : 0.2;
    gridMatRef.current.needsUpdate = true;
  }
}, [bgMode]);



return <div className="h-full w-full" ref={viewer} />;

};

export default ModelViewer;

