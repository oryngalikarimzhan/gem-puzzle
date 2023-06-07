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
    const emptyTilePosition = ids.findIndex((n) => n === 0);
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

const formatTimeUnit = (unit) => unit.toString().padStart(2, '0');

export const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  const timeText = `${formatTimeUnit(hours)}:${formatTimeUnit(remainingMinutes)}:${formatTimeUnit(remainingSeconds)}`;
  return timeText;
};

export const saveResults = (size, moves, time) => {
  const allResults = JSON.parse(window.localStorage.getItem('best-results') || '{}');

  const bestResultsBySize = allResults[size] || [];
  const currentDate = new Date();

  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(currentDate).slice(2);
  const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(currentDate);
  const date = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(currentDate);
  const hour = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: false }).format(currentDate);
  const minute = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(currentDate);

  const result = {
    moves,
    time,
    date: `${date}.${month}.${year} ${hour}:${formatTimeUnit(minute)}`,
  };

  bestResultsBySize.push(result);
  bestResultsBySize.sort((a, b) => a.moves - b.moves);

  if (bestResultsBySize.length > 10) {
    bestResultsBySize.pop();
  }

  allResults[size] = bestResultsBySize;

  window.localStorage.setItem('best-results', JSON.stringify(allResults));
};
