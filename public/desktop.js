"use strict";

let wrapper = document.getElementById('wrapper');

$( function() {
  $('#draggableBox').draggable({
    snap: ".main-timeline",
    drag: function( event, ui ) {
      sound.stop();
    }
  });
});

/**
 * Logic running when a div is dropped
 */
$('.main-timeline').droppable({
  drop: function( event, ui ) {
    $( this );
    wrapper.appendChild(playButton);
  }
});

var sound = new Howl({
  src: ['loop1.wav'],
  volume: 0.5,
  onend: function() {
    console.log('Finished!');
  }
});

let playButton = document.createElement('div');
playButton.setAttribute('id','play-button');
playButton.textContent = 'PLAY!';

playButton.addEventListener('click', function() {
  console.log('spela samplet!');
  sound.play();
});

