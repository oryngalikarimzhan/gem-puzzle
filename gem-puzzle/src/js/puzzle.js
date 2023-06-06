export let puzzle = {
  canvas: document.createElement('canvas'),
  build: function (areaSize) {
    this.canvas.width = areaSize;
    this.canvas.height = areaSize;
    this.context = this.canvas.getContext('2d');
    document.querySelector('.game__wrapper').append(this.canvas);
  },
  start: function (updateGameArea, updateTime) {
    this.interval = setInterval(updateGameArea, 20);
    this.time = setInterval(updateTime, 1000);
  },
  continue: function (updateTime) {
    this.time = setInterval(updateTime, 1000);
  },
  pause: function () {
    clearInterval(this.time);
  },
  stop: function () {
    clearInterval(this.interval);
    clearInterval(this.time);
  },

  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};
