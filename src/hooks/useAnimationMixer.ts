import * as THREE from 'three';
import { useState, useEffect } from 'react';

const useAnimationMixer = (model) => {
  const [mixer, setMixer] = useState(undefined);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mixer = new THREE.AnimationMixer(model);

    mixer.addEventListener('loop', (threeEvent) => {
      const { action, loopDelta } = threeEvent;
      setProgress()
    });

    mixer.addEventListener('finished', (threeEvent) => {
      const { action, direction } = threeEvent;
      setProgress()
    });

    setMixer(mixer);
  }, [model]);

  return { mixer, progress };
};

export default useAnimationMixer;
