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
  const [clipActions, setClipActions] = useState([]);
  const clips = model && (model.animations || (model.geometry || {}).animations) || [];

  useEffect(() => {
    if (!model) return;

    const mixer = new THREE.AnimationMixer(model.scene);


    const actions = clips.map((clip) => {
      const action = mixer.clipAction(clip);

      action.enabled = true;

      return action;
    });

    setClipActions(actions);
    setMixer(mixer);
  }, [model]);

  return { mixer, clipActions };
};

const useStartAnimationMixer = ({
  mixer,
  progress,
  clipAction,
  timeScale,
  loopMode,
  isPlaying,
  setProgress,
}) => {
  useEffect(() => {
    if (!mixer) return;
    if (!clipAction) return;
    if (!isPlaying) return;

    const durationMs = clipAction._clip.duration * 1000;

    clipAction.timeScale = timeScale;

    clipAction
      .setLoop(loopMode, Infinity)
      .fadeIn(0)
      .play();

    let timeElapsed = progress * durationMs;

    startAnimationLoop(mixer, (delta) => {
      timeElapsed += delta;
      timeElapsed = timeElapsed % durationMs;
      setProgress((timeElapsed / durationMs) * 100);
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
  const { mixer, clipActions } = useCreateAnimationMixer(model);

  // start the animation / playing setup
  useStartAnimationMixer({
    mixer,
    isPlaying,
    progress,
    // todo - allow swapping active actions
    clipAction: clipActions[0],
    timeScale,
    loopMode,
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
