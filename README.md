# react-model-viewer

A 3D model viewer & animation player for React.

Supports:
- GTLF, OBJ formats
- Loading progress bar for asset files
- Animation progress bar for 3D animations
- Animation clip selection
- Orbit camera controls
- Play, pause, seek, & loop controls
- Playback speed controls

### Install
```
# main package
npm i react-model-viewer

# peer dependencies
npm i react react-dom three
```

Bundle size: https://bundlephobia.com/result?p=react-model-viewer

### Example
http://setsun.github.io/react-model-viewer/?path=/story/react-model-viewer--gtlf-sonic

![example](https://user-images.githubusercontent.com/4651424/61834820-64e2b180-ae47-11e9-85d4-cd69d02b7dd6.gif)

### API
`react-model-viewer` is meant to interface seamlessly with `three.js` model loaders  for loading 3D assets (`GTLFLoader`, `OBJLoader`, etc).

Additionally it supports animations via `THREE.AnimationMixer` if the model includes them.

```tsx
import ModelViewer from 'react-model-viewer';

const modelPath = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf';

const App = () => (
  <ModelViewer type="gtlf" src={modelPath} />
);
```

### Coming Soon

- [ ] Animation timestamps / frames
- [ ] Better support for `OBJ` and switching out `MTL` textures.
- [ ] Support for other loaders (`FBX`, `COLLADA`, etc.)
- [ ] Render props for headless component rendering (BYOS - bring your own styles)
