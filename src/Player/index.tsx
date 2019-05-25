import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as React from 'react';
import { useState, useMemo, useLayoutEffect } from 'react';
import { Canvas, useThree } from 'react-three-fiber';

const Model = ({
  path,
  loader,
  onLoadingUpdate,
  onAnimationUpdate,
  onError
}) => {
  const { scene } = useThree();

  useLayoutEffect(() => {
    // Load a glTF resource
    loader.load(
      // resource URL
      path,
      // called when the resource is loaded
      function (model) {
        scene.add(model.scene);

        model.animations; // Array<THREE.AnimationClip>
        model.scene; // THREE.Scene
        model.scenes; // Array<THREE.Scene>
        model.cameras; // Array<THREE.Camera>
        model.asset; // Object
      },
      // called while loading is progressing
      function (res) {
        const percentage = (res.loaded / res.total * 100);
        onLoadingUpdate(percentage);
      },
      // called when loading has errors
      function (error) {
        console.log( 'An error happened' );
        onError(error);
      }
    );
  });

  return null;
}
const Player = () => {
  // Instantiate a loader
  const loader = GLTFLoader();
  const [error, setError] = useState(undefined);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);

  return (
    <div>
      <Canvas>
        <Model
          path={'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Duck/glTF/duck.gtlf'}
          loader={loader}
          onError={(value) => setError(value)}
          onLoadingUpdate={(value) => setLoadingProgress(value)}
          onAnimationUpdate={(value) => setAnimationProgress(value)}
        />
      </Canvas>

      <progress max={100} value={loadingProgress} />

      <progress max={100} value={animationProgress} />
    </div>
  );
}

export default Player;
