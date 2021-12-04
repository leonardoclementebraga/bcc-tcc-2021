import { ReactInstance } from 'react-360-web';
import BrowserInfoModule from './BrowserInfoModule';
import SimpleRaycaster from "simple-raycaster";

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent, {
    fullScreen: true,
    nativeModules: [
      ctx => new BrowserInfoModule(ctx),
    ],
    ...options,
  });

  r360.renderToSurface(
    r360.createRoot('readmeonly', {}),
    r360.getDefaultSurface(),
  );

  r360.controls.addRaycaster(SimpleRaycaster);
  r360.compositor.setCursorVisibility('visible');

  r360.compositor.setBackground('./static_assets/360_world.jpg');
}

window.React360 = { init };
