export class Tile {
  constructor({ tileSize, x, y, id, position, direction = '', moveable = false, textColor = '#f0fff0' }) {
    this.tileSize = tileSize;
    this.x = x;
    this.y = y;
    this.id = id;
    this.position = position;
    this.direction = direction;
    this.moveable = moveable;
    this.textColor = textColor;
  }

  draw(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.tileSize, this.tileSize, 15);
    ctx.fill();
    ctx.beginPath();
    ctx.font = `${this.tileSize / 2}px Audiowide`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.textColor;
    ctx.fillText(this.id, this.x + this.tileSize / 2, this.y + this.tileSize / 2);
  }
}
