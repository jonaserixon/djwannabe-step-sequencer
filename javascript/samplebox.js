'use strict';

let playChecker = true;

let wrapper = document.querySelector('#wrapper');
let playAllButton = document.createElement('button');
playAllButton.setAttribute('id', 'play-all-button');
playAllButton.textContent = 'Play all samples';

let sound;

function sampleFile(sample) {
        sound = new Howl({
        src: ['./audio/' + sample],
        vol: 1,
        onend: function() {
            playChecker = true;
            sampleBox.style.border = 'solid black';
            playButton.textContent = 'Play';
        }
    });
}



document.addEventListener('click', function(event) {
    let playButton = document.getElementById(event.target.id);

    if(playButton.tagName === 'BUTTON' && playButton.className === 'sampleButton') {
        console.log(playButton.tagName);
        sound.play();
    }

});


function playAllSamples(sound, id) {
    let checker = true;

    if($(".draggable-content").length > 0) {   //play all button appears if 2 sampleboxes on screen
        wrapper.appendChild(playAllButton);
    }

    // $('.draggable-content').find('button').each(function(){  //finds all buttons in the class
    //           // let innerDivId = $(this).attr('id'); //the id of the play buttons
    // });

    playAllButton.addEventListener('click', function() {
        if(checker) {
            document.querySelector('#samplebox' + id).style.border = 'solid limegreen';
            document.querySelector('#playbutton' + id).textContent = 'Stop';
            playAllButton.textContent = 'Stop all samples';
            sound.play();
            checker = false;
        } else {
            document.querySelector('#samplebox' + id).style.border = 'solid black';
            document.querySelector('#playbutton' + id).textContent = 'Play';
            playAllButton.textContent = 'Play all samples';
            sound.stop();
            checker = true;
        }
    });
}

/**
 * Skapar en samplebox div som är draggable + innehåller ett sample + en play knapp
 * @param id
 * @param sample = <li> texten som klickas på (ex. 'Weird Synth.wav')
 */
function samplebox(id, sample) {
    $(function() {
        $('#samplebox' + id).draggable({
            snap: ".main-timeline" //Snappar till playlisten
        });
    });

    sampleFile(sample);

    playAllSamples(sound, id);

    let sampleBox = document.createElement('div');
    sampleBox.setAttribute('class', 'draggable-content');
    sampleBox.setAttribute('id', 'samplebox' + id);
    sampleBox.setAttribute('sample', sample);


    /**
     * The 'play' button for specific samplebox
     */

    let playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.setAttribute('id', 'playButton' + id);
    playButton.setAttribute('class', 'sampleButton');

    // playButton.addEventListener('click', function() {
    //     if(playChecker) {
    //         sound.play();
    //         playButton.textContent = 'Stop';
    //         sampleBox.style.border = 'solid limegreen';
    //         playChecker = false;
    //     } else {
    //         sound.stop();
    //         playButton.textContent = 'Play';
    //         sampleBox.style.border = 'solid black';
    //         playChecker = true;
    //     }
    // });




    wrapper.appendChild(sampleBox);
    sampleBox.appendChild(playButton);
}

module.exports = samplebox;