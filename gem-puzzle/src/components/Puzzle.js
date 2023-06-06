import { getShuffledNumbers } from './utils';
import { Tile } from './Tile';

export class Puzzle {
  canvas;
  ctx;
  areaSize = 750;
  isGameStarted = false;
  isSoundOn = true;
  rect;
  scale;

  color = 'chocolate';
  size = 4;
  tiles = [];
  distancePerFrame = 25;
  distance;
  tileSize;

  currentTile;
  mouseX;
  mouseY;
  distanceToMove;

  isEnabled = true;
  isHorizontalMove;
  startPosition;

  isToForward = true;
  isPositionChanged = false;
  isMoveEnding = false;
  moves = 0;

  constructor({ color, size, sounds: { moveSound, winSound } }) {
    this.color = color;
    this.size = size;
    this.moveSound = moveSound;
    this.winSound = winSound;
  }

  build = () => {
    this.canvas = document.querySelector('.puzzle');
    this.canvas.width = this.areaSize;
    this.canvas.height = this.areaSize;
    this.ctx = this.canvas.getContext('2d');

    const handleCanvasReSize = () => {
      this.rect = this.canvas.getBoundingClientRect();
      const actual = this.canvas.clientWidth;
      this.scale = this.areaSize / actual;
    };

    handleCanvasReSize();
    window.addEventListener('resize', handleCanvasReSize);

    document.addEventListener('mousedown', (event) => {
      this.mouseX = (event.clientX - this.rect.left) * this.scale;
      this.mouseY = (event.clientY - this.rect.top) * this.scale;

      const matchedTile = this.tiles.find((tile) => {
        return (
          tile.x <= this.mouseX &&
          tile.x + this.tileSize >= this.mouseX &&
          tile.y <= this.mouseY &&
          tile.y + this.tileSize >= this.mouseY &&
          tile.moveable
        );
      });

      if (matchedTile) {
        this.moveSound.play();
        this.isEnabled = false;
        this.currentTile = matchedTile;

        if (matchedTile.direction === 'up' || matchedTile.direction === 'down') {
          this.isHorizontalMove = false;
          this.startPosition = matchedTile.y;
        } else if (matchedTile.direction === 'right' || matchedTile.direction === 'left') {
          this.isHorizontalMove = true;
          this.startPosition = matchedTile.x;
        }
      }
    });

    document.addEventListener('mousemove', (event) => {
      if (!this.isEnabled && !this.isMoveEnding) {
        let step;
        let beforeStep;
        let difference;

        if (this.isHorizontalMove) {
          beforeStep = this.currentTile.x;
          step = (event.clientX - this.rect.left) * this.scale - this.mouseX;
        } else {
          beforeStep = this.currentTile.y;
          step = (event.clientY - this.rect.top) * this.scale - this.mouseY;
        }

        switch (this.currentTile.direction) {
          case 'right':
            if (step >= 0 && step <= this.distance) {
              this.currentTile.x = this.startPosition + step;
              difference = this.currentTile.x - beforeStep;

              if (difference !== 0) {
                this.isToForward = difference > 0;
              }
            }
            break;

          case 'left':
            if (step >= -this.distance && step <= 0) {
              this.currentTile.x = this.startPosition + step;
              difference = this.currentTile.x - beforeStep;

              if (difference !== 0) {
                this.isToForward = difference < 0;
              }
            }
            break;

          case 'down':
            if (step > 0 && step <= this.distance) {
              this.currentTile.y = this.startPosition + step;
              difference = this.currentTile.y - beforeStep;

              if (difference !== 0) {
                this.isToForward = difference > 0;
              }
            }
            break;

          case 'up':
            if (step >= -this.distance && step < 0) {
              this.currentTile.y = this.startPosition + step;
              difference = this.currentTile.y - beforeStep;

              if (difference !== 0) {
                this.isToForward = difference < 0;
              }
            }
            break;
        }
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.currentTile) {
        this.isPositionChanged = this.isToForward;
        const tileDirection = this.currentTile.direction;

        const ascending = tileDirection === 'right' || tileDirection === 'down';
        const descending = tileDirection === 'left' || tileDirection === 'up';
        let delta = true;

        let destination;
        if (this.isToForward) {
          if (ascending) {
            destination = this.startPosition + this.distance;
          } else if (descending) {
            destination = this.startPosition - this.distance;
            delta = false;
          }
        } else {
          destination = this.startPosition;

          if (ascending) {
            delta = false;
          }
        }

        const currentPosition = this.isHorizontalMove ? this.currentTile.x : this.currentTile.y;
        this.distanceToMove = delta ? destination - currentPosition : currentPosition - destination;

        this.isMoveEnding = true;
      }
    });
  };

  prepare = () => {
    const ids = getShuffledNumbers(this.size);
    this.distance = this.areaSize / this.size;
    this.tileSize = this.distance - 2;
    let index = 0;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const x = this.distance * j + 1;
        const y = this.distance * i + 1;
        const id = ids[index];
        const position = index + 1;

        if (id !== 0) {
          this.tiles.push(new Tile(this.tileSize, x, y, id, position));
        } else {
          this.currentTile = new Tile(this.tileSize, x, y, id, position);
        }

        index++;
      }
    }
    updateNeighbors(this);
    updateOwnPosition(this);
    this.currentTile = null;
  };

  start = () => {
    this.winSound.load();
    this.isGameStarted = true;
    this.update();
  };

  update = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    moveTile(this);
    this.tiles.forEach((tile) => tile.draw(this.ctx, this.color));
    this.frameId = requestAnimationFrame(this.update);
  };

  stop = () => {
    this.isGameStarted = false;
    window.cancelAnimationFrame(this.frameId);
  };
}

