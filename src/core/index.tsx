import useModelLoader from '../useModelLoader';
import useAnimationMixer from '../useAnimationMixer';

type Props = {
  src: string;
  type: 'gtlf' | 'obj' | 'fbx' | 'collada';
  children?: Function;
};

const CoreModelViewer = ({ src, type, children }: Props) => {
  const {
    model,
    modelCenter,
    error: modelError,
    progress: modelProgress,
  } = useModelLoader(type, src);

  const {
    animations,
    animationIndex,
    playing,
    loopMode,
    timeScale,
    progress: animationProgress,
    play,
    pause,
    seek,
    setLoopMode,
    setTimeScale,
    setAnimationIndex,
  } = useAnimationMixer(model);

  return children({
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
  });
};

export default CoreModelViewer;
