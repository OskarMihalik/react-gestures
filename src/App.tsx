import React, { useRef } from "react";
import "./App.css";
import { Canvas, MeshProps } from "react-three-fiber";
import Mesh from "./Mesh";

function App() {
  const componentRef = useRef(null);
  const meshRef = useRef<MeshProps>();

  const restartPosition = () => {
    if (!meshRef.current) {
      return;
    }
    meshRef.current.position.x = 0;
    meshRef.current.position.y = 0;
    meshRef.current.position.z = 0;

    meshRef.current.scale.x = 1;
    meshRef.current.scale.y = 1;
    meshRef.current.scale.z = 1;
  };

  return (
    <div
      ref={componentRef}
      style={{
        height: window.innerHeight
      }}
    >
      <Canvas style={{ touchAction: "none" }}>
        <directionalLight intensity={0.5} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.9} />
        <Mesh componentRef={componentRef} meshRef={meshRef} />
      </Canvas>
      <button
        style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          top: "90%"
        }}
        onClick={restartPosition}
      >
        restart
      </button>
    </div>
  );
}

export default App;
