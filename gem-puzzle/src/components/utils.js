export const createSound = (src) => {
  const sound = document.createElement('audio');
  sound.src = src;
  sound.setAttribute('controls', 'none');
  return sound;
};

export function getShuffledNumbers(size) {
  let ids = Array.from({ length: size * size }, (_, i) => i);
  let isPassed = false;

  while (!isPassed) {
    ids = ids.sort(() => Math.random() - 0.5);
    const inversionsNumber = getInversionsNumber(ids);
    const emptyTilePosition = ids.findIndex((n) => n === 0) + 1;
    isPassed = isSolvable(inversionsNumber, emptyTilePosition, size);
  }

  return ids;
}

const getInversionsNumber = (ids) => {
  const emptyTile = 0;
  let inversionsNumber = 0;

  for (let i = 0; i < ids.length - 1; i++) {
    if (ids[i] === emptyTile) {
      continue;
    }

    for (let j = i + 1; j < ids.length; j++) {
      if (ids[i] > ids[j] && ids[j] !== emptyTile) {
        inversionsNumber++;
      }
    }
  }

  return inversionsNumber;
};

const getRowNumberFromBelow = (size, emptyTilePosition) => {
  const row = Math.floor(emptyTilePosition / size);

  return size - row;
};

const isSolvable = (inversionsNumber, emptyTilePosition, size) => {
  if (size % 2 !== 0) {
    return inversionsNumber % 2 === 0;
  }

  const rowNumber = getRowNumberFromBelow(size, emptyTilePosition);

  if (rowNumber % 2 !== 0) {
    return inversionsNumber % 2 === 0;
  }

  return inversionsNumber % 2 !== 0;
};
