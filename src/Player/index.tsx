import * as React from 'react';
import { useRef, useState } from 'react';
import { Canvas, useThree, useRender, extend } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PlayCircle from 'react-feather/dist/icons/play-circle';
import PauseCircle from 'react-feather/dist/icons/pause-circle';
import PlusCircle from 'react-feather/dist/icons/plus-circle';
import MinusCircle from 'react-feather/dist/icons/minus-circle';
import Repeat from 'react-feather/dist/icons/repeat';

import useModelLoader from '../hooks/useModelLoader';
import useAnimationMixer from '../hooks/useAnimationMixer';

extend({ OrbitControls });

type PlayerProps = {
  type: 'gtlf' | 'obj' | 'fbx' | 'collada';
  path: string;
  aspect: [number, number];
  waypoints: [],
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
    {isPlaying ? (
      <PauseCircle />
    ) : (
      <PlayCircle />
    )}
  </button>
);

const SpeedControls = () => (
  <>
    <button>
      <MinusCircle />
    </button>
    <button>
      <PlusCircle />
    </button>
  </>
);

const LoopControls = () => (
  <button>
    <Repeat />
  </button>
);

const ControlBar = ({
  progress,
  isPlaying,
  onPlay,
  onPause,
  onSeek,
}) => {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <PlayButton isPlaying={isPlaying} />

      <div style={{ position: 'relative', width: '100%', display: 'flex' }}>
        <ProgressBar
          progress={progress}
          style={{ width: '100%', cursor: 'pointer' }}
          onClick={(e) => {
            const left = e.currentTarget.getBoundingClientRect().left;
            const width = e.currentTarget.offsetWidth;
            const mouseX = e.clientX;
            const percent = ((mouseX - left) / width) * 100;

            onSeek(percent);
          }}
        />

        <SeekButton progress={progress} />
      </div>
    </div>
  );
};

const Player = ({
  type,
  path,
  aspect,
  waypoints,
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
    onPlay,
    onPause,
    onSeek,
  } = useAnimationMixer(model);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {loadingProgress < 100 && !error && (
        <ProgressBar progress={loadingProgress} style={{ position: 'absolute' }} />
      )}

      <div style={{ position: 'relative', paddingBottom: `${(aspect[1] / aspect[0]) * 100}%`, width: '100%' }}>
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
            <spotLight intensity={0.8} position={[250, 250, -250]} />
            <spotLight intensity={0.8} position={[250, 250, 250]} />
            <spotLight intensity={0.8} position={[-250, 250, 250]} />

            {model && <primitive object={model.scene || model} />}
          </Canvas>
        </div>
      </div>

      <ControlBar
        progress={animationProgress}
        isPlaying={isPlaying}
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
