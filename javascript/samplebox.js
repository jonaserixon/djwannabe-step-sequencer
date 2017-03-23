'use strict';

let playChecker = true;

let wrapper = document.querySelector('#wrapper');

let sampleName;

let sound;

/**
 * The audio sample creator
 * sample - path to audio sample
 */
function sampleFile(sample, playButton, sampleBox) {
    let sound = new Howl({
        src: ['./audio/' + sample],
        vol: 1,
        onend: function() {
            playChecker = true;
            sampleBox.style.border = 'solid black';
            playButton.textContent = 'Play';
        }
    });
}

//The 'play-all' button
let playAllButton = document.createElement('button');
playAllButton.setAttribute('id', 'play-all-button');
playAllButton.textContent = 'Play all samples';



function playAllSamples(sound, id) {
    let checker = true;

    if($(".draggable-content").length > 0) {   //play all button appears if 2 sampleboxes on screen
        wrapper.appendChild(playAllButton);
    }



    // playAllButton.addEventListener('click', function() {
    //     if(checker) {
    //         document.querySelector('#samplebox' + id).style.border = 'solid limegreen';
    //         document.querySelector('#playbutton' + id).textContent = 'Stop';
    //         playAllButton.textContent = 'Stop all samples';
    //         sound.play();
    //         checker = false;
    //     } else {
    //         document.querySelector('#samplebox' + id).style.border = 'solid black';
    //         document.querySelector('#playbutton' + id).textContent = 'Play';
    //         playAllButton.textContent = 'Play all samples';
    //         sound.stop();
    //         checker = true;
    //     }
    // });
}

/**
 * Skapar en samplebox div som är draggable + innehåller ett sample + en play knapp
 * @param id
 * @param sample = <li> texten som klickas på (ex. 'Weird Synth.wav')
 */
function samplebox(id, sample) {
    console.log('samplebox() körs');
    sampleName = sample;
    $(function() {
        $('#samplebox' + id).draggable({
            snap: ".main-timeline" //Snappar till playlisten
        });
    });

    let sampleBox = document.createElement('div');
    sampleBox.setAttribute('class', 'draggable-content');
    sampleBox.setAttribute('id', 'samplebox' + id);
    sampleBox.setAttribute('sample', sample);

    playAllSamples();

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



/**
 * Sample player
 */
document.addEventListener('click', function(event) {
    let playButton = document.getElementById(event.target.id);
    // console.log($(event.target).text());
    console.log(playButton);

    let getSample = playButton.parentNode.getAttribute('sample');

        sound = new Howl({
        src: ['./audio/' + getSample],
        vol: 1,
        onend: function() {
            playChecker = true;
            sampleBox.style.border = 'solid black';
            playButton.textContent = 'Play';
        }
    });

    /**
     * Play specific sample
     */

        if(playButton.tagName === 'BUTTON' && playButton.className === 'sampleButton') {
            console.log(playButton.tagName);
            playButton.textContent = 'Play';
            //getAttribute från samplebox diven och släng in den i sampleFIle() och spela upp ljudet
            //lägga in sound samplet rakt in här(?)



            if(playChecker) {
                playButton.parentNode.style.border = 'solid limegreen';

                // sampleFile(getSample, playButton, playButton.parentNode);
                sound.play();
                playButton.textContent = 'Stop';
                playChecker = false;
            } else {
                alert('hehe');
                playButton.textContent = 'Play';
                playButton.parentNode.style.border = 'solid black';

                sound.stop();

                playChecker = true;
            }
        } else if (playButton.tagName === 'BUTTON' && playButton.id === 'play-all-button') {
            console.log('stoppa alla samples!!!!');
            if(playChecker) {
                sound.play();
                playChecker = false;
            } else {
                sound.stop();
                playChecker = true;
            }
        }



    // if(playButton.id === 'play-all-button') {
    //     if(playChecker) {
    //
    //
    //         // $('.draggable-content').find('button').each(function(){  //finds all buttons in the class
    //         //     let innerDivId = $(this).attr('id'); //the id of the play buttons
    //         //     console.log(innerDivId);
    //         //     let allButtons = document.querySelector('#' + innerDivId);
    //         //     allButtons.textContent = 'Stop';
    //         //     allButtons.parentNode.style.border = 'solid limegreen';
    //         // });
    //         sound.play();
    //         // playButton.textContent = 'Stop all samples';
    //         playChecker = false;
    //     } else {
    //         sound.stop();
    //         // playButton.textContent = 'Play all samples';
    //         // playButton.parentNode.style.border = 'solid black';
    //         playChecker = true;
    //     }
    // }
});

module.exports = samplebox;