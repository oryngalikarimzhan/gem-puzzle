/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable radix */

import {
  isWin, isStarted, distance, myDB, tiles, moves, seconds, minutes, hours,
  resetStats, initGame, updateTime, updateMoves, defineSpeed, updateGameArea,
  setMoves, setTimes, setDistance, addTile, doStarted
} from '../index';
import { Component } from './Component';
import { puzzle } from './puzzle';

export let tileColor = 'rgb(0, 0, 0)';
export let areaSize;
export let size = 3;
export let soundIsOn = true;

let screenWidth = window.innerWidth;

export function addColorChangeEventHandler() {
  document.querySelectorAll('.color').forEach(el => {
    el.addEventListener('click', () => {
      tileColor = getComputedStyle(el).getPropertyValue('background-color');
      document.querySelector('.current-color').classList.remove('current-color');
      el.classList.add('current-color');
    });
  });
}

export function addSizeChangeEventHandler() {
  document.querySelectorAll('.size').forEach(el => {
    el.addEventListener('click', () => {
      size = parseInt(el.textContent);
      document.querySelector('.current-size').classList.remove('current-size');
      el.classList.add('current-size');
      resetStats();
      doStarted(false);
      initGame();
    });
  });
}

export function continueSavedGame() {
  let savedGame = JSON.parse(myDB.getItem('savedGame'));
  if (savedGame !== null) {
    resetStats();
    setTimes(savedGame.seconds, savedGame.minutes, savedGame.hours);
    setMoves(savedGame.moves);
    size = savedGame.size;
    if (areaSize === savedGame.areaSize) setDistance(savedGame.areaSize / savedGame.size);
    else setDistance(areaSize / savedGame.size);
    updateTime();
    updateMoves();
    savedGame.tiles.forEach(tile => {
      if (areaSize === savedGame.areaSize) {
        addTile(new Component(tile.width, tile.x, tile.y, tile.id, tile.position, tile.moveable, tile.direction));
      } else {
        addTile(new Component(areaSize / size - 2, distance * parseInt(tile.x / (savedGame.areaSize / savedGame.size)) + 1, distance * parseInt(tile.y / (savedGame.areaSize / savedGame.size)) + 1, tile.id, tile.position, tile.moveable, tile.direction));
      }
    });
    document.querySelector('.current-size').classList.remove('current-size');
    Array.from(document.querySelectorAll('.size')).find(el => parseInt(el.textContent) === size).classList.add('current-size');
    if (!isStarted) {
      doStarted(true);
      document.querySelector('.start').textContent = 'Restart';
    }
    defineSpeed();
    puzzle.start(updateGameArea, updateTime);
  }
}

export function showResultsList() {
  puzzle.pause();
  document.querySelector('.overlay').classList.remove('hidden');
  Array.from(document.querySelector('.overlay').children).forEach(child => {
    if (!child.classList.contains('hidden')) child.classList.add('hidden');
  });
  document.querySelector('.overlay__button').classList.remove('hidden');
  document.querySelector('.results').classList.remove('hidden');
  let results = JSON.parse(myDB.getItem('bestResults')).find(obj => obj.size === size).results;
  let resultMoves = document.querySelectorAll('.result-moves');
  let resultTimes = document.querySelectorAll('.result-time');
  let resultDates = document.querySelectorAll('.result-date');
  resultMoves.forEach(el => {
    el.textContent = '--';
  });
  resultTimes.forEach(el => {
    el.textContent = '--:--:--';
  });
  resultDates.forEach(el => {
    el.textContent = '--.--.-- --:--';
  });

  for (let i = 0; i < results.length; i++) {
    resultMoves[i].textContent = results[i].moves;
    resultTimes[i].textContent = results[i].time;
    resultDates[i].textContent = results[i].date;
  }
}

export function saveCurrentGame() {
  if (!isWin()) {
    myDB.setItem('savedGame', JSON.stringify({
      tiles, moves, seconds, minutes, hours, areaSize, size
    }));
  }
}

export function toggleSound() {
  if (soundIsOn) {
    soundIsOn = false;
    document.querySelector('.sound-state').textContent = 'Off';
  } else {
    soundIsOn = true;
    document.querySelector('.sound-state').textContent = 'On';
  }
}

export function removeScreenOverlay() {
  document.querySelector('.overlay').classList.add('hidden');
  if (!isWin()) puzzle.continue(updateTime);
}

export function showConfigMenu() {
  puzzle.pause();
  document.querySelector('.overlay').classList.remove('hidden');
  Array.from(document.querySelector('.overlay').children).forEach(child => {
    if (!child.classList.contains('hidden')) child.classList.add('hidden');
  });
  document.querySelector('.overlay__button').classList.remove('hidden');
  document.querySelector('.sound').classList.remove('hidden');
  document.querySelector('.colors').classList.remove('hidden');
  document.querySelector('.sizes').classList.remove('hidden');
}

export function defineAreaSize() {
  if (screenWidth >= 1280 && areaSize !== 900) {
    areaSize = 900;
    resetStats();
    doStarted(false);
    initGame();
  } else if (screenWidth >= 768 && screenWidth < 1280 && areaSize !== 700) {
    areaSize = 700;
    resetStats();
    doStarted(false);
    initGame();
  } else if (screenWidth < 768 && areaSize !== 300) {
    areaSize = 300;
    resetStats();
    doStarted(false);
    initGame();
  }
}

export function addScreenResizeHandler() {
  window.addEventListener('resize', () => {
    screenWidth = window.innerWidth;
    defineAreaSize();
  });
}