import * as React from 'react';
import { useRef, useState } from 'react';
import { Canvas, useThree, useRender, extend } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import useModelLoader from '../hooks/useModelLoader';
import useAnimationMixer from '../hooks/useAnimationMixer';

extend({ OrbitControls });


type PlayerProps = {
  type: 'gtlf' | 'obj';
  path: string;
  aspect: [number, number];
}

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
  progress,
}) => (
  <button
    style={{
      position: 'absolute',
      left: `calc(${progress}% - 4px)`,
      height: '100%',
      border: 'none',
      borderRadius: '3px',
      padding: 0,
      margin: 0,
      width: '8px',
      cursor: 'pointer',
    }}
  />
);

const PlayButton = ({
  isPlaying,
}) => (
  <button>
    <svg viewBox="0 0 16 16" background="transparent">
      {isPlaying ? (
        <path id="play-icon" d="M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28" />
      ) : (
        <path id="pause-icon" d="M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26" />
      )}
    </svg>
  </button>
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

      <SeekButton progress={progress} />
    </div>
  );
};

const Player = ({
  type,
  path,
  aspect,
  ...rest
}: PlayerProps) => {
  const {
    progress: loadingProgress,
    model,
    error
  } = useModelLoader(type, path);

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

      <div style={{ position: 'relative', paddingBottom: `${aspect[1] / aspect[0]}%`, width: '100%' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <Canvas {...rest}>
            <CameraControls
              enableDamping
              enablePan
              dampingFactor={0.1}
              rotateSpeed={0.1}
              maxPolarAngle={Math.PI / 2}
            />

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

Player.defaultProps = {
  aspect: [16, 9]
}

export default Player;
