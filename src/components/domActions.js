import { renderResults, renderMessage, renderConfigs } from './appDom';

export const showCongratulationMessage = (size, time, moves) => {
  showOverlay();
  document.querySelector('.popup-content').innerHTML = renderMessage(
    `Good Job!<br> You result in ${size}X${size} puzzle <br>Time: ${time}<br>Moves: ${moves} moves!`
  );
};

export const updateMovesText = (moves) => {
  document.querySelector('.moves span').innerHTML = moves;
};

export const updateTimeText = (time) => {
  const timeTextSpan = document.querySelector('.time span');
  if (timeTextSpan.textContent !== time) {
    timeTextSpan.innerHTML = time;
  }
};

export const changeStartButtonText = (isStarted) => {
  document.querySelector('.start-button').innerHTML = isStarted ? 'Restart' : 'Start';
};

export const showResultsList = (size) => {
  showOverlay();

  const popupContent = document.querySelector('.popup-content');
  const results = JSON.parse(window.localStorage.getItem('best-results') || '{}')[size] || [];

  const placeholder = { moves: '--', time: '--:--:--', date: '--.--.-- --:--' };
  if (results.length === 0) {
    popupContent.innerHTML = renderResults(Array.from({ length: 10 }, () => placeholder));
  } else {
    const rest = 10 - results.length;

    const placeholdersArray = Array.from({ length: rest }, () => placeholder);

    popupContent.innerHTML = renderResults(results.concat(placeholdersArray));
  }
};

export const showConfigs = (states) => {
  showOverlay();
  const { isSoundOn, theme, size } = states;
  const soundStateText = defineSoundStateText(isSoundOn);
  document.querySelector('.popup-content').innerHTML = renderConfigs(
    soundStateText,
    theme,
    size,
    defineFullScreenStateText(isInFullScreen())
  );
};

const defineSoundStateText = (isSoundOn) => (isSoundOn ? 'on' : 'off');

const showOverlay = () => document.querySelector('.overlay').classList.remove('hidden');

export const hideOverlay = () => document.querySelector('.overlay').classList.add('hidden');

export const toggleSound = (states) => {
  states.isSoundOn = !states.isSoundOn;
  document.querySelector('.sound-state').innerHTML = defineSoundStateText(states.isSoundOn);
};

export const toggleTheme = (states) => {
  states.theme = states.theme === 'dark' ? 'light' : 'dark';
  document.querySelector('.theme-state').innerHTML = states.theme;
  setTheme(states.theme);
  return states.theme;
};

export const setTheme = (theme) => document.documentElement.setAttribute('data-theme', theme);

const isInFullScreen = () => document.fullscreenElement && document.fullscreenElement !== null;
const defineFullScreenStateText = (isInFullScreen) => (isInFullScreen ? 'on' : 'off');

export const toggleFullScreenMode = () => {
  const result = isInFullScreen();
  const fullScreenStateText = defineFullScreenStateText(!result);

  document.querySelector('.full-screen-state').innerHTML = fullScreenStateText;

  if (!result) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
