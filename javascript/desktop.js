'use strict';

const SampleHandler = require('./samplebox');

let idCounter = 0;
let playChecker = true;

function Desktop() {
    let wrapper = document.querySelector('#wrapper');
    let channelDiv = document.querySelector('#snaptarget');
    let removeButton = document.querySelector('#remove-sample');
    let sampleList = document.querySelector('#sample-list'); //The list with the samples
    let sampleboxes = document.querySelector('.draggable-content ui-draggable ui-draggable-handle');
    let inactiveSamples = document.querySelector('#inactive-samples');

    /**
     * Sends audiosample path to the samplebox function
     */
    sampleList.addEventListener('mousedown', function(event) {
        samplebox(idCounter, $(event.target).text(), event);
        idCounter += 1;
    }, false);

    /**
     * Skapar en samplebox div som är draggable + innehåller ett sample + en play knapp
     * @param id = idCounter
     * @param sample = path to sample
     */
    function samplebox(id, sample, e) {
        
        $(function () {
            $('#samplebox' + id).draggable({
                revert: 'invalid',
                zIndex: 10,
                opacity: 0.5,
                snap: '.sample-slot',
                snapMode: 'inner'
            });   
        });

        let sampleBox = document.createElement('div');
        sampleBox.setAttribute('class', 'draggable-content');
        sampleBox.setAttribute('id', 'samplebox' + id);
        sampleBox.setAttribute('sample', sample);
        
        //Color-picker for the samples
        // switch(sample) {
        //     case 'Lead Melody.ogg':
        //         sampleBox.style.backgroundColor = 'ghostwhite';
        //         break;
        //     case 'Piano Chords.ogg':
        //         sampleBox.style.backgroundColor = 'black';
        //         break;
        //     case 'Synth Chords.ogg':
        //         sampleBox.style.backgroundColor = '#008395';
        //         break;
        //     case 'Weird Synth.wav':
        //         sampleBox.style.backgroundColor = 'pink';
        //         break;
        // }

        /**
         * The 'play' button for specific samplebox
         */
        let playButton = document.createElement('i');
        playButton.setAttribute('data-playbuttonid', id);
        playButton.setAttribute('class', 'fa fa-play-circle');
        playButton.setAttribute('id', 'playbutton' + id);
        playButton.setAttribute('aria-hidden', 'true');
        playButton.style.fontSize = '30px';

        //Create new audio sample
        let audiosample = './audio/' + sample;
        
        inactiveSamples.appendChild(sampleBox);
        sampleBox.appendChild(playButton);
        SampleHandler.loadSound('./audio/Silence.ogg', true); 
        SampleHandler.loadSound(audiosample, false);
    }
    

    /**
     * Play buttons handler
     */
    document.addEventListener('click', function(event) {
        if(event.target.id === '') {
            return;
        } else {
            let playButton = document.getElementById(event.target.id);
            
            //'play-specific-sample-button'
            if(playButton.tagName === 'I' && playButton.className === 'fa fa-play-circle' || playButton.tagName === 'I' && playButton.className === 'fa fa-stop-circle') {
                if(playChecker) {
                    SampleHandler.previewSample(playButton.getAttribute("data-playbuttonid"));
                    playButton.removeAttribute('class');
                    playButton.setAttribute('class', 'fa fa-stop-circle');
                    playChecker = false;
                } else {
                    preview.stop();
                    playButton.removeAttribute('class');
                    playButton.setAttribute('class', 'fa fa-play-circle');
                    playChecker = true;
                }
            //'play-all-channels-button'
            } else if (playButton.tagName === 'I' && playButton.id === 'play-all-button' || playButton.tagName === 'I' && playButton.id === 'stop-all-button') {
                if(playButton.id === 'play-all-button') {
                    SampleHandler.playChannel1();
                    SampleHandler.playChannel2();
                    SampleHandler.playChannel3();
                    playButton.style.opacity = '1';
                    document.querySelector('#stop-all-button').style.opacity = '0.6';
                } else {
                    SampleHandler.stopAll();
                    playButton.style.opacity = '1';
                    document.querySelector('#play-all-button').style.opacity = '0.6';
                }
            }      
        }
    });
}

module.exports = Desktop;





