import './styles/style.scss';
import { Component } from './js/Component';
import { Sound } from './js/Sound';
import { puzzle } from './js/puzzle';
import {
  tileColor,
  areaSize,
  size,
  soundIsOn,
  addColorChangeEventHandler,
  addSizeChangeEventHandler,
  continueSavedGame,
  showResultsList,
  saveCurrentGame,
  toggleSound,
  removeScreenOverlay,
  showConfigMenu,
  addScreenResizeHandler,
  defineAreaSize,
} from './js/events';
import { createInitialDom } from './js/elements';
import moveSound from './assets/audio/change-position-0.m4a';
import winSound from './assets/audio/win-sound.m4a';

export let isStarted = false;
export let tiles = [];
export let distance;
export const myDB = window.localStorage;
export let moves = 0;
export let seconds = 0;
export let minutes = 0;
export let hours = 0;

let timeText = '';
let mySound = new Sound(moveSound);
let speed;
let currentTile;
let initialPosition;
let toForward = true;
let isEnding = false;
let positionChanged = false;
let destination;
let tempDistance;
let isEnabled = true;
let isHorizontal = true;

myDB.setItem(
  'bestResults',
  JSON.stringify([
    { size: 3, results: [] },
    { size: 4, results: [] },
    { size: 5, results: [] },
    { size: 6, results: [] },
    { size: 7, results: [] },
    { size: 8, results: [] },
  ])
);

window.onload = () => {
  createInitialDom();
  addScreenResizeHandler();
  defineAreaSize();
  document.querySelector('.start').onclick = () => startNewGame();
  document.querySelector('.configs').onclick = () => showConfigMenu();
  document.querySelector('.results-button').onclick = () => showResultsList();
  document.querySelector('.close-button').onclick = () => removeScreenOverlay();
  document.querySelector('.sound-state').onclick = () => toggleSound();
  document.querySelector('.save-button').onclick = () => saveCurrentGame();
  document.querySelector('.saved-game-button').onclick = () => continueSavedGame();
  addColorChangeEventHandler();
  addSizeChangeEventHandler();
  addGameAreaClickStarter();
};

export function initGame() {
  puzzle.build(areaSize);
  if (isStarted) {
    prepareTiles();
    defineSpeed();
    addTilesController();
    puzzle.start(updateGameArea, updateTime);
    document.querySelector('.start').textContent = 'Restart';
  } else {
    new Component(0, areaSize / 3.7, areaSize / 2.6, 'START', 0, false, '').update(tileColor, areaSize, size);
  }
}

function startNewGame() {
  resetStats();
  new Component(0, areaSize / 5.5, areaSize / 2.6, 'NEW GAME', 0, false, '').update(tileColor, areaSize, size);
  doStarted(true);
  setTimeout(initGame, 800);
}

export function resetStats() {
  puzzle.stop();
  tiles = [];
  setTimes(0, 0, 0);
  setMoves(0);
  updateMoves();
  updateTime();
}

function addGameAreaClickStarter() {
  document.querySelector('canvas').addEventListener('click', (e) => {
    let x = e.offsetX;
    let y = e.offsetY;
    if (!isStarted && x >= areaSize / 3 && x <= areaSize * 0.7 && y >= areaSize / 2.2 && y <= areaSize / 1.8) {
      setTimeout(startNewGame, 100);
    }
  });
}

function prepareTiles() {
  let ids = getShuffledNumbers();
  let positions = new Array(size * size);
  distance = areaSize / size;
  let index = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i !== size - 1 || j !== size - 1) {
        if (j === size - 1 && i === size - 2) {
          tiles.push(
            new Component(
              areaSize / size - 2,
              distance * j + 1,
              distance * i + 1,
              ids[index],
              (positions[index] = 1 + index++),
              true,
              'down'
            )
          );
        } else if (j === size - 2 && i === size - 1) {
          tiles.push(
            new Component(
              areaSize / size - 2,
              distance * j + 1,
              distance * i + 1,
              ids[index],
              (positions[index] = 1 + index++),
              true,
              'right'
            )
          );
        } else {
          tiles.push(
            new Component(
              areaSize / size - 2,
              distance * j + 1,
              distance * i + 1,
              ids[index],
              (positions[index] = 1 + index++),
              false,
              ''
            )
          );
        }
      }
    }
  }
}

function getShuffledNumbers() {
  let ids = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
  let isSolvable = false;
  while (!isSolvable) {
    ids = ids.sort(() => Math.random() - 0.5);
    isSolvable = canSolve(ids);
  }
  return ids;
}

function canSolve(ids) {
  let inversionCounter = 0;
  for (let i = 0; i < ids.length - 1; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      if (ids[i] > ids[j]) inversionCounter++;
    }
  }
  if (inversionCounter % 2 === 0) {
    return true;
  }
  return false;
}

