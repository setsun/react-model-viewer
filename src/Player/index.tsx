import * as React from 'react';
import { useRef, useState } from 'react';
import { Canvas, useThree, useRender, extend } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import useModelLoader from '../hooks/useModelLoader';
import useAnimationMixer from '../hooks/useAnimationMixer';

extend({ OrbitControls });

const ProgressBar = ({ progress, style }) => (
  <progress max={100} value={progress} style={{ display: 'block', ...style }} />
);

function CameraControls(props) {
  const controls = useRef();
  const { camera } = useThree();

  useRender(() => controls.current && controls.current.update(), false);

  return <orbitControls ref={controls} args={[camera]} {...props} />
}

const PlayControls = ({
  progress,
}) => {
  return (
    <div style={{ width: '100%', display: 'flex' }}>
      <ProgressBar progress={progress} style={{ width: '100%' }} />
    </div>
  );
}

const Player = ({
  loader,
  path,
}) => {
  const { progress: loadingProgress, model, error } = useModelLoader(loader, path);
  const { progress: animationProgress } = useAnimationMixer(model);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {loadingProgress > 100 && !error && (
        <ProgressBar progress={loadingProgress} style={{ position: 'absolute' }} />
      )}

      <Canvas camera={{position: [0, 0, 5]}}>
        <CameraControls enableDamping enablePan={false} dampingFactor={0.1} rotateSpeed={0.1} maxPolarAngle={Math.PI / 2} />

        <ambientLight intensity={0.5} />
        <spotLight intensity={0.8} position={[300, 300, 400]} />

        {model && <primitive object={model.scene} />}
      </Canvas>

      <PlayControls progress={animationProgress} />
    </div>
  );
}

export default Player;
