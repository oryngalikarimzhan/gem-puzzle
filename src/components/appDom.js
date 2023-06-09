export const renderApp = () => {
  let app = `
    <main class="main">
      ${renderControlPanel()}
      ${renderGameField()}
      ${renderGameStats()}
      ${renderOverlay()}
    </main>
  `;

  document.body.innerHTML = app;
};

const renderControlPanel = () => {
  return `
    <section class="control-panel">
      <button class="button start-button">Start</button>
      <button class="button save-button">Save</button>
      <button class="button restore-button">Restore</button>
      <button class="button configs-button">Configs</button>
    </section>
  `;
};

const renderGameField = () => {
  return `
    <section class="game-field">
      <canvas class="puzzle" width="750" height="750"></canvas>
    </section>
  `;
};

const renderGameStats = () => {
  return `
    <section class="game-stats">
      <div class="current-stats">
        <p class="moves">Moves: <span>0</span></p>
        <p class="time">Time: <span>00:00:00</span></p>
      </div>
      <button class="button results-button">Results</button>
    </section>
  `;
};

const renderOverlay = () => {
  return `
    <div class="overlay hidden">
      <section class="popup">
        <button class="close-button"></button>
        <div class="popup-content"></div>
      </section>
    </div>
  `;
};

export const renderResults = (results) => {
  return `
    <section class="results">
      <h2 class="results-title">Top 10 Results</h2>
      <div class="results-content">
        <div class="results-list-heading">
          <div class="places__heading">#</div>
          <div class="moves__heading">Moves</div>
          <div class="times__heading">Time</div>
          <div class="dates__heading">Date</div>
        </div>
        <div class="results-list">
          ${results.map((rsl, i) => renderResult(i + 1, rsl)).join('')}
        </div>
      </div>
    </section>
  `;
};

const renderResult = (place, { moves, time, date }) => {
  return `
    <div class="result">
      <div class="result-place">${place}</div>
      <div class="result-moves">${moves}</div>
      <div class="result-time">${time}</div>
      <div class="result-date">${date}</div>
    </div>
  `;
};

export const renderConfigs = (soundStateText, themeStateText, currentSize, fullScreenStateText) => {
  return `
    <section class="configs">
      <div class="config sound-config">
        <h3>Sound</h3>
        <div class="sound-state">${soundStateText}</div>
      </div>
      <div class="config theme-config">
        <h3>Theme</h3>
        <div class="theme-state">${themeStateText}</div>
      </div>
      <div class="config theme-config">
        <h3>Full screen</h3>
        <div class="full-screen-state">${fullScreenStateText}</div>
      </div>
      <div class="config sizes-config">
        <h3>Size</h3>
        <select class="size-select">
          ${Array.from({ length: 8 }, (_, i) => i + 3)
            .map((size) => renderOption(size, `${size}X${size}`, currentSize == size))
            .join('')}
        </select>
      </div>
    </section>`;
};

const renderOption = (value, text, isSelected) => {
  return `
    <option ${isSelected ? 'selected' : ''} value="${value}">${text}</option>
  `;
};

export const renderMessage = (message) => {
  return `
    <p class="popup-message">${message}</p>
  `;
};
