# react-model-viewer

A 3D model viewer & animation player for React.

Supports:
- GTLF, OBJ formats
- Loading progress bar for asset files
- Animation progress bar for 3D animations
- Orbit camera controls
- Play, pause, & seek controls
- Playback speed controls

### Install

```
npm i react-model-viewer
```

### Example
http://setsun.io/react-model-viewer/?path=/story/react-model-viewer--gtlf-animationmixer

(The example below can take a few seconds to load in Storybook, this will be optimized in the future)

![example](https://user-images.githubusercontent.com/4651424/58447820-b682f000-80d3-11e9-8ab8-ab1f97a3fc1f.gif)

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

- [ ] Loop controls
- [ ] Animation timestamps / frames
- [ ] Better support for `OBJ` and switching out `MTL` textures.
- [ ] Support for other loaders (`FBX`, `COLLADA`, etc.)
- [ ] Render props for headless component rendering (BYOS - bring your own styles)
