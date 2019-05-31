import * as React from 'react';
import { array } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import Player from '../'

storiesOf('react-three-player', module)
  .add('GTLF & AnimationMixer', () => (
    <Player
      type="gtlf"
      aspect={array('aspect', [16, 9])}
      camera={{ position: [20, 20, 25] }}
      path={'https://raw.githubusercontent.com/Setsun/static-3d-assets/master/gtlf/pikmin/scene.gltf'}
    />
  ))
  // .add('OBJ', () => (
  //   <Player
  //     type="obj"
  //     aspect={array('aspect', [16, 9])}
  //     camera={{ position: [30, 30, 50] }}
  //     path={'https://raw.githubusercontent.com/Setsun/static-3d-assets/master/obj/aston/aston_vulcan.obj'}
  //   />
  // ))
  // .add('FBX', () => (
  //   <Player
  //     type="fbx"
  //     aspect={array('aspect', [16, 9])}
  //     camera={{ position: [0, 0, 0] }}
  //     path={'https://raw.githubusercontent.com/Setsun/static-3d-assets/master/fbx/puppycat/source/Puppycat.fbx'}
  //   />
  // ))
