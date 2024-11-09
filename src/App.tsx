import { createRef, useEffect, useMemo, useRef } from "react";
import "./App.css";
import { useTweakpane } from "./hooks/use-tweakpane";
import { HelperTypes } from "./enums/helper-types";
import { ListBladeApi, TabPageApi } from "tweakpane";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Sky,
} from "@react-three/drei";
import { BookShoe } from "./helpers/BookShoe";
import { HelperRefDefault } from "./models/helper";
import { saveAs } from "file-saver";
import { useDropzone } from "react-dropzone";
import { STLExporter } from "three/addons/exporters/STLExporter.js";
import * as THREE from "three";
import { getState, setState } from "./utils/local-storage";

const LOCALSTORAGE_KEYS = {
  helperType: "helperType",
};

function App() {
  const pane = useTweakpane("3D Book Helpers");
  const { open, getInputProps, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    accept: {
      "application/json": [".json"],
    },
  });

  const tabGeneralPage = useRef<TabPageApi>();
  const refHelper = createRef<HelperRefDefault>();

  const helperType = getState(
    LOCALSTORAGE_KEYS.helperType,
    HelperTypes.BOOK_SHOE
  );

  useEffect(() => {
    if (!acceptedFiles.length) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (!data) return;
      const parsed = JSON.parse(data as string);
      refHelper.current?.importSettings(parsed);
    };
    reader.readAsText(acceptedFiles[0]);
  }, [acceptedFiles]);

  useEffect(() => {
    if (!pane.current) return;
    const { current } = pane;

    const helper = current.addBlade({
      view: "list",
      label: "Helper Model",
      options: [{ text: "Book Shoe", value: HelperTypes.BOOK_SHOE }],
      value: helperType,
    }) as ListBladeApi<HelperTypes>;

    helper.on("change", (value) => {
      setState(LOCALSTORAGE_KEYS.helperType, value.value);
      location.reload();
    });

    current.addBlade({
      view: "separator",
    });

    current
      .addButton({
        title: "Export STL",
      })
      .on("click", () => {
        const exporter = new STLExporter();
        const options = { binary: true };
        refHelper.current?.exportSTL((vertices) => {
          console.log(vertices);
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(vertices, 3)
          );
          const mesh = new THREE.Mesh(geometry);
          const result = exporter.parse(mesh, options);
          const blob = new Blob([result], { type: "application/octet-stream" });
          saveAs(blob, "model.stl");
        });
      });

    const tab = current.addTab({
      pages: [
        {
          title: "Helper",
        },
        {
          title: "Settings",
        },
      ],
    });

    const [general, advanced] = tab.pages;

    advanced
      .addButton({
        title: "Reset Settings",
      })
      .on("click", () => {
        refHelper.current?.resetSettings();
      });

    advanced
      .addButton({
        title: "Import Settings",
      })
      .on("click", () => {
        console.log("Import Settings");
        open();
      });

    advanced
      .addButton({
        title: "Export Settings",
      })
      .on("click", () => {
        refHelper.current?.exportSettings((data) => {
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          saveAs(blob, "settings.json");
        });
      });

    tabGeneralPage.current = general;

    return () => {};
  }, [pane]);

  const renderHelper = useMemo(() => {
    switch (helperType) {
      case HelperTypes.BOOK_SHOE:
        return <BookShoe tab={tabGeneralPage} ref={refHelper} />;
      default:
        return null;
    }
  }, [helperType]);

  return (
    <div className="app">
      <input {...getInputProps()} />
      <Canvas shadows>
        <OrbitControls makeDefault />
        <PerspectiveCamera makeDefault position={[2, 2, 3]} />
        <Sky />
        <ambientLight intensity={Math.PI / 4} />
        <Environment preset="sunset" />
        {renderHelper}
      </Canvas>
    </div>
  );
}

export default App;
