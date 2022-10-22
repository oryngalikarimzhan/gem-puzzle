export function createInitialDom() {
  let wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  let wrapperContent = `
    <div class="buttons">
      <button class="start">Start</button>
      <button class="save-button">Save</button>
      <button class="saved-game-button">Saved game</button>
      <button class="configs">Game Configs</button>
    </div>
    <div class="game__wrapper">
    </div>
    <div class="game-stats">
      <div class="current-game-stat">
          <div class="moves">Moves: 0</div>
          <div class="time">Time: 00:00:00</div>
      </div>
      <button class="results-button">Results</button>
    </div>`;

  wrapper.innerHTML = wrapperContent;

  let overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.classList.add('hidden');

  let overlayContent = `
    <div class="overlay__button">
        <div class="close-button"></div>
    </div>
    <div class="overlay__message">
        <h1 class="congratulation-message"></h1>
    </div>
    <div class="sound hidden">
        <h1>Sound</h1>
        <div class="sound-state">On</div>
    </div>
    <div class="colors hidden">
        <h1>Color</h1>
        <div class="color__list">
            <div class="color black current-color"></div>
            <div class="color red"></div>
            <div class="color green"></div>
            <div class="color blue"></div>
            <div class="color gray"></div>
        </div>
    </div>
    <div class="sizes hidden">
        <h1>Size</h1>
        <div class="size current-size">3X3</div>
        <div class="size">4X4</div>
        <div class="size">5X5</div>
        <div class="size">6X6</div>
        <div class="size">7X7</div>
        <div class="size">8X8</div>
    </div>
    <div class="results">
        <h1>Top 10 Results</h1>
        <div class="results__container">
            <div class="results__places">
                <div class="palace__heading">Place</div>
                <div class="place">1.</div>
                <div class="place">2.</div>
                <div class="place">3.</div>
                <div class="place">4.</div>
                <div class="place">5.</div>
                <div class="place">6.</div>
                <div class="place">7.</div>
                <div class="place">8.</div>
                <div class="place">9.</div>
                <div class="place">10.</div>
            </div>
            <div class="results__moves">
                <div class="moves__heading">Moves</div>
                <div class="result-moves">--</div>
                <div class="result-moves">--</div>
                <div class="result-moves">--</div>
                <div class="result-moves">--</div>
                <div class="result-moves">--</div>
                <div class="result-moves">--</div>
                <div class="result-moves">--</div>
                <div class="result-moves">--</div>
                <div class="result-moves">--</div>
                <div class="result-moves">--</div>
            </div>
            <div class="results__times">
                <div class="times__heading">Time</div>
                <div class="result-time">--:--:--</div>
                <div class="result-time">--:--:--</div>
                <div class="result-time">--:--:--</div>
                <div class="result-time">--:--:--</div>
                <div class="result-time">--:--:--</div>
                <div class="result-time">--:--:--</div>
                <div class="result-time">--:--:--</div>
                <div class="result-time">--:--:--</div>
                <div class="result-time">--:--:--</div>
                <div class="result-time">--:--:--</div>
            </div>
            <div class="results__dates">
                <div class="dates__heading">Date</div>
                <div class="result-date">--.--.-- --:--</div>
                <div class="result-date">--.--.-- --:--</div>
                <div class="result-date">--.--.-- --:--</div>
                <div class="result-date">--.--.-- --:--</div>
                <div class="result-date">--.--.-- --:--</div>
                <div class="result-date">--.--.-- --:--</div>
                <div class="result-date">--.--.-- --:--</div>
                <div class="result-date">--.--.-- --:--</div>
                <div class="result-date">--.--.-- --:--</div>
                <div class="result-date">--.--.-- --:--</div>
            </div>
        </div>
    </div>`;
  overlay.innerHTML = overlayContent;
  document.body.append(wrapper);
  document.body.append(overlay);
}
