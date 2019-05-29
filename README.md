# react-three-player

A 3D model viewer & animation player for React.

Supports:
- GTLF, OBJ formats
- Loading progress bar for asset files
- Animation progress bar for 3D animations
- Orbit camera controls

### Install

```
npm i react-three-player
```

### Example
http://setsun.io/react-three-player/?path=/story/react-three-player--gtlf-animationmixer

(The example below can take a few seconds to load in Storybook, this will be optimized in the future)

![example](https://user-images.githubusercontent.com/4651424/58447820-b682f000-80d3-11e9-8ab8-ab1f97a3fc1f.gif)

### API
`react-three-player` is meant to interface seamlessly with `three.js` model loaders  for loading 3D assets (`GTLFLoader`, `OBJLoader`, etc).

Additionally it supports animations via `THREE.AnimationMixer` if the model includes them.

```tsx
import ThreePlayer from 'react-three-player';

const loader = new THREE.GTLFLoader();
const modelPath = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf';

const App = () => (
  <ThreePlayer loader={loader} path={modelPath} />
);
```

### Coming Soon

- [ ] Pause / play / loop controls for 3D animations
- [ ] Ability to seek to an animation time like in a video
- [ ] Better support for `OBJ` and switching out `MTL` textures.
- [ ] Support for other loaders (`FBX`, `COLLADA`, etc.)
- [ ] Render props for headless component rendering (BYOS - bring your own styles)
