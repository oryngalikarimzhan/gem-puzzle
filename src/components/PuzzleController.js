import { updateMovesText } from './domActions';

export class PuzzleController {
  isEnabled = true;
  rect;
  scale;
  mouseX;
  mouseY;
  isHorizontalMove;
  isToForward = true;
  startPosition;
  distanceToMove = null;
  isPositionChanged;
  isMoveEnding = false;

  constructor(canvas, states, { moveSound, winSound }) {
    this.canvas = canvas;
    this.states = states;
    this.moveSound = moveSound;
    this.winSound = winSound;
    this.moveSound.load();
    this.winSound.load();

    this.handleControlOnReSize();

    window.addEventListener('resize', this.handleControlOnReSize);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  update = () => {
    this.winSound.load();
    this.moveSound.load();
    this.defineNewMoveableTiles();
    this.updateCurrentTilePosition();
    updateMovesText(this.states.moves);
    this.states.currentTile = null;
  };

  handleControlOnReSize = () => {
    this.rect = this.canvas.getBoundingClientRect();
    const actual = this.canvas.clientWidth;
    this.scale = this.states.areaSize / actual;
  };

  handleMouseDown = (event) => {
    if (this.states.isStarted) {
      const { tiles, tileSize, isSoundOn } = this.states;

      this.mouseX = (event.clientX - this.rect.left) * this.scale;
      this.mouseY = (event.clientY - this.rect.top) * this.scale;

      const matchedTile = tiles.find((tile) => {
        return (
          tile.x <= this.mouseX &&
          tile.x + tileSize >= this.mouseX &&
          tile.y <= this.mouseY &&
          tile.y + tileSize >= this.mouseY &&
          tile.moveable
        );
      });

      if (matchedTile) {
        if (isSoundOn) {
          this.moveSound.play();
        }

        this.isEnabled = false;
        this.states.currentTile = matchedTile;

        if (matchedTile.direction === 'up' || matchedTile.direction === 'down') {
          this.isHorizontalMove = false;
          this.startPosition = matchedTile.y;
        } else if (matchedTile.direction === 'right' || matchedTile.direction === 'left') {
          this.isHorizontalMove = true;
          this.startPosition = matchedTile.x;
        }
      }
    }
  };

  handleMouseMove = (event) => {
    if (this.states.isStarted && !this.isEnabled && !this.isMoveEnding) {
      let step;
      let beforeStep;
      let difference;

      const { currentTile, distance } = this.states;

      if (this.isHorizontalMove) {
        beforeStep = currentTile.x;
        step = (event.clientX - this.rect.left) * this.scale - this.mouseX;
      } else {
        beforeStep = currentTile.y;
        step = (event.clientY - this.rect.top) * this.scale - this.mouseY;
      }

      const newPosition = this.startPosition + step;

      switch (currentTile.direction) {
        case 'right':
          if (step >= 0 && step <= distance) {
            currentTile.x = newPosition;
            difference = currentTile.x - beforeStep;

            if (difference !== 0) {
              this.isToForward = difference > 0;
            }
          }
          break;

        case 'left':
          if (step >= -distance && step <= 0) {
            currentTile.x = newPosition;
            difference = currentTile.x - beforeStep;

            if (difference !== 0) {
              this.isToForward = difference < 0;
            }
          }
          break;

        case 'down':
          if (step > 0 && step <= distance) {
            currentTile.y = newPosition;
            difference = currentTile.y - beforeStep;

            if (difference !== 0) {
              this.isToForward = difference > 0;
            }
          }
          break;

        case 'up':
          if (step >= -distance && step < 0) {
            currentTile.y = newPosition;
            difference = currentTile.y - beforeStep;

            if (difference !== 0) {
              this.isToForward = difference < 0;
            }
          }
          break;
      }
    }
  };

  handleMouseUp = () => {
    if (this.states.isStarted) {
      const { currentTile, distance } = this.states;
      if (currentTile) {
        if (this.isToForward === null) {
          this.isToForward = true;
        }
        this.isPositionChanged = this.isToForward;
        const tileDirection = currentTile.direction;

        const ascending = tileDirection === 'right' || tileDirection === 'down';
        const descending = tileDirection === 'left' || tileDirection === 'up';
        let delta = true;

        let destination;
        if (this.isToForward) {
          if (ascending) {
            destination = this.startPosition + distance;
          } else if (descending) {
            destination = this.startPosition - distance;
            delta = false;
          }
        } else {
          destination = this.startPosition;

          if (ascending) {
            delta = false;
          }
        }

        const currentPosition = this.isHorizontalMove ? currentTile.x : currentTile.y;
        this.distanceToMove = delta ? destination - currentPosition : currentPosition - destination;

        this.isMoveEnding = true;
      }
    }
  };

  moveTile = () => {
    if (this.distanceToMove !== null) {
      if (this.isMoveEnding) {
        const { currentTile, distancePerFrame } = this.states;

        const tile = currentTile;

        let delta = 0;
        const isLastDistance = this.distanceToMove < distancePerFrame;

        if (this.isToForward) {
          delta = isLastDistance ? this.distanceToMove : distancePerFrame;
        } else {
          delta = isLastDistance ? -this.distanceToMove : -distancePerFrame;
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

        this.distanceToMove -= Math.abs(delta);

        if (this.distanceToMove <= 0) {
          this.endMove();
        }
      }
    }
  };

  endMove = () => {
    if (this.isPositionChanged) {
      const { tiles, currentTile } = this.states;

      tiles.forEach((tile) => {
        if (tile !== currentTile) {
          tile.moveable = false;
          tile.direction = '';
        }
      });

      this.defineNewMoveableTiles();
      this.updateCurrentTilePosition();
      this.states.moves++;
      this.states.isWin = this.isWin();

      updateMovesText(this.states.moves);
    }

    this.resetMoveProgress();
  };

  resetMoveProgress = () => {
    this.moveSound.load();
    this.states.currentTile = null;
    this.distanceToMove = null;
    this.mouseX = null;
    this.mouseY = null;
    this.isToForward = true;
    this.isMoveEnding = false;
    this.isEnabled = true;
  };

  defineNewMoveableTiles = () => {
    const { currentTile, size, tiles } = this.states;

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
  };

  updateCurrentTilePosition = () => {
    const { currentTile, size } = this.states;

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
  };

  isWin = () => {
    const { tiles } = this.states;
    return tiles.length !== 0 ? tiles.every((tile) => tile.position === tile.id) : false;
  };
}
