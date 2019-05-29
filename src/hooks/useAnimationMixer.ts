import * as THREE from 'three';
import { useState, useEffect } from 'react';

const LoopMode = {
  once: THREE.LoopOnce,
  repeat: THREE.LoopRepeat,
  pingpong: THREE.LoopPingPong
};

const startAnimationLoop = (mixer, onUpdate) => {
  let lastTime = undefined;

  const tick = (timestamp) => {
    const delta = lastTime ? timestamp - lastTime : 0;

    // advance the animation-mixer timer
    mixer.update(delta / 1000);

    // recursively loop the animation
    requestAnimationFrame(tick);

    // set the time for the next animation tick
    lastTime = timestamp;

    // update callback
    onUpdate(delta);
  };

  requestAnimationFrame(tick);
}

const useCreateAnimationMixer = (model) => {
  const [mixer, setMixer] = useState(undefined);
  const [maxDuration, setMaxDuration] = useState(0);
  const [activeActions, setActiveActions] = useState([]);
  const clips = model && (model.animations || (model.geometry || {}).animations) || [];

  useEffect(() => {
    if (!model) return;

    const mixer = new THREE.AnimationMixer(model.scene);

    let maxDuration = 0;

    clips.forEach((clip) => {
      const action = mixer.clipAction(clip);

      maxDuration = Math.max(maxDuration, clip.duration * 1000);

      action.enabled = true;

      action
        .setLoop(LoopMode.repeat, Infinity)
        .fadeIn(0)
        .play();

      setActiveActions([...activeActions, action]);
    });

    setMixer(mixer);
    setMaxDuration(maxDuration);
  }, [model]);

  return { mixer, maxDuration, activeActions };
};

const useStartAnimationMixer = ({
  mixer,
  progress,
  maxDuration,
  isPlaying,
  setProgress,
}) => {
  useEffect(() => {
    if (!mixer) return;
    if (!isPlaying) return;

    let timeElapsed = progress * maxDuration;

    startAnimationLoop(mixer, (delta) => {
      timeElapsed += delta;
      timeElapsed = timeElapsed % maxDuration;
      setProgress((timeElapsed / maxDuration) * 100);
    });
  }, [mixer, isPlaying]);
}

const useTogglePlay = ({ mixer, isPlaying }) => {
  useEffect(() => {
    if (!mixer) return;

    mixer.timeScale = isPlaying ? 1 : 0;
  }, [mixer, isPlaying]);
};

const useChangeLoopMode = ({ mixer, loopMode }) => {
  useEffect(() => {
    // todo
  }, [mixer, loopMode]);
};

const useChangeTimeScale = ({ mixer, timeScale }) => {
  useEffect(() => {
    // todo
  }, [mixer, timeScale]);
};

const useChangeSeekTime = ({ mixer, progress, isPlaying }) => {
  useEffect(() => {
    if (!mixer) return;
    if (isPlaying) return;

    // todo
  }, [mixer, progress, isPlaying]);
}

const useAnimationMixer = (model) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [loopMode, setLoopMode] = useState(LoopMode.repeat);
  const [timeScale, setTimeScale] = useState(1);
  const [progress, setProgress] = useState(0);

  // initialize the animation mixer
  const { mixer, maxDuration, activeActions } = useCreateAnimationMixer(model);

  // start the animation / playing setup
  useStartAnimationMixer({
    mixer,
    isPlaying,
    progress,
    maxDuration,
    setProgress,
  });

  // play / pause
  useTogglePlay({ mixer, isPlaying });

  // seeking
  useChangeSeekTime({ mixer, progress, isPlaying });

  // change loop mode
  useChangeLoopMode({ mixer, loopMode });

  // change time scale
  useChangeTimeScale({ mixer, timeScale });

  return {
    progress,
    isPlaying,
    loopMode,
    timeScale,
    // set state callbacks
    onPlay: () => {
      setIsPlaying(true);
    },
    onPause: () => {
      setIsPlaying(false);
    },
    onSeek: (progress) => {
      setIsPlaying(false);
      setProgress(progress);
    },
    onChangeLoopMode: (value) => {
      setLoopMode(value);
    },
    onChangeTimeScale: (value) => {
      setTimeScale(value);
    }
  };
};

export default useAnimationMixer;
