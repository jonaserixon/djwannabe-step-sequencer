"use strict";

let wrapper = document.getElementById('wrapper');

/**
 * The draggable div that snaps to .main-timeline
 */
$( function() {
  $('#draggableBox').draggable({
    snap: ".main-timeline",
    drag: function(event, ui) {
      sound.stop();
    }
  });
});

/**
 * Logic running when a div is dropped on the droppable
 */
$('.main-timeline').droppable({
  drop: function( event, ui ) {
    $( this );
    wrapper.appendChild(playButton);
  }
});

let sound = new Howl({
  src: ['loop1.wav'],
  volume: 0.5,
});

let playButton = document.createElement('div');
playButton.setAttribute('id','play-button');
playButton.textContent = 'PLAY!';

playButton.addEventListener('click', function() {
  console.log('spela samplet!');
  sound.play();
});

