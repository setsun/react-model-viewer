import * as THREE from 'three';
import { useState, useEffect } from 'react';

const LoopMode = {
  once: THREE.LoopOnce,
  repeat: THREE.LoopRepeat,
  pingpong: THREE.LoopPingPong
};

const data = {
  clip: '*',
  duration: 0,
  clampWhenFinished: false,
  crossFadeDuration: 0,
  loop: 'repeat',
  repetitions: Infinity,
  timeScale: 1,
}

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

const useAnimationMixer = (model) => {
  const [mixer, setMixer] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [activeActions, setActiveActions] = useState([]);
  const [maxDuration, setMaxDuration] = useState(0);
  const clips = model && (model.animations || (model.geometry || {}).animations) || [];

  // initialize the animation mixer
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

  // start the animation
  useEffect(() => {
    if (!mixer) return;

    let timeElapsed = 0;

    startAnimationLoop(mixer, (delta) => {
      timeElapsed += delta;
      const timestamp = timeElapsed % maxDuration;
      const progress = (timestamp / maxDuration) * 100;

      setProgress(progress);
    });

    // event listeners
    mixer.addEventListener('loop', (threeEvent) => {});
    mixer.addEventListener('finished', (threeEvent) => {});
  }, [mixer]);

  return { mixer, progress };
};

export default useAnimationMixer;
