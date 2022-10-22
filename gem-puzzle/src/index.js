/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-loop-func */
/* eslint-disable no-shadow */
/* eslint-disable new-cap */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */

import './styles/style.css';
import { Component } from './js/Component';
import { Sound } from './js/Sound';
import { puzzle } from './js/puzzle';
import {
  tileColor, areaSize, size, soundIsOn,
  addColorChangeEventHandler, addSizeChangeEventHandler, continueSavedGame,
  showResultsList, saveCurrentGame, toggleSound, removeScreenOverlay, showConfigMenu,
  addScreenResizeHandler, defineAreaSize
} from './js/events';
import { createInitialDom } from './js/elements';
import moveSound from './assets/audio/change-position.m4a';
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

myDB.setItem('bestResults', JSON.stringify([
  { size: 3, results: [] },
  { size: 4, results: [] },
  { size: 5, results: [] },
  { size: 6, results: [] },
  { size: 7, results: [] },
  { size: 8, results: [] }
]));

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
};

export function initGame() {
  puzzle.build(areaSize);
  if (isStarted) {
    prepareTiles();
    defineSpeed();
    puzzle.start(updateGameArea, updateTime);
    document.querySelector('.start').textContent = 'Restart';
  } else {
    showGreetingText();
  }
}

function startNewGame() {
  resetStats();
  doStarted(true);
  initGame();
}

export function resetStats() {
  puzzle.stop();
  tiles = [];
  setTimes(0, 0, 0);
  setMoves(0);
  updateMoves();
  updateTime();
}

function showGreetingText() {
  new Component(0, areaSize / 3.7, areaSize / 2.6, 'START', 0, false, '').update(tileColor, areaSize, size);
  addGameAreaClickHandler();
  // addTileDragAndDropHandler();
}

function addGameAreaClickHandler() {
  document.querySelector('canvas').addEventListener('click', (e) => {
    let x = e.offsetX;
    let y = e.offsetY;
    if (!isStarted && x >= areaSize / 3
        && x <= areaSize * 0.7
        && y >= areaSize / 2.2
        && y <= areaSize / 1.8) {
      setTimeout(startNewGame, 100);
    } else {
      puzzle.x = e.offsetX;
      puzzle.y = e.offsetY;
    }
    defineCurrentTile();
  });
}

// function addTileDragAndDropHandler() {
//   document.querySelector('canvas').addEventListener('mousedown', (e) => {
//     puzzle.x = e.offsetX;
//     puzzle.y = e.offsetY;
//     for (let i = 0; i < tiles.length; i++) {
//       if (tiles[i].x <= puzzle.x
//           && tiles[i].x + distance - 2 >= puzzle.x
//           && tiles[i].y <= puzzle.y
//           && tiles[i].y + distance - 2 >= puzzle.y) {
//         if (tiles[i].moveable) {
//           currentTile = tiles[i];
//           document.querySelector('canvas').addEventListener('mousemove', (e) => {
//             console.log(e.offsetX, e.offsetY);
//           });
//         }
//       }
//     }
//   });
// }

function prepareTiles() {
  let ids = getShuffledNumbers();
  let positions = new Array(size * size);
  distance = areaSize / size;
  let index = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i !== size - 1 || j !== size - 1) {
        if ((j === size - 1 && i === size - 2)) {
          tiles.push(new Component(areaSize / size - 2, distance * j + 1, distance * i + 1, ids[index], positions[index] = 1 + index++, true, 'down'));
        } else if (j === size - 2 && i === size - 1) {
          tiles.push(new Component(areaSize / size - 2, distance * j + 1, distance * i + 1, ids[index], positions[index] = 1 + index++, true, 'right'));
        } else {
          tiles.push(new Component(areaSize / size - 2, distance * j + 1, distance * i + 1, ids[index], positions[index] = 1 + index++, false, ''));
        }
      }
    }
  }
}

function getShuffledNumbers() {
  let ids = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
  while (true) {
    ids = ids.sort(() => Math.random() - 0.5);
    if (isSolvable(ids)) break;
  }
  return ids;
}

function isSolvable(ids) {
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

function defineCurrentTile() {
  if (puzzle.x && puzzle.y) {
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i].x <= puzzle.x
          && tiles[i].x + distance - 2 >= puzzle.x
          && tiles[i].y <= puzzle.y
          && tiles[i].y + distance - 2 >= puzzle.y) {
        if (tiles[i].moveable) {
          if (soundIsOn) mySound.play();
          currentTile = tiles[i];
          let tempDirection = currentTile.direction;
          tiles.forEach(tile => {
            tile.moveable = false;
            tile.direction = '';
          });
          currentTile.direction = tempDirection;
        }
      }
    }
  }
  puzzle.x = null;
  puzzle.y = null;
}

export function updateGameArea() {
  puzzle.clear();
  moveTile();
}

function showCongratulationMessage() {
  let overlay = document.querySelector('.overlay');
  if (soundIsOn) new Sound(winSound).play();
  overlay.classList.remove('hidden');
  Array.from(overlay.children).forEach(child => {
    if (!child.classList.contains('hidden')) child.classList.add('hidden');
  });
  document.querySelector('.overlay__button').classList.remove('hidden');
  document.querySelector('.overlay__message').classList.remove('hidden');
  document.querySelector('.congratulation-message').textContent = `Good Job! You solved the ${size}X${size} puzzle in ${timeText} and ${moves} moves!`;
}

function saveResult() {
  let allBestResults = JSON.parse(myDB.getItem('bestResults'));
  let bestResultsBySize = allBestResults.find(obj => obj.size === size);
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

function moveTile() {
  if (isWin()) {
    puzzle.stop();
    showCongratulationMessage();
    saveResult();
  }
  if (currentTile && distance > 0) {
    if (currentTile.direction === 'left') {
      if (distance < speed) currentTile.x -= distance;
      else currentTile.x -= speed;
    } else if (currentTile.direction === 'right') {
      if (distance < speed) currentTile.x += distance;
      else currentTile.x += speed;
    } else if (currentTile.direction === 'down') {
      if (distance < speed) currentTile.y += distance;
      else currentTile.y += speed;
    } else if (currentTile.direction === 'up') {
      if (distance < speed) currentTile.y -= distance;
      else currentTile.y -= speed;
    }
    distance -= speed;

    if (distance <= 0) {
      endMove();
    }
  }
  tiles.forEach(tile => tile.update(tileColor, areaSize, size));
}

function endMove() {
  updateNeighbors();
  currentTile.moveable = true;
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
  currentTile = null;
  distance = areaSize / size;
  moves++;
  updateMoves();
  mySound.reload();
}

function updateNeighbors() {
  tiles.forEach(tile => {
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
  timeText = `${('' + hours).length === 1 ? '0' + hours : hours}:${('' + minutes).length === 1 ? '0' + minutes : minutes}:${('' + seconds).length === 1 ? '0' + seconds : seconds}`;
  document.querySelector('.time').textContent = `Time: ${timeText}`;
  seconds++;
}

export function isWin() {
  return tiles.every(tile => tile.position === tile.id);
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
