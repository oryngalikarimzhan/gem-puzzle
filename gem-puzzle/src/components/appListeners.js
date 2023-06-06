import { renderConfigs } from './appDom';

export const addAppListeners = (puzzle) => {
  addStartButtonListener(puzzle);
  addSaveButtonListener(puzzle);
  addRestoreButtonListener(puzzle);
  addConfigsButtonListener(puzzle);
  addResultsButtonListener(puzzle);
  addCloseButtonListener();
};

const addStartButtonListener = (puzzle) => {
  document.addEventListener('click', (e) => {
    const target = e.target;
    const closest = target.closest('.start-button');

    if (closest) {
      puzzle.start();
    }
  });
};

const addSaveButtonListener = (/* puzzle */) => {
  document.addEventListener('click', (e) => {
    const target = e.target;
    const closest = target.closest('.save-button');

    if (closest) {
      console.log('save');
    }
  });
};
const addRestoreButtonListener = (/* puzzle */) => {
  document.addEventListener('click', (e) => {
    const target = e.target;
    const closest = target.closest('.restore-button');

    if (closest) {
      console.log('restore');
    }
  });
};

const addConfigsButtonListener = (/* puzzle */) => {
  document.addEventListener('click', (e) => {
    const target = e.target;
    const closest = target.closest('.configs-button');

    if (closest) {
      document.querySelector('.overlay').classList.remove('hidden');
      document.querySelector('.popup-content').innerHTML = renderConfigs();
    }
  });
};

const addResultsButtonListener = () => {
  document.addEventListener('click', (e) => {
    const target = e.target;
    const closest = target.closest('.results-button');

    if (closest) {
      console.log('results');
    }
  });
};

const addCloseButtonListener = () => {
  document.addEventListener('click', (e) => {
    const target = e.target;
    const closest = target.closest('.close-button');

    if (closest) {
      document.querySelector('.overlay').classList.add('hidden');
    }
  });
};