function moveTile(puzzle) {
  if (isWin(puzzle.tiles) && this.isGameStarted) {
    puzzle.stop();
    showCongratulationMessage();
    // saveResult();
  }

  if (puzzle.isMoveEnding) {
    const tile = puzzle.currentTile;
    const distancePerFrame = puzzle.distancePerFrame;

    let delta = 0;
    const isLastDistance = puzzle.distanceToMove < distancePerFrame;

    if (puzzle.isToForward) {
      delta = isLastDistance ? puzzle.distanceToMove : distancePerFrame;
    } else {
      delta = isLastDistance ? -puzzle.distanceToMove : -distancePerFrame;
    }

    switch (tile.direction) {
      case 'right':
        tile.x += delta;
        break;
      case 'left':
        tile.x -= delta;
        break;
      case 'down':
        tile.y += delta;
        break;
      case 'up':
        tile.y -= delta;
        break;
    }

    puzzle.distanceToMove -= Math.abs(delta);

    if (puzzle.distanceToMove <= 0) {
      endMove(puzzle);
    }
  }
}

function endMove(puzzle) {
  const { currentTile, isPositionChanged } = puzzle;
  if (isPositionChanged) {
    let tempDirection = currentTile.direction;

    puzzle.tiles.forEach((tile) => {
      tile.moveable = false;
      tile.direction = '';
    });

    updateNeighbors(puzzle);
    currentTile.direction = tempDirection;
    currentTile.moveable = true;
    updateOwnPosition(puzzle);
    puzzle.moves++;
    // updateMoves(puzzle.moves);
  }

  puzzle.moveSound.load();
  puzzle.currentTile = null;
  puzzle.mouseX = null;
  puzzle.mouseY = null;
  puzzle.isToForward = true;
  puzzle.isMoveEnding = false;
  puzzle.isEnabled = true;
}

function isWin(tiles) {
  return tiles.length !== 0 ? tiles.every((tile) => tile.position === tile.id) : false;
}

function updateNeighbors(puzzle) {
  const { currentTile, size, tiles } = puzzle;

  tiles.forEach((tile) => {
    const tilePosition = tile.position;

    if (tilePosition === currentTile.position - size) {
      tile.moveable = true;
      tile.direction = 'down';
    }

    if (tilePosition === currentTile.position + size) {
      tile.moveable = true;
      tile.direction = 'up';
    }

    if (tilePosition === currentTile.position - 1 && tilePosition % size !== 0) {
      tile.moveable = true;
      tile.direction = 'right';
    }

    if (tilePosition === currentTile.position + 1 && tilePosition % size !== 1) {
      tile.moveable = true;
      tile.direction = 'left';
    }
  });
}

function updateOwnPosition(puzzle) {
  const { currentTile, size } = puzzle;

  switch (currentTile.direction) {
    case 'left': {
      currentTile.direction = 'right';
      currentTile.position -= 1;
      break;
    }
    case 'right': {
      currentTile.direction = 'left';
      currentTile.position += 1;
      break;
    }
    case 'down': {
      currentTile.direction = 'up';
      currentTile.position += size;
      break;
    }
    case 'up': {
      currentTile.direction = 'down';
      currentTile.position -= size;
      break;
    }
  }
}

function showCongratulationMessage(puzzle) {
  if (puzzle.isSoundOn) {
    puzzle.winSound.play();
  }
  // let overlay = document.querySelector('.overlay');
  // overlay.classList.remove('hidden');
  // Array.from(overlay.children).forEach((child) => {
  //   if (!child.classList.contains('hidden')) child.classList.add('hidden');
  // });
  // document.querySelector('.overlay__button').classList.remove('hidden');
  // document.querySelector('.overlay__message').classList.remove('hidden');
  // document.querySelector(
  //   '.congratulation-message'
  // ).textContent = `Good Job! You solved the ${size}X${size} puzzle in ${timeText} and ${moves} moves!`;
}

// function saveResult(puzzle) {
//   const allBestResults = JSON.parse(storage.getItem('best=results'));

//   const bestResultsBySize = allBestResults.find((item) => item.size === puzzle.size);
//   const { results } = bestResultsBySize;
//   const currentDate = new Date();

//   const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(currentDate).slice(2);
//   const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(currentDate);
//   const date = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(currentDate);
//   const hour = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: false }).format(currentDate);
//   const minute = new Intl.DateTimeFormat('ru', { minute: '2-digit' }).format(currentDate);

//   const result = {
//     moves: puzzle.moves,
//     time: /* timeText */ 'TODO',
//     date: `${date}.${month}.${year} ${hour}:${minute}`,
//   };

//   results.push(result);
//   results.sort((a, b) => a.moves - b.moves);

//   if (results.length > 10) {
//     results.pop();
//   }

//   for (let results of allBestResults) {
//     if (results.size === puzzle.size) {
//       results = bestResultsBySize;
//       break;
//     }
//   }

//   storage.setItem('best=results', JSON.stringify(allBestResults));
// }

// function updateMoves(moves) {
//   document.querySelector('.moves').textContent = `Moves: ${moves}`;
// }
