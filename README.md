# react-three-player

A 3D model viewer for React (gtlf, obj, mtl, etc).

## API
`react-three-player` is meant to interface seamlessly with `three.js` model loaders  for loading 3D assets (`GTLFLoader`, `OBJLoader`, etc).

Additionally it supports animations via `THREE.AnimationMixer` if the model includes them.

```tsx
import ThreePlayer from 'react-three-player';

const loader = new THREE.GTLFLoader();
const modelPath = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf';

const App = () => (
  <ThreePlayer
    loader={loader}
    modelPath={modelPath}
  />
);
```

## Coming Soon

- [ ] Pause / play / loop controls for 3D animations
- [ ] Ability to seek to an animation time like in a video
- [ ] Better support for `OBJ` and switching out `.mtl` textures.
- [ ] Render props for headless component rendering (BYOS - bring your own styles)
