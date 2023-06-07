import Audiowide from '../assets/fonts/Audiowide-Regular.woff2';
import moveSoundSrc from '../assets/audio/move-sound.m4a';
import winSoundSrc from '../assets/audio/win-sound.m4a';

import { Puzzle } from './Puzzle';
import { createSound } from './utils';
import { renderApp } from './appDom';
import { addAppListeners } from './appListeners';

const font = new FontFace('Audiowide', `url(${Audiowide})`);
const moveSound = createSound(moveSoundSrc);
const winSound = createSound(winSoundSrc);

const initialStates = {
  color: '#d2691e',
  size: 3,
};

export const start = () => {
  window.onload = () => {
    renderApp();

    font.load().then(() => {
      const puzzle = new Puzzle(initialStates, {
        moveSound,
        winSound,
      });
      addAppListeners(puzzle);
    });
  };
};
