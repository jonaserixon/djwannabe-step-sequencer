"use strict";

let idCounter = 0;
let wrapper = document.getElementById('wrapper');

/**
 * The draggable div that snaps to .main-timeline
 */
$( function() {
  $('#draggableBox').draggable({
    snap: ".main-timeline",
    drag: function(event, ui) {
      
    }
  });
});



/**
 * Logic running when a div is dropped on the droppable
 */
$('.main-timeline').droppable({
  drop: function( event, ui ) {
    $( this );
  }
});




/**
 * Audio sample
 */


let sampleList = document.querySelector('#sample-list');

sampleList.addEventListener('click', function(event) {
    
    let playChecker = true;

    let sampleBox = document.createElement('div');
    sampleBox.setAttribute('class', 'draggable-content');
    sampleBox.setAttribute('sample', $(event.target).text());

    let playButton = document.createElement('button');
    playButton.textContent = 'Play';
    

    let sound = new Howl({
      src: [$(event.target).text()]
    });

    playButton.addEventListener('click', function() {
      if(playChecker) {
        sound.play();
        playChecker = false;
      } else {
        sound.stop();
        playChecker = true;
      }
      
    })

    wrapper.appendChild(sampleBox);
    sampleBox.appendChild(playButton);

});




