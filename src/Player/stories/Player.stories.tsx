import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import Player from '../'

storiesOf('react-three-player', module)
  .add('GTLF & AnimationMixer', () => (
    <Player
      loader={new GLTFLoader()}
      camera={{ position: [20, 20, 25] }}
      path={'https://raw.githubusercontent.com/Setsun/static-3d-assets/master/gtlf/pikmin/scene.gltf'}
    />
  ))
  // .add('OBJ & MTL', () => (
  //   <Player
  //     loader={new OBJLoader()}
  //     camera={{ position: [10, 10, 15] }}
  //     path={'https://raw.githubusercontent.com/Setsun/static-3d-assets/master/obj/aston/aston_vulcan.obj'}
  //     materialPaths={[
  //       'https://raw.githubusercontent.com/Setsun/static-3d-assets/master/obj/aston/aston_vulcan.mtl'
  //     ]}
  //   />
  // ))
