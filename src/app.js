import createMarkup from './markup';
import { initiatePlayer } from './player';

import './vimeo.css';
import './style.css';

function init() {
  createMarkup();
  initiatePlayer();
}

init();
