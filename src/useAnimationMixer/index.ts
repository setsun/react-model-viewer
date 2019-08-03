import * as THREE from 'three';
import { useState, useEffect } from 'react';

const LoopMode = {
  once: THREE.LoopOnce,
  repeat: THREE.LoopRepeat,
};

let ANIMATION_REQUEST_ID = undefined;

function setAnimationTime(
  mixer: THREE.AnimationMixer,
  animation: THREE.AnimationAction,
  progress: number
) {
  const duration = (animation as any)._clip.duration;
  const seekTime = (duration * (progress / 100));

  // set the active animation and mixer time to 0 to reset,
  // then update the time using AnimationMixer#update
  animation.paused = false;
  animation.enabled = true;
  animation.time = 0;
  mixer.time = 0;
  mixer.update(seekTime);
};

function startAnimationLoop (
  mixer: THREE.AnimationMixer,
  animation: THREE.AnimationAction,
  setPlaying: Function,
  setProgress: Function,
) {
  let lastTime = 0;

  const tick = (timestamp) => {
    // if the animation is no longer playing, then cancel loop
    if (animation.paused) {
      setPlaying(false);
      setProgress(0);
      lastTime = 0;
      return;
    }

    const delta = lastTime ? timestamp - lastTime : 0;

    // advance the animation-mixer timer
    mixer.update(delta / 1000);

    // set the time for the next animation tick
    lastTime = timestamp;

    // calculate and set the progress
    const duration = (animation as any)._clip.duration;
    const elapsedDuration = (mixer.time % duration);
    const progress = (elapsedDuration / duration) * 100;
    setProgress(progress);

    // request the next frame
    ANIMATION_REQUEST_ID = requestAnimationFrame(tick);
  };

  // kick off the animation loop
  ANIMATION_REQUEST_ID = requestAnimationFrame(tick);
};

function stopAnimationLoop() {
  cancelAnimationFrame(ANIMATION_REQUEST_ID);
  ANIMATION_REQUEST_ID = undefined;
}

function useCreateAnimationMixer(model): [THREE.AnimationMixer, THREE.AnimationAction[]] {
  const clips = model && (model.animations || (model.geometry || {}).animations) || [];
  const [mixer, setMixer] = useState<THREE.AnimationMixer>(undefined);
  const [animations, setAnimations] = useState<THREE.AnimationAction[]>([]);

  useEffect(() => {
    if (!model) return;

    const mixer = new THREE.AnimationMixer(model.scene);

    const animations = clips.map((clip) => {
      const animation = mixer.clipAction(clip);
      animation.clampWhenFinished = true;
      animation.enabled = true;
      return animation;
    });

    setMixer(mixer);
    setAnimations(animations);
  }, [model]);

  return [mixer, animations];
};

const useStartAnimation = ({
  mixer,
  progress,
  animation,
  timeScale,
  loopMode,
  playing,
  setProgress,
  setPlaying,
}) => {
  useEffect(() => {
    if (!mixer || !animation || !playing) return;

    // stop any active animations
    stopAnimationLoop();
    mixer.stopAllAction();

    // set an initial seek time
    setAnimationTime(mixer, animation, progress);

    // configure the animation before starting the loop
    animation
      .setEffectiveTimeScale(timeScale)
      .setLoop(loopMode, Infinity)
      .fadeIn(0)
      .play();

    // kick off the loop
    startAnimationLoop(mixer, animation, setPlaying, setProgress);

    // cleanup step, when effect unmounts
    return () => {
      stopAnimationLoop();
    }
  }, [mixer, playing, animation]);
}

const useAnimationMixer = (model) => {
  const [playing, setPlaying] = useState(true);
  const [loopMode, setLoopMode] = useState(LoopMode.repeat);
  const [timeScale, setTimeScale] = useState(1);
  const [progress, setProgress] = useState(0);
  const [animationIndex, setAnimationIndex] = useState(0);

  // initialize the animation mixer
  const [mixer, animations] = useCreateAnimationMixer(model);
  const animation = animations[animationIndex];

  // start/restart the animation
  useStartAnimation({
    mixer,
    progress,
    animation,
    playing,
    loopMode,
    timeScale,
    setProgress,
    setPlaying,
  });

  // change loop mode
  useEffect(() => {
    if (animation) animation.setLoop(loopMode, Infinity);
  }, [animation, loopMode]);

  // change time scale
  useEffect(() => {
    if (mixer) mixer.timeScale = timeScale;
  }, [mixer, timeScale]);

  return {
    progress,
    loopMode,
    setLoopMode,
    timeScale,
    setTimeScale,
    animations,
    animationIndex,
    setAnimationIndex: (index) => {
      stopAnimationLoop();
      setProgress(0);
      setAnimationTime(mixer, animation, 0);
      setAnimationIndex(index);
    },
    playing,
    // set state callbacks
    play: () => {
      setPlaying(true);
    },
    pause: () => {
      stopAnimationLoop();
      setPlaying(false);
    },
    seek: (progress) => {
      stopAnimationLoop();
      setPlaying(false);
      setProgress(progress);
      setAnimationTime(mixer, animation, progress);
    },
  };
};

export default useAnimationMixer;
