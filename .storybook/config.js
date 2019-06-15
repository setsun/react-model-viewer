import { configure, addParameters, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { addReadme } from 'storybook-readme';
import { themes } from '@storybook/theming';

const req = require.context('../src', true, /.stories.tsx$/);

addParameters({
  info: {

  },
  options: {
    panelPosition: 'right',
    sidebarAnimations: false,
  }
});

addDecorator(withKnobs);
addDecorator(addReadme);

configure(() => {
  req.keys().forEach(filename => req(filename));
}, module);
