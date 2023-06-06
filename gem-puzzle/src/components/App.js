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
const storage = window.localStorage;

storage.setItem(
  'best-results',
  JSON.stringify([
    { size: 3, results: [] },
    { size: 4, results: [] },
    { size: 5, results: [] },
    { size: 6, results: [] },
    { size: 7, results: [] },
    { size: 8, results: [] },
  ])
);

const initialConfigs = {
  color: 'chocolate',
  size: 3,
  sounds: {
    moveSound,
    winSound,
  },
};

export const start = () => {
  window.onload = () => {
    renderApp();

    font.load().then(() => {
      const puzzle = new Puzzle(initialConfigs);
      puzzle.build();
      addAppListeners(puzzle);
      puzzle.prepare();
      puzzle.start();
    });
  };
};