export function defineSpeed() {
  if (areaSize === 300 && size >= 5) speed = 5;
  else if ((size >= 7 && areaSize >= 700) || (areaSize === 300 && size < 5)) speed = 10;
  else if (size <= 4 && areaSize >= 700) speed = 30;
  else speed = 20;
}

export function updateGameArea() {
  puzzle.clear();
  moveTile();
}

function showCongratulationMessage() {
  let overlay = document.querySelector('.overlay');
  if (soundIsOn) new Sound(winSound).play();
  overlay.classList.remove('hidden');
  Array.from(overlay.children).forEach((child) => {
    if (!child.classList.contains('hidden')) child.classList.add('hidden');
  });
  document.querySelector('.overlay__button').classList.remove('hidden');
  document.querySelector('.overlay__message').classList.remove('hidden');
  document.querySelector(
    '.congratulation-message'
  ).textContent = `Good Job! You solved the ${size}X${size} puzzle in ${timeText} and ${moves} moves!`;
}

function saveResult() {
  let allBestResults = JSON.parse(myDB.getItem('bestResults'));
  let bestResultsBySize = allBestResults.find((obj) => obj.size === size);
  let results = bestResultsBySize.results;
  let currentDate = new Date();
  let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(currentDate).slice(2);
  let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(currentDate);
  let date = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(currentDate);
  let hour = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: false }).format(currentDate);
  let minute = new Intl.DateTimeFormat('ru', { minute: '2-digit' }).format(currentDate);
  let result = { moves, time: timeText, date: `${date}.${month}.${year} ${hour}:${minute}` };
  results.push(result);
  results.sort((a, b) => a.moves - b.moves);
  if (results.length > 10) {
    results.pop();
  }
  bestResultsBySize.results = results;
  for (let resultObj of allBestResults) {
    if (resultObj.size === size) {
      resultObj = bestResultsBySize;
      break;
    }
  }
  myDB.setItem('bestResults', JSON.stringify(allBestResults));
}

export function addTilesController() {
  let canvas = document.querySelector('canvas');
  canvas.addEventListener('mousedown', (e) => {
    if (isEnabled) {
      puzzle.x = e.offsetX;
      puzzle.y = e.offsetY;
      for (let i = 0; i < tiles.length; i++) {
        if (
          tiles[i].x <= puzzle.x &&
          tiles[i].x + distance - 2 >= puzzle.x &&
          tiles[i].y <= puzzle.y &&
          tiles[i].y + distance - 2 >= puzzle.y
        ) {
          if (tiles[i].moveable) {
            isEnabled = false;
            if (soundIsOn) mySound.play();
            currentTile = tiles[i];
            if (tiles[i].direction === 'up' || tiles[i].direction === 'down') {
              isHorizontal = false;
              initialPosition = currentTile.y;
            } else if (tiles[i].direction === 'right' || tiles[i].direction === 'left') {
              isHorizontal = true;
              initialPosition = currentTile.x;
            }
            canvas.addEventListener('mousemove', mouseMoveControl);
            canvas.addEventListener('mouseup', dropControl);
          }
        }
      }
    }
  });
}

function mouseMoveControl(e) {
  let step;
  let beforeStep;
  let difference;
  if (isHorizontal) {
    step = e.offsetX - puzzle.x;
    beforeStep = currentTile.x;
    if (currentTile.direction === 'right' && step >= 0 && step <= distance) {
      currentTile.x = initialPosition + step;
      difference = currentTile.x - beforeStep;
      if (difference !== 0) {
        toForward = difference > 0;
      }
    } else if (currentTile.direction === 'left' && step >= -distance && step <= 0) {
      currentTile.x = initialPosition + step;
      difference = currentTile.x - beforeStep;
      if (difference !== 0) {
        toForward = difference < 0;
      }
    }
  } else {
    step = e.offsetY - puzzle.y;
    beforeStep = currentTile.y;
    if (currentTile.direction === 'down' && step > 0 && step <= distance) {
      currentTile.y = initialPosition + step;
      difference = currentTile.y - beforeStep;
      if (difference !== 0) {
        toForward = difference > 0;
      }
    } else if (currentTile.direction === 'up' && step >= -distance && step < 0) {
      currentTile.y = initialPosition + step;
      difference = currentTile.y - beforeStep;
      if (difference !== 0) {
        toForward = difference < 0;
      }
    }
  }
}

