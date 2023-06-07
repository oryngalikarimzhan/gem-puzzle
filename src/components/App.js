import Audiowide from '../assets/fonts/Audiowide-Regular.woff2';
import moveSoundSrc from '../assets/audio/move-sound-1.mp4';
import winSoundSrc from '../assets/audio/win-sound.m4a';

import { Puzzle } from './Puzzle';
import { Sound } from './Sound';
import { getFromLS } from './utils';
import { renderApp } from './appDom';
import { setTheme } from './domActions';
import { addAppListeners } from './appListeners';

const font = new FontFace('Audiowide', `url(${Audiowide})`);
const moveSound = new Sound(moveSoundSrc);
const winSound = new Sound(winSoundSrc);

const savedTheme = getFromLS('theme', '{}');

const initialStates = {
  color: '#d2691e',
  size: 3,
  theme: 'light',
  textColor: '#f0fff0',
  ...savedTheme,
};

export const start = () => {
  setTheme(initialStates.theme);
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
