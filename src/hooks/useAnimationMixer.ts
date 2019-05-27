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

const startAnimation = (mixer, onUpdate) => {
  let lastTime = undefined;

  const tick = (timestamp) => {
    const delta = lastTime ? timestamp - lastTime : 0;
    lastTime = timestamp;

    mixer.update(delta / 1000);

    onUpdate(delta);

    // loop the animation
    requestAnimationFrame(tick);
  };

  return requestAnimationFrame(tick);
}

const useAnimationMixer = (model) => {
  const [mixer, setMixer] = useState(undefined);
  const [progress, setProgress] = useState(0);
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
      action.clampWhenFinished = false;

      // action.setDuration(data.duration);
      // action.setEffectiveTimeScale(data.timeScale);

      action
        .setLoop(LoopMode.repeat, Infinity)
        .fadeIn(0)
        .play();

      setActiveActions([...activeActions, action]);
    });


    let timeElapsed = 0;
    const animation = startAnimation(mixer, (delta) => {
      timeElapsed += delta;
      const timestamp = timeElapsed % maxDuration;
      const progress = (timestamp / maxDuration) * 100;

      setProgress(progress);
    });

    mixer.addEventListener('loop', (threeEvent) => {
      console.log(threeEvent);
    });

    mixer.addEventListener('finished', (threeEvent) => {
      cancelAnimationFrame(animation);
    });

    setMixer(mixer);
  }, [model]);

  return { mixer, progress };
};

export default useAnimationMixer;
