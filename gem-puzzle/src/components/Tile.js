export class Tile {
  constructor(tileSize, x, y, id, position) {
    this.tileSize = tileSize;
    this.x = x;
    this.y = y;
    this.id = id;
    this.position = position;
    this.direction = '';
    this.moveable = false;
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
    ctx.fillStyle = 'white';
    ctx.fillText(this.id, this.x + this.tileSize / 2, this.y + this.tileSize / 2);
  }
}
