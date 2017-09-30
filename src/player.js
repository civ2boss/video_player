import Player from '@vimeo/player';
import { createCueOverlay, createCueItemMarkup } from './markup';

let id;
let player;
let textarea;
let overlay;
let cueList = {};
let currentTime = 0;
let range = 3;

function init() {
  initializePlayer();
  initializeCues();
}

function initializePlayer() {
  overlay = document.querySelector('.overlay');
  id = 76979871;
  player = new Player('player', {
    id: id,
    width: 640
  });

  player.on('play', (data) => {
    trackTime();
  });
  player.on('seeked', (data) => {
    currentTime = data.seconds;
  })
}

function trackTime() {
  let interval = setInterval(() => {
    currentTime = round(currentTime + 0.01);

    let cueArray = Object.entries(cueList).filter((cue) => {
      const [time, text] = cue;
      const timeRange = Number(time) + range;
      return Number(time) < currentTime && timeRange > currentTime;
    });

    if (cueArray.length) {
      overlay.innerHTML = createCueOverlay(cueArray[0][1]);
    } else {
      overlay.innerHTML = '';
    }
  }, 10);

  player.on('pause', () => {
    clearInterval(interval);
  });
}

function initializeCues() {
  const form = document.querySelector('.cues-form');
  textarea = document.querySelector('.cue-text');

  form.addEventListener('submit', addCue);
  resetCues();
}

function resetCues() {
  const list = document.querySelector('.cues-list');
  const localStorageReference = localStorage.getItem(`video-${id}`);
  if (localStorageReference) {
    cueList = JSON.parse(localStorageReference);

    let items = Object.entries(cueList).map((cue) => {
      const [time, text] = cue;
      return createCueItemMarkup(secondsToHms(time), text);
    });

    items = items.reduce((all, next) => all + next);
    list.innerHTML = items;
  }
}

// Helper method - seconds to hh:mm:ss
function secondsToHms(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 3600 % 60);

  const hDisplay = h > 9 ? h : `0${h}`;
  const mDisplay = m > 9 ? m : `0${m}`;
  const sDisplay = s > 9 ? s : `0${s}`;
  return `${hDisplay}:${mDisplay}:${sDisplay}`;
}

// Helper method - round to 3 decimals
function round(value) {
  return Number(Math.round(value+'e3') + 'e-3');
}

function addCue(event) {
  event.preventDefault();

  // Prevent adding empty Cues
  if (textarea.value != '') {
    player.getCurrentTime()
      .then(function(seconds) {
        cueList[seconds] = textarea.value;
        localStorage.setItem(`video-${id}`, JSON.stringify(cueList));
        textarea.value = '';
        resetCues();
      }).catch(function(error) {
        console.error(error);
      });
  }
}

export default init;
