import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Player from '../'

storiesOf('react-three-player', module)
  .add('GTLF & AnimationMixer', () => (
    <Player
      loader={new GLTFLoader()}
      path={'https://raw.githubusercontent.com/Setsun/static-3d-assets/master/gtlf/pikmin/scene.gltf'}
    />
  ))
