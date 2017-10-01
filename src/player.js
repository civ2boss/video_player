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
  const urlParams = new URLSearchParams(window.location.search);
  overlay = document.querySelector('.overlay');

  // Default video if none is found in url
  if (urlParams.has('id')) {
    id = urlParams.get('id');
  } else {
    id = 76979871;
    urlParams.set('id', id);
    window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
  }

  player = new Player('player', {
    id: id,
    width: 640
  });

  player.on('play', trackTime);
  player.on('seeked', (data) => currentTime = data.seconds);
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
  const list = document.querySelector('.cues-list');

  form.addEventListener('submit', addCue);
  resetCues();
  list.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.className == 'cue-delete') {
      deleteCue(event.target.dataset.seconds);
    }
  });
}

function resetCues() {
  const list = document.querySelector('.cues-list');
  const localStorageReference = localStorage.getItem(`video-${id}`);
  if (localStorageReference) {
    cueList = JSON.parse(localStorageReference);

    if (Object.keys(cueList).length) {
      let items = Object.entries(cueList).map((cue) => {
        const [time, text] = cue;
        return createCueItemMarkup(time, secondsToHms(time), text);
      });

      items = items.reduce((all, next) => all + next);
      list.innerHTML = items;
    } else {
      list.innerHTML = `<li>No Cues yet</li>`;
    }
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

// Helper method - escape html
function escapeHtml(text) {
  return text.replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/`/g, '&#96;');
}

// Helper method - convert http urls to links
function detectUrl(text) {
  const regex = /https?:\/\/(?![^" ]*(?:jpg|png|gif))[^" ]+/g;
  return text.replace(regex, function(url) {
    return `<a href="${url}">${url}</a>`;
  });
}

// Helper method - convert http image urls to images
function detectImage(text) {
  const regex = /https?:\/\/[^ ]+?(?:\.jpg|\.png|\.gif)/g;
  return text.replace(regex, function(image) {
    return `<img src="${image}" alt="" />`;
  });
}

function detect(text) {
  let convertedText;
  convertedText = escapeHtml(text);
  convertedText = detectUrl(convertedText);
  convertedText = detectImage(convertedText);
  return convertedText;
}

function addCue(event) {
  event.preventDefault();

  // Prevent adding empty Cues
  if (textarea.value != '') {
    player.getCurrentTime()
      .then(function(seconds) {
        cueList[seconds] = detect(textarea.value);
        localStorage.setItem(`video-${id}`, JSON.stringify(cueList));
        textarea.value = '';
        resetCues();
      }).catch(function(error) {
        console.error(error);
      });
  }
}

function deleteCue(seconds) {
  delete cueList[seconds];
  localStorage.setItem(`video-${id}`, JSON.stringify(cueList));
  resetCues();
}

export default init;
