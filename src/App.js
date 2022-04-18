import { Canvas, extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import glsl from 'babel-plugin-glsl/macro';
import * as THREE from 'three';
import './App.css';

function App() {
  const WaveShaderMaterial = shaderMaterial(
    //unifom
    { uTime: 0, uColor: new THREE.Color(0.0, 0.0, 0.0) },
    // vertex
    glsl`
    precision mediump float;

    uniform float uTime;

    varying vec2 vUv;

    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

    void main(){
      vUv = uv;

      vec3 pos = position;
      float noiseFreq = 2.0;
      float noiseAmp = 1.25;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise3(noisePos) * noiseAmp;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,
    // fragment (pixel)
    glsl`
    precision mediump float;

    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUv;

    void main(){
      gl_FragColor = vec4(sin(vUv.x + uTime), 0.5, 0.1, 1.0);
    }`
  );

  extend({ WaveShaderMaterial });

  const Wave = () => {
    const materialRef = useRef();
    useFrame(
      ({ clock }) => (materialRef.current.uTime = clock.getElapsedTime())
    );

    return (
      <mesh>
        <planeBufferGeometry args={[0.4, 0.6, 20, 20]} />
        <waveShaderMaterial uColor="aqua" ref={materialRef} />
      </mesh>
    );
  };

  return (
    <div className="canvas-wrapper">
      <Canvas camera={{ fov: 10 }}>
        <Suspense fallback={null}>
          <Wave />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
