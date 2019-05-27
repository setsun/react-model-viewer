import * as THREE from 'three';
import * as React from 'react';
import { useRef } from 'react';
import { Canvas, useThree, useRender, extend } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import useModelLoader from '../hooks/useModelLoader';
import useAnimationMixer from '../hooks/useAnimationMixer';

extend({ OrbitControls });

function Controls(props) {
  const { camera } = useThree();
  const controls = useRef();
  useRender(() => controls.current && controls.current.update(), false);

  return <orbitControls ref={controls} args={[camera]} {...props} />
}

const ProgressBar = ({ progress }) => <progress max={100} value={progress} style={{ display: 'block' }} />

const Player = ({
  loader,
  path,
}) => {
  const { progress: loadingProgress, model, error } = useModelLoader(loader, path);
  const { progress: animationProgress } = useAnimationMixer(model);

  return (
    <>
      <Canvas camera={{position: [0, 0, 5]}}>
        <Controls enableDamping enablePan={false} dampingFactor={0.1} rotateSpeed={0.1} maxPolarAngle={Math.PI / 2} />

        <ambientLight intensity={0.5} />
        <spotLight intensity={0.8} position={[300, 300, 400]} />

        {model && <primitive object={model.scene} />}
      </Canvas>

      <ProgressBar progress={loadingProgress} />

      <ProgressBar progress={animationProgress} />
    </>
  );
}

export default Player;
