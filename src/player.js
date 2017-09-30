import Player from '@vimeo/player';

let player;

function initiatePlayer() {
  player = new Player('player', {
    id: 76979871,
    width: 640
  });
}

export { initiatePlayer };
