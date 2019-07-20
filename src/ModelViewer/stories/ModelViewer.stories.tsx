import * as React from 'react';
import { array } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import ModelViewer from '..'

storiesOf('react-model-viewer', module)
  .add('GTLF & AnimationMixer', () => (
    <ModelViewer
      type="gtlf"
      aspect={array('aspect', [16, 9])}
      camera={{ position: [20, 20, 25] }}
      src="https://raw.githubusercontent.com/Setsun/static-3d-assets/master/gtlf/pikmin/scene.gltf"
    />
  ));
