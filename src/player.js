import Player from '@vimeo/player';

let id;
let player;
let form;
let textarea;
let list = {};

function init() {
  initializePlayer();
  initializeCues();
}

function initializePlayer() {
  id = 76979871;
  player = new Player('player', {
    id: id,
    width: 640
  });
}

function initializeCues() {
  form = document.querySelector('.cues-form');
  form.addEventListener('submit', addCue);

  textarea = document.querySelector('.cue-text');

  const localStorageReference = localStorage.getItem(`video-${id}`);
  if (localStorageReference) {
    list = JSON.parse(localStorageReference);
  }
}

function addCue(event) {
  event.preventDefault();

  // Prevent adding empty Cues
  if (textarea.value != '') {
    player.getCurrentTime()
      .then(function(seconds) {
        list[seconds] = textarea.value;
        localStorage.setItem(`video-${id}`, JSON.stringify(list));
      }).catch(function(error) {
        console.error(error);
      });
  }
}

export default init;
