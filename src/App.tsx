import React, { useRef } from 'react';
import './App.css';
import { Canvas } from 'react-three-fiber';
import Mesh from './Mesh';

function App() {
  const componentRef = useRef(null);


  return (
    <div style={{
      height: window.innerHeight
    }}>
      <Canvas ref={componentRef} style={{ touchAction: 'none' }}>
        {/* <OrbitControls /> */}
        <directionalLight intensity={0.5} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.9} />
        <Mesh componentRef={componentRef} />
      </Canvas>
    </div>
  );
}

export default App;
