import { useState, useEffect } from 'react';

type ModelData = {
  model: any,
  progress: number,
  error: any
};

const useModelLoader = (loader, path): ModelData => {
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
