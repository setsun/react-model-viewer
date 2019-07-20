import * as THREE from 'three';
import useModelLoader from '../hooks/useModelLoader';
import useAnimationMixer from '../hooks/useAnimationMixer';

type Props = {
  src: string;
  type: 'gtlf' | 'obj' | 'fbx' | 'collada';
  children?: Function;
};

const BaseModelViewer = ({ src, type, children }: Props) => {
  const {
    model,
    modelCenter,
    error: modelError,
    progress: modelProgress,
  } = useModelLoader(type, src);

  const {
    isPlaying,
    loopMode,
    timeScale,
    progress: animationProgress,
    play,
    pause,
    seek,
    setLoopMode,
    setTimeScale,
    setClipAction,
  } = useAnimationMixer(model);

  return children({
    model,
    modelCenter,
    modelProgress,
    modelError,
    isPlaying,
    loopMode,
    timeScale,
    animationProgress,
    play,
    pause,
    seek,
    setLoopMode,
    setTimeScale,
    setClipAction,
  });
};

export default BaseModelViewer;
