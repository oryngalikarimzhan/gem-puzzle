import { puzzle } from './puzzle';

export class Component {
  constructor(tileSize, x, y, id, position, moveable, direction) {
    this.width = tileSize;
    this.height = tileSize;
    this.x = x;
    this.y = y;
    this.id = id;
    this.position = position;
    this.moveable = moveable;
    this.direction = direction;
  }

  update(tileColor, areaSize, size) {
    let ctx = puzzle.context;
    ctx.fillStyle = tileColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.beginPath();
    ctx.font = `${areaSize / (size * 3)}px Audiowide`;
    ctx.fillStyle = 'white';
    if (typeof this.id === 'number') {
      if (size >= 6) {
        ctx.fillText(this.id, this.x + areaSize / size / 3.5, this.y + areaSize / size - areaSize / size / 2.5);
      } else {
        ctx.fillText(this.id, this.x + areaSize / size / 3, this.y + areaSize / size - areaSize / size / 2.5);
      }
    } else {
      setTimeout(() => {
        puzzle.clear();
        ctx.font = `${areaSize / 12}px Audiowide`;
        ctx.fillStyle = tileColor;
        ctx.fillText(this.id, this.x + areaSize / 4 / 3, this.y + areaSize / 4 - areaSize / 4 / 2.5);
      }, 300);
    }
  }
}
