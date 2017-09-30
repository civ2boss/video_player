function createColumn(className) {
  return `<div class="${className}"></div>`;
}

function createTitle() {
  return `<h1>Vimeo Player with Cues</h1>`;
}

function createPlayerMarkup() {
  return `
    <div id="player">
      <div class="overlay"></div>
    </div>
  `;
}

function createCueOverlay(text) {
  return `
    <div class="cue-overlay">${text}</div>
  `;
}

function createCuesFormMarkup() {
  return `
    <form class="cues-form">
      <textarea class="cue-text"></textarea>
      <div class="buttons">
        <button class="btn btn-large" id="addCue" type="submit">Add Cue</button>
      </div>
    </form>
  `;
}

function createCuesListMarkup() {
  return `
    <div class="cues">
      <h2>Cues</h2>
      <ul class="cues-list">
        <li>No Cues yet</li>
      </ul>
    </div>
  `;
}

function createCueItemMarkup(time, displayTime, text) {
  return `
    <li class="cue-${time}">
      <span class="cue">${text}</span>
      <span class="time">${displayTime}</span>
      <a class="cue-delete" href="#" data-seconds="${time}">&times;</a>
    </li>
  `;
}

function createMarkup() {
  document.body.innerHTML = `<div id="wrap"></div>`;
  document.querySelector('#wrap').innerHTML = createTitle() + createColumn('left') + createColumn('right');
  document.querySelector('.left').innerHTML = createPlayerMarkup();
  document.querySelector('.right').innerHTML = createCuesFormMarkup() + createCuesListMarkup();
}

export { createCueOverlay, createCueItemMarkup };
export default createMarkup;
