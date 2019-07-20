import * as THREE from 'three';
import { useState, useEffect } from 'react';

const LoopMode = {
  once: THREE.LoopOnce,
  repeat: THREE.LoopRepeat,
};

let GLOBAL_IS_PLAYING = true;

const startAnimationLoop = (mixer, onUpdate) => {
  let lastTime = 0;

  const tick = (timestamp) => {
    // if the player is no longer playing, then cancel loop
    if (!GLOBAL_IS_PLAYING) {
      lastTime = 0;
      return;
    }

    const delta = lastTime ? timestamp - lastTime : 0;

    // advance the animation-mixer timer
    mixer.update(delta / 1000);

    // recursively loop the animation
    requestAnimationFrame(tick);

    // set the time for the next animation tick
    lastTime = timestamp;

    // update callback
    onUpdate();
  };

  requestAnimationFrame(tick);
};

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

    clipAction.timeScale = timeScale;

    clipAction
      .setLoop(loopMode, Infinity)
      .fadeIn(0)
      .play();

    startAnimationLoop(mixer, () => {
      const duration = clipAction._clip.duration;
      const elapsedDuration = (mixer.time % duration);
      const progress = (elapsedDuration / duration) * 100;

      setProgress(progress);
    });
  }, [mixer, isPlaying]);
}

const useChangeLoopMode = ({ clipAction, loopMode }) => {
  useEffect(() => {
    if (!clipAction) return;

    clipAction.setLoop(loopMode, Infinity);
  }, [clipAction, loopMode]);
};

const useChangeTimeScale = ({ mixer, timeScale }) => {
  useEffect(() => {
    if (!mixer) return;

    mixer.timeScale = timeScale;
  }, [mixer, timeScale]);
};

const useChangeClipAction = ({ mixer, clipActions, clipActionIndex }) => {
  useEffect(() => {
    if (!mixer) return;
  });
};

const useAnimationMixer = (model) => {
  const [isPlaying, setIsPlayingState] = useState(GLOBAL_IS_PLAYING);
  const [loopMode, setLoopMode] = useState(LoopMode.repeat);
  const [timeScale, setTimeScale] = useState(1);
  const [progress, setProgress] = useState(0);
  const [clipActionIndex, setClipAction] = useState(0);

  // initialize the animation mixer
  const { mixer, clipActions } = useCreateAnimationMixer(model);
  const clipAction = clipActions[clipActionIndex];

  // helper to sync global / useState values
  const setIsPlaying = (value) => {
    GLOBAL_IS_PLAYING = value;
    setIsPlayingState(value);
  }

  // start the animation / playing setup
  useStartAnimationMixer({
    mixer,
    clipAction,
    isPlaying,
    loopMode,
    timeScale,
    progress,
    setProgress,
  });

  // change loop mode
  useChangeLoopMode({ clipAction, loopMode });

  // change time scale
  useChangeTimeScale({ mixer, timeScale });

  // change clip action
  useChangeClipAction({ mixer, clipActions, clipActionIndex })

  return {
    progress,
    loopMode,
    timeScale,
    isPlaying,
    // set state callbacks
    play: () => {
      setIsPlaying(true);
    },
    pause: () => {
      setIsPlaying(false);
    },
    seek: (progress) => {
      setIsPlaying(false);

      setProgress(progress);

      const duration = clipAction._clip.duration;
      const seekTime = (duration * (progress / 100));

      // set the active clipAction and mixer time to 0 to reset,
      // then update the time using AnimationMixer#update
      clipAction.time = 0;
      mixer.time = 0;
      mixer.update(seekTime);
    },
    setClipAction,
    setLoopMode,
    setTimeScale,
  };
};

export default useAnimationMixer;
