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
      <canvas class="puzzle"></canvas>
    </section>
  `;
};

const renderGameStats = () => {
  return `
    <section class="game-stats">
      <div class="current-stats">
        <p class="moves-">Moves: <span>0</span></p>
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

// const renderResults = () => {
//   return `
//     <section class="results">
//       <h2 class="results-title">Top 10 Results</h2>
//       <div class="results-list">
//         <div class="results-list-heading">
//           <div class="palace__heading">Place</div>
//           <div class="moves__heading">Moves</div>
//           <div class="times__heading">Time</div>
//           <div class="dates__heading">Date</div>
//         </div>
//         <div class="results-list">

//         </div>
//       </div>
//     </section>
//   `;
// };

// const renderResult = (place, result) => {
//   return `
//     <div class="result-place">${place}</div>
//     <div class="result-moves">${result.moves || '--'}</div>
//     <div class="result-time">${result.time || '--:--:--'}</div>
//     <div class="result-date">${result.date || '--.--.-- --:--'}</div>
//   `;
// };

const colors = {
  black: '#000000',
  red: '#4f0000',
  blue: '#000032',
  green: '#001f00',
  gray: '#252525',
  chocolate: 'chocolate',
};

export const renderConfigs = (isSoundOn = true) => {
  return `
    <section class="configs">
      <div class="config sound-config">
        <h3>Sound</h3>
        <div class="sound-state">${isSoundOn ? 'On' : 'Off'}</div>
      </div>
      <div class="config theme-config">
        <h3>Theme</h3>
        <div class="sound-state">${isSoundOn ? 'Dark' : 'Light'}</div>
      </div>
      <div class="config color-config">
        <h3>Color</h3>
        <select class="size-select">
          ${Object.keys(colors).map((k) => renderOption(k, k))}
        </select>
      </div>
      <div class="config sizes-config">
        <h3>Size (3-10)</h3>
        <select class="size-select">
          ${Array.from({ length: 8 }, (_, i) => i + 3).map((v) => renderOption(v, `${v}X${v}`))}
        </select>
      </div>
    </section>`;
};

const renderOption = (value, text) => {
  return `
    <option value="${value}">${text}</option>
  `;
};

// const renderMessage = (message) => {
//   return `
//     <p class="congratulation-message">${message}</p>
//   `;
// };
