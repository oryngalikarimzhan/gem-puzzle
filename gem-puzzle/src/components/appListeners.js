import { showResultsList, showConfigs, hideOverlay, changeStartButtonText, toggleSound } from './domActions';

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

const addSaveButtonClickHandler = (/* puzzle */) => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.save-button')) {
      console.log('save');
    }
  });
};

const addRestoreButtonClickHandler = (/* puzzle */) => {
  // puzzle.start();
  document.addEventListener('click', (e) => {
    if (e.target.closest('.restore-button')) {
      console.log('restore');
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
      // else if (!isStarted && !isPaused) puzzle.start();
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
  // size = parseInt(elem.textContent);
  // document.querySelector('.current-size').classList.remove('current-size');
  // elem.classList.add('current-size');
};
