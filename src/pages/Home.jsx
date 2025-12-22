import React, { useState, useContext } from "react";
import Layout from "../components/Layout.jsx";
import UploadSection from "../components/UploadSection.jsx";
import ModelViewer from "../components/ModelViewer.jsx";
import AnimationList from "../components/AnimationList.jsx";
import ChangeTexture from "../components/ChangeTexture.jsx";
import loadModel from "../helpers/loadModel.js";
import { Context as ModalContext } from "../context/ModelContext.jsx";
import Export from "../components/Export.jsx";
import Preloader from "../components/Preloader.jsx";
import DefaultGLB from "../assets/model3d/default.glb?url";
import Info from "../components/Info.jsx";
import LightingControls from "../components/LightingControls.jsx";


const Panel = ({ children }) => (
  <div className="border border-white/15 bg-neutral-800/60">{children}</div>
);

const Home = () => {
  const [model, setModel] = useState(DefaultGLB);
  const [fileExt, setFileExt] = useState("glb");
  const [bgMode, setBgMode] = useState("light"); // light | dark settings
  
  const {
    state: { loading },
    addAnimations,
  } = useContext(ModalContext);

  const [lighting, setLighting] = useState({
    hemiIntensity: 0.9,
    dirIntensity: 3.0,
    exposure: 1.0,
  });

  const onMainModelUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setFileExt(file.name.split(".").pop());
      setModel(fileUrl);
    }
  };

  const onAnimationUpload = (event) => {
    if (event.target.files && event.target.files.length) {
      Array.from(event.target.files).forEach((element) => {
        const fileUrl = URL.createObjectURL(element);
        const ext = element.name.split(".").pop();

        loadModel(fileUrl, ext, (object) => {
          let fileName = element.name.split(".")[0].replace(/\s/g, "");
          fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

          if (object.animations.length > 1) {
            object.animations.forEach((anim, index) => {
              anim.name = fileName + index;
            });
          } else if (object.animations[0]) {
            if (object.animations[0].name === "Take 001") {
              object.animations[0].name = "T-Pose (No Animation)";
            } else {
              object.animations[0].name = fileName;
            }
          }

          addAnimations(object.animations);
        });
      });
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-12 gap-4">
        {/* Left tools */}
        <aside className="col-span-12 lg:col-span-3 space-y-4 overflow-auto pr-1">
          <Panel>
            <UploadSection
              onMainModelUpload={onMainModelUpload}
              onAnimationUpload={onAnimationUpload}
            />
          </Panel>

          <Panel>
            <Export />
          </Panel>

          <Panel>
            <ChangeTexture />
          </Panel>

          <Panel>
            <LightingControls lighting={lighting} setLighting={setLighting} bgMode={bgMode} setBgMode={setBgMode} />
          </Panel>

          <Panel>
            <Info />
          </Panel>
        </aside>

        {/* Viewer */}
      <section className="col-span-12 lg:col-span-6">
        <div className="h-[91vh] border border-white/15 bg-neutral-800/60">
          <ModelViewer model={model} fileExt={fileExt} lighting={lighting} bgMode={bgMode} />
        </div>
      </section>

        {/* Right list */}
        <aside className="col-span-12 lg:col-span-3 overflow-auto pl-1">
          <Panel>
            <AnimationList />
          </Panel>
        </aside>
      </div>

      <Preloader loading={loading} />
    </Layout>
  );
};

export default Home;

