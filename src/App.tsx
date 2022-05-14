import React, { useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas } from 'react-three-fiber';
import Mesh from './Mesh';
import { OrbitControls } from 'drei/OrbitControls';
import { useGestures } from './lib/gestures';
import { Vector } from 'ts-matrix';

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
