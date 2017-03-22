"use strict";

let idCounter = 0;
let playChecker = true;

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



let playAllButton = document.createElement('button');
playAllButton.textContent = 'Play all samples';



function playAllSamples(sound) {
    

    playAllButton.addEventListener('click', function() {

    let numberOfBoxes = $(".draggable-content").length;
      
        $('.draggable-content').find('button').each(function(){
          var innerDivId = $(this).attr('id');
              sound.play();
        });
    });
}




wrapper.appendChild(playAllButton);

let sampleList = document.querySelector('#sample-list'); //The list with the samples


/**
 * listen for click on a new sample and loads it with the samplebox();
 */
sampleList.addEventListener('click', function(event) {
    let sound = new Howl({
      src: [$(event.target).text()],
      vol: 1,
      onend: function() {
        playChecker = true
      }
    });
    
    samplebox(idCounter, sound, $(event.target).text());
    playAllSamples(sound);
    idCounter += 1;
});


document.addEventListener('click', function(event) {
  console.log(event.target);
})



/**
 * Create the samplebox with an audio sample
 */
function samplebox(id, sound, sample) {
    
    let sampleBox = document.createElement('div');
        sampleBox.setAttribute('class', 'draggable-content');
        sampleBox.setAttribute('id', 'samplebox' + id)
        sampleBox.setAttribute('sample', sample);

        let playButton = document.createElement('button');
        playButton.textContent = 'Play';
        playButton.setAttribute('id', 'playbutton' + id);

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
}






