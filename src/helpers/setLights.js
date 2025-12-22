import { HemisphereLight, DirectionalLight } from "three";

export default (scene) => {
  // Hemisphere light: soft global fill
  const hemi = new HemisphereLight(0xffffff, 0x444444, 0.9);
  hemi.position.set(100, 200, 400);
  scene.add(hemi);

  // Directional light: key light
  const dir = new DirectionalLight(0xffffff, 3.0);
  dir.position.set(100, 200, 100);
  dir.castShadow = true;

  dir.shadow.camera.top = 180;
  dir.shadow.camera.bottom = -100;
  dir.shadow.camera.left = -120;
  dir.shadow.camera.right = 120;

  scene.add(dir);

  return { hemi, dir };
};

