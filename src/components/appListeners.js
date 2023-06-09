import {
  showResultsList,
  showConfigs,
  hideOverlay,
  changeStartButtonText,
  toggleSound,
  toggleTheme,
  updateMovesText,
  toggleFullScreenMode,
} from './domActions';
import { Tile } from './Tile';
import { getFromLS, saveToLS } from './utils';

export const addAppListeners = (puzzle) => {
  addCanvasClickHandler(puzzle);
  addStartButtonClickHandler(puzzle);
  addSaveButtonClickHandler(puzzle);
  addRestoreButtonClickHandler(puzzle);
  addConfigsButtonClickHandler(puzzle);
  addResultsButtonClickHandler(puzzle);
  addCloseButtonClickHandler(puzzle);
  addSoundStateButtonClickHandler(puzzle);
  addSizeChangeHandler(puzzle);
  addThemeStateButtonClickHandler(puzzle);
  addFullScreenButtonClickHandler();
};

const addCanvasClickHandler = (puzzle) => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.puzzle')) {
      if (!puzzle.states.isStarted && !puzzle.states.isWin) puzzle.start();
      else if (!puzzle.states.isStarted && puzzle.states.isWin) puzzle.restart();
      changeStartButtonText(puzzle.states.isStarted);
    }
  });
};

const addStartButtonClickHandler = (puzzle) => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.start-button')) {
      if (puzzle.states.isStarted) puzzle.restart();
      else puzzle.start();
      changeStartButtonText(puzzle.states.isStarted);
    }
  });
};

const addSaveButtonClickHandler = (puzzle) => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.save-button')) {
      if (puzzle.states.isStarted) saveToLS(puzzle.states, 'saved-game');
    }
  });
};

const addRestoreButtonClickHandler = (puzzle) => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.restore-button')) {
      const savedStates = getFromLS('saved-game', '{}');
      if (savedStates) {
        puzzle.pause();
        const tiles = savedStates.tiles.map((tile) => new Tile(tile));
        puzzle.states.tiles = tiles;
        puzzle.states.size = savedStates.size;
        puzzle.states.isStarted = savedStates.isStarted;
        puzzle.states.timeDifference = savedStates.timeDifference;
        puzzle.states.areaSize = savedStates.areaSize;
        puzzle.states.distance = savedStates.distance;
        puzzle.states.tileSize = savedStates.tileSize;
        puzzle.states.moves = savedStates.moves;
        puzzle.states.distancePerFrame = savedStates.distancePerFrame;
        updateMovesText(savedStates.moves);
        puzzle.continue();
      }
    }
  });
};

const addConfigsButtonClickHandler = (puzzle) => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.configs-button')) {
      puzzle.pause();
      showConfigs(puzzle.states);
    }
  });
};

const addResultsButtonClickHandler = (puzzle) => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.results-button')) {
      puzzle.pause();
      showResultsList(puzzle.states.size);
    }
  });
};

const addCloseButtonClickHandler = (puzzle) => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.close-button')) {
      const { isStarted, isPaused } = puzzle.states;
      if (isStarted && isPaused) puzzle.continue();
      hideOverlay();
    }
  });
};

const addSoundStateButtonClickHandler = (puzzle) => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.sound-state')) {
      toggleSound(puzzle.states);
    }
  });
};

const addSizeChangeHandler = (puzzle) => {
  document.addEventListener('change', (e) => {
    if (e.target.closest('.size-select')) {
      puzzle.states.size = +e.target.value;
      puzzle.states.isStarted = false;
      puzzle.states.isPaused = false;
      puzzle.prepare();
    }
  });
};

const addThemeStateButtonClickHandler = (puzzle) => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.theme-state')) {
      const theme = toggleTheme(puzzle.states);
      const isDarkTheme = theme === 'dark';
      puzzle.states.color = isDarkTheme ? '#a0522d' : '#d2691e';
      puzzle.states.textColor = isDarkTheme ? '#b1cab1' : '#f0fff0';
      puzzle.states.tiles.forEach((tile) => (tile.textColor = puzzle.states.textColor));
      saveToLS({ theme, color: puzzle.states.color, textColor: puzzle.states.textColor }, 'theme');
    }
  });
};

const addFullScreenButtonClickHandler = () => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.full-screen-state')) {
      toggleFullScreenMode();
    }
  });
};
