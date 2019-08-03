import * as THREE from 'three';
import * as React from 'react';
import { useState, useRef } from 'react';
import { Canvas, useThree, useRender, extend } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PlayCircle from 'react-feather/dist/icons/play-circle';
import PauseCircle from 'react-feather/dist/icons/pause-circle';
import PlusCircle from 'react-feather/dist/icons/plus-circle';
import MinusCircle from 'react-feather/dist/icons/minus-circle';
import ChevronUp from 'react-feather/dist/icons/chevron-up';
import ChevronDown from 'react-feather/dist/icons/chevron-down';
import Repeat from 'react-feather/dist/icons/repeat';

import CoreModelViewer from '../core';
import { Container, Button, Progress } from './components';
import { ellipsis } from './styles';

extend({ OrbitControls });

type Props = {
  src: string;
  type: 'gtlf' | 'obj' | 'fbx' | 'collada';
  aspect?: [number, number];
};

function CameraControls(props) {
  const controls = useRef();
  const { camera } = useThree();

  useRender(() => controls.current && controls.current.update(), false);

  return <orbitControls ref={controls} args={[camera]} {...props} />;
}

const SeekButton = ({ progress }) => (
  <button
    style={{
      position: 'absolute',
      left: `calc(${progress}% - 4px)`,
      padding: 0,
      height: '100%',
      width: '8px',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
    }}
  />
);

const PlayButton = ({ playing, play, pause }) => (
  <Button onClick={playing ? pause : play}>
    {playing ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
  </Button>
);

const SpeedControls = ({ timeScale, setTimeScale }) => (
  <>
    <Button
      onClick={() => {
        setTimeScale(Math.max(0.25, timeScale - 0.25));
      }}
    >
      <MinusCircle size={16} />
    </Button>

    <Button
      onClick={() => {
        setTimeScale(Math.min(5, timeScale + 0.25));
      }}
    >
      <PlusCircle size={16} />
    </Button>
  </>
);

const LoopControls = ({ loopMode, setLoopMode }) => (
  <Button
    onClick={() => {
      const nextLoopMode = loopMode === THREE.LoopRepeat ? THREE.LoopOnce : THREE.LoopRepeat;
      setLoopMode(nextLoopMode);
    }}
  >
    <Repeat
      size={16}
      color={loopMode === THREE.LoopRepeat ? 'currentColor' : '#bebebe'}
    />
  </Button>
);

const ClipActionControls = ({ animations, animationIndex, setAnimationIndex }) => {
  const clipActionName = animations.length && animations[animationIndex]._clip.name;
  const [open, setOpen] = useState(false);

  return (
    <Container position="relative">
      {open && (
        <Container position="absolute" direction="column" justify="center" bottom={0} right={0} style={{ marginBottom: '32px', background: 'rgba(0, 0, 0, 0.5)', minHeight: '32px', padding: '4px' }}>
          {animations.map((clipAction, index) => (
            <Button
              onClick={() => {
                setAnimationIndex(index);
                setOpen(false);
              }}
            >
              {clipAction._clip.name}
            </Button>
          ))}
        </Container>
      )}

      <Button onClick={() => setOpen(!open)}>
        <span style={{ width: '64px', ...ellipsis }}>{clipActionName}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>
    </Container>
  )
};

const ControlBar = ({
  animations,
  animationIndex,
  progress,
  timeScale,
  loopMode,
  playing,
  play,
  pause,
  seek,
  setTimeScale,
  setLoopMode,
  setAnimationIndex
}) => (
  <Container width="100%" style={{ padding: '8px', background: 'rgba(0, 0, 0, 0.5)' }}>
    <PlayButton play={play} pause={pause} playing={playing} />

    <SpeedControls timeScale={timeScale} setTimeScale={setTimeScale} />

    <LoopControls loopMode={loopMode} setLoopMode={setLoopMode} />

    <ClipActionControls animations={animations} animationIndex={animationIndex} setAnimationIndex={setAnimationIndex} />

    <Container position="relative" width="100%" style={{ marginLeft: '8px' }}>
      <Progress
        progress={progress}
        style={{ width: '100%', cursor: 'pointer' }}
        onClick={e => {
          const left = e.currentTarget.getBoundingClientRect().left;
          const width = e.currentTarget.offsetWidth;
          const mouseX = e.clientX;
          const percent = ((mouseX - left) / width) * 100;

          seek(percent);
        }}
      />

      <SeekButton progress={progress} />
    </Container>
  </Container>
);

const ModelViewer = ({ src, type, aspect, ...rest }: Props) => (
  <CoreModelViewer src={src} type={type}>
    {({
      model,
      modelCenter,
      modelProgress,
      modelError,
      animations,
      animationIndex,
      playing,
      loopMode,
      timeScale,
      animationProgress,
      play,
      pause,
      seek,
      setLoopMode,
      setTimeScale,
      setAnimationIndex,
    }) => (
      <Container position="relative" align="center" direction="column" justify="center">
        {modelProgress < 100 && !modelError && (
          <Progress
            progress={modelProgress}
            style={{ position: 'absolute' }}
          />
        )}

        <Container
          position="relative"
          width="100%"
          style={{
            paddingBottom: `${(aspect[1] / aspect[0]) * 100}%`,
          }}
        >
          <Container
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
          >
            <Canvas {...rest}>
              <CameraControls
                camera={modelCenter}
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
          </Container>
        </Container>

        <ControlBar
          progress={animationProgress}
          playing={playing}
          animations={animations}
          animationIndex={animationIndex}
          setAnimationIndex={setAnimationIndex}
          loopMode={loopMode}
          setLoopMode={setLoopMode}
          timeScale={timeScale}
          setTimeScale={setTimeScale}
          play={play}
          pause={pause}
          seek={seek}
        />
      </Container>
    )}
  </CoreModelViewer>
);

ModelViewer.defaultProps = {
  aspect: [16, 9],
};

export default ModelViewer;
