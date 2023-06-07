import { getShuffledNumbers, formatTime, saveResults } from './utils';
import { Tile } from './Tile';
import { PuzzleController } from './PuzzleController';
import { showCongratulationMessage, updateTimeText } from './domActions';

export class Puzzle {
  ctx;
  frameId;
  states;
  controller;

  constructor(initialStates, sounds) {
    const areaSize = 750;
    this.states = { ...initialStates, areaSize, isSoundOn: true, tiles: [], moves: 0, isStarted: false };

    const canvas = document.querySelector('.puzzle');
    canvas.width = areaSize;
    canvas.height = areaSize;

    this.ctx = canvas.getContext('2d');
    this.controller = new PuzzleController(canvas, this.states, sounds);
    this.prepare();
  }

  prepare = () => {
    const { size, areaSize, textColor } = this.states;
    const ids = getShuffledNumbers(size);
    const distance = areaSize / size;
    const tileSize = distance - 2;

    this.states.distance = distance;
    this.states.tileSize = tileSize;
    this.states.distancePerFrame = 60 - 4 * size;
    this.states.isWin = false;
    this.states.moves = 0;
    this.states.tiles = [];
    this.frameId = null;

    let index = 0;
    for (let column = 0; column < size; column++) {
      for (let row = 0; row < size; row++) {
        const x = distance * row + 1;
        const y = distance * column + 1;
        const id = ids[index];
        const position = index + 1;

        if (id !== 0) {
          this.states.tiles.push(new Tile({ tileSize, x, y, id, position, textColor }));
        } else {
          this.states.currentTile = new Tile({ tileSize, x, y, id, position, textColor });
        }

        index++;
      }
    }

    this.ctx.clearRect(0, 0, areaSize, areaSize);
    this.ctx.beginPath();
    this.ctx.font = `100px Audiowide`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = '#2f4f4f';
    this.ctx.fillText('Start', this.states.areaSize / 2, this.states.areaSize / 2);

    this.controller.update();
  };

  start = () => {
    this.states.isPaused = false;
    this.states.isStarted = true;
    this.states.startTime = Date.now();
    this.update();
  };

  restart = () => {
    this.stop();
    this.prepare();
    this.start();
  };

  continue = () => {
    this.states.isPaused = false;
    this.states.startTime = Date.now() - (this.states.timeDifference || 0);
    this.update();
  };

  update = () => {
    const { areaSize, color, tiles } = this.states;

    this.ctx.clearRect(0, 0, areaSize, areaSize);

    const { isWin, isStarted } = this.states;

    this.states.timeDifference = Date.now() - this.states.startTime;
    const time = formatTime(this.states.timeDifference);
    updateTimeText(time);

    this.controller.moveTile();

    if (isWin && isStarted) {
      const { size, moves, isSoundOn } = this.states;

      if (isSoundOn) {
        this.controller.winSound.play();
      }
      this.stop();
      showCongratulationMessage(size, time, moves);
      saveResults(size, moves, time);
    }
    tiles.forEach((tile) => tile.draw(this.ctx, color));

    if (this.states.isStarted) {
      this.frameId = requestAnimationFrame(this.update);
    }
  };

  pause = () => {
    this.states.isPaused = true;
    window.cancelAnimationFrame(this.frameId);
  };

  stop = () => {
    this.states.isStarted = false;
    window.cancelAnimationFrame(this.frameId);
  };
}