function dropControl() {
  let canvas = document.querySelector('canvas');
  canvas.removeEventListener('mousemove', mouseMoveControl);
  if (currentTile) {
    if (toForward) {
      positionChanged = true;
      if (currentTile.direction === 'right' || currentTile.direction === 'down') {
        destination = initialPosition + distance;
        tempDistance = isHorizontal ? destination - currentTile.x : destination - currentTile.y;
      } else if (currentTile.direction === 'left' || currentTile.direction === 'up') {
        destination = initialPosition - distance;
        tempDistance = isHorizontal ? currentTile.x - destination : currentTile.y - destination;
      }
    } else {
      positionChanged = false;
      destination = initialPosition;
      if (currentTile.direction === 'right' || currentTile.direction === 'down') {
        tempDistance = isHorizontal ? currentTile.x - destination : currentTile.y - destination;
      } else if (currentTile.direction === 'left' || currentTile.direction === 'up') {
        tempDistance = isHorizontal ? destination - currentTile.x : destination - currentTile.y;
      }
    }
    isEnding = true;
  }
}

function moveTile() {
  if (isWin() && isStarted) {
    puzzle.stop();
    showCongratulationMessage();
    saveResult();
  }

  if (isEnding) {
    if (currentTile.direction === 'right') {
      if (toForward) {
        tempDistance < speed ? (currentTile.x += tempDistance) : (currentTile.x += speed);
      } else {
        tempDistance < speed ? (currentTile.x -= tempDistance) : (currentTile.x -= speed);
      }
    } else if (currentTile.direction === 'left') {
      if (toForward) {
        tempDistance < speed ? (currentTile.x -= tempDistance) : (currentTile.x -= speed);
      } else {
        tempDistance < speed ? (currentTile.x += tempDistance) : (currentTile.x += speed);
      }
    } else if (currentTile.direction === 'down') {
      if (toForward) {
        tempDistance < speed ? (currentTile.y += tempDistance) : (currentTile.y += speed);
      } else {
        tempDistance < speed ? (currentTile.y -= tempDistance) : (currentTile.y -= speed);
      }
    } else if (currentTile.direction === 'up') {
      if (toForward) {
        tempDistance < speed ? (currentTile.y -= tempDistance) : (currentTile.y -= speed);
      } else {
        tempDistance < speed ? (currentTile.y += tempDistance) : (currentTile.y += speed);
      }
    }

    tempDistance -= speed;

    if (tempDistance <= 0) {
      endMove();
    }
  }
  tiles.forEach((tile) => tile.update(tileColor, areaSize, size));
}

function endMove() {
  if (positionChanged) {
    let tempDirection = currentTile.direction;
    tiles.forEach((tile) => {
      tile.moveable = false;
      tile.direction = '';
    });
    updateNeighbors();
    currentTile.direction = tempDirection;
    currentTile.moveable = true;
    updateOwnPosition();
    moves++;
    updateMoves();
  }
  isEnabled = true;
  currentTile = null;
  puzzle.x = null;
  puzzle.y = null;
  isEnding = false;
  mySound.reload();
  toForward = true;
}

function updateOwnPosition() {
  if (currentTile.direction === 'left') {
    currentTile.direction = 'right';
    currentTile.position -= 1;
  } else if (currentTile.direction === 'right') {
    currentTile.direction = 'left';
    currentTile.position += 1;
  } else if (currentTile.direction === 'down') {
    currentTile.direction = 'up';
    currentTile.position += size;
  } else if (currentTile.direction === 'up') {
    currentTile.direction = 'down';
    currentTile.position -= size;
  }
}

function updateNeighbors() {
  tiles.forEach((tile) => {
    if (tile.position === currentTile.position - size) {
      tile.moveable = true;
      tile.direction = 'down';
    }
    if (tile.position === currentTile.position + size) {
      tile.moveable = true;
      tile.direction = 'up';
    }
    if (tile.position === currentTile.position - 1 && tile.position % size !== 0) {
      tile.moveable = true;
      tile.direction = 'right';
    }
    if (tile.position === currentTile.position + 1 && tile.position % size !== 1) {
      tile.moveable = true;
      tile.direction = 'left';
    }
  });
}

export function updateMoves() {
  document.querySelector('.moves').textContent = `Moves: ${moves}`;
}

export function updateTime() {
  if (seconds === 60) {
    seconds = 0;
    minutes++;
    if (minutes === 60) {
      minutes = 0;
      hours++;
    }
  }
  timeText = `${('' + hours).length === 1 ? '0' + hours : hours}:${
    ('' + minutes).length === 1 ? '0' + minutes : minutes
  }:${('' + seconds).length === 1 ? '0' + seconds : seconds}`;
  document.querySelector('.time').textContent = `Time: ${timeText}`;
  seconds++;
}

export function isWin() {
  return tiles.length !== 0 ? tiles.every((tile) => tile.position === tile.id) : false;
}
export function setTimes(newSeconds, newMinutes, newHours) {
  seconds = newSeconds;
  minutes = newMinutes;
  hours = newHours;
}
export function setMoves(newMoves) {
  moves = newMoves;
}
export function setDistance(newDistance) {
  distance = newDistance;
}
export function addTile(tile) {
  tiles.push(tile);
}
export function doStarted(state) {
  isStarted = state;
}
