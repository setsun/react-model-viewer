import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { useState, useEffect, useMemo } from 'react';

type ModelData = {
  model: any,
  progress: number,
  error: any
};

const manager = new THREE.LoadingManager();

const getLoader = (type) => {
  switch (type) {
    case 'gtlf': {
      return new GLTFLoader(manager);
    }
    case 'obj': {
      return new OBJLoader(manager);
    }
    case 'fbx': {
      return new FBXLoader(manager);
    }
    case 'collada': {
      return new ColladaLoader(manager);
    }
  }
}

const useModelLoader = (type, path): ModelData => {
  const loader = useMemo(() => getLoader(type), [type]);

  const [model, setModel] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loader.load(
      // resource URL
      path,
      // called when the resource is loaded
      (model) => setModel(model),
      // called while loading is progressing
      ({ loaded, total }) => setProgress((loaded / total) * 100),
      // called when loading has errors
      (error) => setError(error)
    );
  }, [loader, path]);

  return { model, progress, error };
}

export default useModelLoader;
