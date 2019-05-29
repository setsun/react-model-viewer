import * as React from 'react';
import { storiesOf } from '@storybook/react';

import Player from '../'

storiesOf('react-three-player', module)
  .add('GTLF & AnimationMixer', () => (
    <Player
      type="gtlf"
      camera={{ position: [20, 20, 25] }}
      path={'https://raw.githubusercontent.com/Setsun/static-3d-assets/master/gtlf/pikmin/scene.gltf'}
    />
  ))
  // .add('Collada', () => (
  //   <Player
  //     type="collada"
  //     camera={{ position: [20, 20, 25] }}
  //     path={'https://raw.githubusercontent.com/Setsun/static-3d-assets/master/gtlf/pikmin/scene.gltf'}
  //   />
  // ))
  // .add('OBJ & MTL', () => (
  //   <Player
  //     type="obj"
  //     camera={{ position: [10, 10, 15] }}
  //     path={'https://raw.githubusercontent.com/Setsun/static-3d-assets/master/obj/aston/aston_vulcan.obj'}
  //     materialPaths={[
  //       'https://raw.githubusercontent.com/Setsun/static-3d-assets/master/obj/aston/aston_vulcan.mtl'
  //     ]}
  //   />
  // ))
