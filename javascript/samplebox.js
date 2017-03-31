'use strict';
// const $ = require('jquery');

let playChecker = true;
let wrapper = document.querySelector('#wrapper');
let samples = [];       //Array with all current samples

/**
 * The audio sample creator
 * sample - path to audio sample
 */
// function sampleFile(sample, playButton, sampleBox) {
//     let sound = new Howl({
//         src: './audio/' + sample,
//         vol: 1,
//         onend: function() {
//             playChecker = true;
//             sampleBox.style.border = 'solid black';
//             playButton.textContent = 'Play';
//         }
//     });
// }
//
//
// const sample1 = new Howl({
//     src: ['./audio/' + sample],
//     onend: function () {
//
//     }
// });


//The 'play-all' button
let playAllButton = document.createElement('button');
playAllButton.setAttribute('id', 'play-all-button');
playAllButton.textContent = 'Play all samples';

/**
 * Skapar en samplebox div som är draggable + innehåller ett sample + en play knapp
 * @param id
 * @param sample = <li> texten som klickas på (ex. 'Weird Synth.wav')
 */
function samplebox(id, sample) {
    console.log('samplebox() körs');
    console.log(sample);
    // $(function() {
    //     $('#samplebox' + id).draggable({
    //         snap: ".main-timeline" //Snappar till playlisten
    //     });
    // });

    let lastPlace;

    $(function () {
        $('#samplebox' + id).draggable({
            revert: true,
            zIndex: 10,
            snap: '.main-timeline',
            snapTolerance: 40,

            start: function (event, ui) {
                lastPlace = "#"+$(this).parent().attr("id");

            }
        });

        $('.main-timeline').droppable({
            drop: function (event, ui) {
                let dropped = ui.draggable;
                let droppedOn = this;

                if ($(droppedOn).children().length > 0) {
                    $(droppedOn).find('.main-timeline').detach().appendTo($(lastPlace));
                }

                $(dropped).detach().css({
                    top: 0,
                    left: 0
                }).appendTo($(droppedOn));
            }
        });
    });

    // $(function () {
    //
    // })



    let sampleBox = document.createElement('div');
    sampleBox.setAttribute('class', 'draggable-content');
    sampleBox.setAttribute('id', 'samplebox' + id);
    sampleBox.setAttribute('sample', sample);

    if($(".draggable-content").length > 0) {   //play all button appears when 2 sampleboxes appear on screen
        wrapper.appendChild(playAllButton);
    }
    /**
     * The 'play' button for specific samplebox
     */
    let playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.setAttribute('data-playbuttonid', id);
    playButton.setAttribute('class', 'sampleButton');
    playButton.setAttribute('id', 'playbutton' + id);

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

    samples.push(new Howl({
        src: './audio/' + sample,
        vol: 1,
        onend: function() {
            playChecker = true;
            sampleBox.style.border = 'solid black';
            playButton.textContent = 'Play';
        }
    }));

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

    /**
     * Play specific sample
     */
        if(playButton.tagName === 'BUTTON' && playButton.className === 'sampleButton') {
            console.log(playButton.tagName);
            playButton.textContent = 'Play';

            if(playChecker) {
                playButton.parentNode.style.border = 'solid limegreen';
                // sampleFile(getSample, playButton, playButton.parentNode);
                samples[playButton.getAttribute("data-playbuttonid")].play();
                playButton.textContent = 'Stop';
                playChecker = false;
            } else {
                playButton.textContent = 'Play';
                playButton.parentNode.style.border = 'solid black';
                samples[playButton.getAttribute("data-playbuttonid")].stop();
                playChecker = true;
            }
        } else if (playButton.tagName === 'BUTTON' && playButton.id === 'play-all-button') {
            if(playChecker) {
                for(let i = 0; i < samples.length; i++) {
                    samples[i].play();
                }
                playButton.textContent = 'Stop all samples';
                playChecker = false;
            } else {
                for(let i = 0; i < samples.length; i++) {
                    samples[i].stop();
                }
                playButton.textContent = 'Play all samples';
                playChecker = true;
            }
        }

    // if(playButton.id === 'play-all-button') {
    //     if(playChecker) {
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