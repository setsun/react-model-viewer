import * as React from 'react';
import { useRef, useState } from 'react';
import { Canvas, useThree, useRender, extend } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import useModelLoader from '../hooks/useModelLoader';
import useAnimationMixer from '../hooks/useAnimationMixer';

extend({ OrbitControls });

const ProgressBar = ({ progress, style, ...rest }) => (
  <progress max={100} value={progress} style={{ display: 'block', ...style }} {...rest} />
);

function CameraControls(props) {
  const controls = useRef();
  const { camera } = useThree();

  useRender(() => controls.current && controls.current.update(), false);

  return <orbitControls ref={controls} args={[camera]} {...props} />
}

const SeekButton = ({
  style,
}) => (
  <button
    style={{
      position: 'absolute',
      height: '100%',
      border: 'none',
      borderRadius: '3px',
      padding: 0,
      margin: 0,
      ...style
    }}
  />
);

const PlayControls = ({
  progress,
  isPlaying,
  isSeeking,
  onPlay,
  onPause,
  onSeek,
}) => {
  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex' }}>
      <ProgressBar
        progress={progress}
        style={{ width: '100%', cursor: 'pointer' }}
        onClick={(e) => {
          const left = e.currentTarget.getBoundingClientRect().left;
          const width = e.currentTarget.offsetWidth;
          const mouseX = e.clientX;
          const percent = ((mouseX - left) / width) * 100;

          // todo - finish seeking logic
          // onSeek(percent);
        }}
      />
      <SeekButton style={{ left: `calc(${progress}% - 4px)`, width: '8px', cursor: 'pointer' }}/>
    </div>
  );
};

const Player = ({
  loader,
  path,
  materialPaths,
  ...rest
}) => {
  const [materialPath, setMaterialPath] = useState(undefined);

  const {
    progress: loadingProgress,
    model,
    error
  } = useModelLoader(loader, path);

  const {
    progress: animationProgress,
    isPlaying,
    isSeeking,
    onPlay,
    onPause,
    onSeek,
  } = useAnimationMixer(model);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {loadingProgress < 100 && !error && (
        <ProgressBar progress={loadingProgress} style={{ position: 'absolute' }} />
      )}

      <div style={{ position: 'relative', paddingBottom: '56.25%', width: '100%' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <Canvas {...rest}>
            <CameraControls enableDamping enablePan={false} dampingFactor={0.1} rotateSpeed={0.1} maxPolarAngle={Math.PI / 2} />

            <ambientLight intensity={0.5} />
            <spotLight intensity={0.8} position={[300, 300, 400]} />

            {model && <primitive object={model.scene || model} />}
          </Canvas>
        </div>
      </div>

      <PlayControls
        progress={animationProgress}
        isPlaying={isPlaying}
        isSeeking={isSeeking}
        onPlay={onPlay}
        onPause={onPause}
        onSeek={onSeek}
      />
    </div>
  );
}

export default Player;
