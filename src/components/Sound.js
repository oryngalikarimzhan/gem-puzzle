export class Sound {
  constructor(src) {
    this.sound = new Audio();
    this.sound.src = src;
  }

  reload = () => {
    this.sound.pause();
    this.sound.currentTime = 0;
  };

  play = () => {
    this.sound.play();
  };
}
