import React, { useState, useContext } from "react";
import Layout from "../components/Layout.jsx";
import UploadSection from "../components/UploadSection.jsx";
import ModelViewer from "../components/ModelViewer.jsx";
import AnimationList from "../components/AnimationList.jsx";
import ChangeTexture from "../components/ChangeTexture.jsx";
import loadModel from "../helpers/loadModel";
import { Context as ModalContext } from "../context/ModelContext";
import Export from "../components/Export.jsx";
import Preloader from "../components/Preloader.jsx";
import DefaultGLB from "../assets/model3d/default.glb?url";
import Info from "../components/Info.jsx";
import M from "materialize-css";
import { useEffect } from "react";
import LightingControls from "../components/LightingControls.jsx";

const Home = () => {
  const [model, setModel] = useState(DefaultGLB);
  const [fileExt, setFileExt] = useState("glb");
  const {
    state: { loading },
    addAnimations,
  } = useContext(ModalContext);

  const onMainModelUpload = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      let fileUrl = URL.createObjectURL(file);
      setFileExt(file.name.split(".").pop());

      setModel(fileUrl);
    }
  };

useEffect(() => {
  const elems = document.querySelectorAll(".collapsible");
  M.Collapsible.init(elems);
}, []);


  const onAnimationUpload = (event) => {
    if (event.target.files.length) {
      Array.from(event.target.files).forEach((element) => {
        let fileUrl = URL.createObjectURL(element);
        let fileExt = element.name.split(".").pop();
        loadModel(fileUrl, fileExt, (object) => {
          let fileName = element.name.split(".")[0].replace(/\s/g, "");
          fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
          if (object.animations.length > 1) {
            object.animations.forEach((anim, index) => {
              anim.name = fileName + index;
            });
          } else {
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

  const [lighting, setLighting] = useState({
      hemiIntensity: 0.9,
      dirIntensity: 3.0,
      exposure: 1.0,
  });

  return (
    <Layout>
      <div className="row" style={{ height: "91vh" }}>
        <div className="col m3">
          <UploadSection
            onMainModelUpload={onMainModelUpload}
            onAnimationUpload={onAnimationUpload}
          />
          <Export />
          <ChangeTexture />
	  <LightingControls lighting={lighting} setLighting={setLighting} />
          <Info />
        </div>
        <div className="col m6">
          <ModelViewer model={model} fileExt={fileExt} lighting={lighting} />
        </div>
        <div className="col m3">
          <AnimationList />
        </div>
      </div>
      <Preloader loading={loading} />
      

      </Layout>
  );
};

export default Home;
