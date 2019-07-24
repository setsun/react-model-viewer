import * as React from 'react';
import { array } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import ModelViewer from '..'

storiesOf('react-model-viewer', module)
  .add('GTLF (Pikmin)', () => (
    <ModelViewer
      aspect={array('aspect', [16, 9])}
      camera={{ position: [20, 20, 25] }}
      type="gtlf"
      src="https://raw.githubusercontent.com/Setsun/static-3d-assets/master/gtlf/pikmin/scene.gltf"
    />
  ))
  .add('GTLF (Sonic)', () => (
    <ModelViewer
      aspect={array('aspect', [16, 9])}
      camera={{ position: [0.5, 0.5, 1.5] }}
      type="gtlf"
      src="https://raw.githubusercontent.com/Setsun/static-3d-assets/master/gtlf/sonic/scene.gltf"
    />
  ));
