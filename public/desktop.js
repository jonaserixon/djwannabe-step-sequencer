"use strict";

let idCounter = 0;
let playChecker = true;

let wrapper = document.getElementById('wrapper');

/**
 * The draggable div that snaps to .main-timeline
 */




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



function playAllSamples(sound, id) {
    
    if($(".draggable-content").length > 0) {
        wrapper.appendChild(playAllButton);
    }
    playAllButton.addEventListener('click', function() {
        $('.draggable-content').find('button').each(function(){
          var innerDivId = $(this).attr('id'); //the id of the play buttons

          document.querySelector('#samplebox' + id).style.border = 'solid limegreen';
              sound.play();
        });
    });
}




let sampleList = document.querySelector('#sample-list'); //The list with the samples


/**
 * listen for click on a new sample and loads it with the samplebox();
 */
sampleList.addEventListener('click', function(event) {
  console.log(event.target);
    
    
    samplebox(idCounter, $(event.target).text());
    
    idCounter += 1;
});


document.addEventListener('click', function(event) {
  console.log(event.target);
})



/**
 * Create the samplebox with an audio sample
 */
function samplebox(id, sample) {
      $( function() {
      $('#samplebox' + id).draggable({      //draggable div
        snap: ".main-timeline",
        drag: function(event, ui) {
        }
      });
    });

    let sound = new Howl({
      src: [sample],
      vol: 1,
      onend: function() {
        playChecker = true;
        sampleBox.style.border = 'solid black';
        playButton.textContent = 'Play';
      }
    });

    playAllSamples(sound, id);

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
        playButton.textContent = 'Stop';
        sampleBox.style.border = 'solid limegreen';
        playChecker = false;
      } else {
        sound.stop();
        playButton.textContent = 'Play';
        sampleBox.style.border = 'solid black';
        playChecker = true;
      }
    })

    

    wrapper.appendChild(sampleBox);
    sampleBox.appendChild(playButton);
}






