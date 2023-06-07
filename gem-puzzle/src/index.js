export const myDB = window.localStorage;

export function addColorChangeEventHandler() {
  document.querySelectorAll('.color').forEach((elem) => {
    elem.addEventListener('click', () => {
      tileColor = getComputedStyle(elem).getPropertyValue('background-color');
      document.querySelector('.current-color').classList.remove('current-color');
      elem.classList.add('current-color');
    });
  });
}

export function continueSavedGame() {
  let savedGame = JSON.parse(myDB.getItem('savedGame'));
  if (savedGame) {
    resetStats();
    setTimes(savedGame.seconds, savedGame.minutes, savedGame.hours);
    setMoves(savedGame.moves);
    updateTime();
    updateMoves();

    size = savedGame.size;
    if (areaSize === savedGame.areaSize) {
      setDistance(savedGame.areaSize / size);
      savedGame.tiles.forEach((tile) => {
        addTile(new Component(tile.width, tile.x, tile.y, tile.id, tile.position, tile.moveable, tile.direction));
      });
    } else {
      setDistance(areaSize / size);
      savedGame.tiles.forEach((tile) => {
        addTile(
          new Component(
            distance - 2,
            distance * parseInt(tile.x / (savedGame.areaSize / savedGame.size)) + 1,
            distance * parseInt(tile.y / (savedGame.areaSize / savedGame.size)) + 1,
            tile.id,
            tile.position,
            tile.moveable,
            tile.direction
          )
        );
      });
    }

    document.querySelector('.current-size').classList.remove('current-size');
  }
}

export function saveCurrentGame() {
  if (!isWin() && isStarted) {
    myDB.setItem(
      'savedGame',
      JSON.stringify({
        tiles,
        moves,
        seconds,
        minutes,
        hours,
        areaSize,
        size,
      })
    );
  }
}
