'use strict';

const SampleHandler = require('./samplebox');

let idCounter = 0;
let playChecker = true;
let muteChecker = true;

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
    sampleList.addEventListener('click', function(event) {
        console.log(event.target.id);
        if(event.target.id === 'sample-list') {
            return;
        } else {
            samplebox(idCounter, $(event.target).text(), event);
            idCounter += 1;
        }
    });

    

    /**
     * Skapar en samplebox div som är draggable + innehåller ett sample + en play knapp
     * @param id = idCounter
     * @param sample = path to sample
     */
    function samplebox(id, sample, e) {
        
        $(function () {
            $('#samplebox' + id).draggable({
                revert: 'invalid', 
                // helper: 'clone',
                containment: 'document',
                zIndex: 10,
                opacity: 0.5,
                snap: '.sample-slot',
                scroll: false,
                snapMode: 'inner',
                drag: function(event, ui) {
                    document.querySelector('#garbageCan').style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
                    document.querySelector('#garbageCan').style.borderRadius = '5px';
                    document.querySelector('#garbageCan').style.backgroundColor = '#1e4059';
                    document.querySelector('#garbageCan').style.opacity = '0.8';
                },
                stop: function(event, ui) {
                    document.querySelector('#garbageCan').style.boxShadow = '';
                    document.querySelector('#garbageCan').style.backgroundColor = '';
                    document.querySelector('#garbageCan').style.opacity = '';
                },
            });   
        });

        let sampleBox = document.createElement('div');
        sampleBox.setAttribute('class', 'draggable-content');
        sampleBox.setAttribute('id', 'samplebox' + id);
        sampleBox.setAttribute('sample', sample);
        let img = document.createElement('img');
        
        switch(sample) {
            case 'HIMITSU Big Synth Chord.ogg':
                img.src = "./images/synth_icon.png";
                sampleBox.style.backgroundColor = '#27a0c4';
                break;
            case 'HIMITSU Soft Piano.ogg':
                img.src = "./images/piano_icon.png";
                sampleBox.style.backgroundColor = '#bdff92';
                break;
            case 'HIMITSU Piano Low.ogg':
                img.src = "./images/piano_icon.png";
                sampleBox.style.backgroundColor = '#82cd52';
                break;
            case 'HIMITSU Drum Beat.ogg':
                img.src = "./images/drums_icon.png";
                break;
            case 'HIMITSU Main Melody.ogg':
                img.src = "./images/synth_icon.png";
                sampleBox.style.backgroundColor = '#64d5f7';
                break;
            case 'HIMITSU Cute Vocals.ogg':
                img.src = "./images/vocals_icon.png";
                sampleBox.style.backgroundColor = '#e998ff';
                break;
            case 'HIMITSU Soft Synth.ogg':
                img.src = "./images/synth_icon.png";
                sampleBox.style.backgroundColor = '#93e6ff';
                break;
        }

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
        SampleHandler.loadSound('./audio/Silence.ogg', true); 
        SampleHandler.loadSound(audiosample, false);

        inactiveSamples.appendChild(sampleBox);
        sampleBox.appendChild(playButton);
        sampleBox.appendChild(img);
    }
    

    /**
     * Button handler
     */
    document.addEventListener('click', function(event) {
        if(event.target.id === '') {
            return;
        } else {
            let playButton = document.getElementById(event.target.id);
            
            //'play-specific-sample-button'
            if(playButton.tagName === 'I' && playButton.className === 'fa fa-play-circle' || playButton.tagName === 'I' && playButton.className === 'fa fa-stop-circle') {
                if(playChecker) {
                    SampleHandler.previewSample(playButton.getAttribute("data-playbuttonid"), false);
                    playButton.removeAttribute('class');
                    playButton.setAttribute('class', 'fa fa-stop-circle');
                    playChecker = false;
                } else {
                    SampleHandler.previewSample(null, true);
                    playButton.removeAttribute('class');
                    playButton.setAttribute('class', 'fa fa-play-circle');
                    playChecker = true;
                }
            //'play-all-channels-button'
            } else if (playButton.tagName === 'I' && playButton.id === 'play-all-button' || playButton.tagName === 'I' && playButton.id === 'stop-all-button') {
                if(playButton.id === 'play-all-button') {
                    SampleHandler.playChannels();
                    playButton.style.opacity = '';
                    playButton.style.color = '#d3e2ed';
                    playButton.style.pointerEvents = 'none';    //prevent spamming multiple layer of sounds by disabling button
                    document.querySelector('#stop-all-button').style.opacity = '0.6';
                    document.querySelector('#stop-all-button').style.color = '';
                    
                } else {
                    SampleHandler.stopAll();
                    playButton.style.opacity = '';
                    playButton.style.color = '#d3e2ed';
                    document.querySelector('#play-all-button').style.opacity = '0.6';
                    document.querySelector('#play-all-button').style.color = '';
                    document.querySelector('#play-all-button').style.pointerEvents = '';
                }
            } else if(playButton.type === 'checkbox') {

                //Check if checkbox is checked or not
                var idSelector = function() { return this.id; };
                let checkedChannel = $(":checkbox:checked").map(idSelector).get();
                let notChecked = $(":checkbox:not(:checked)").map(idSelector).get();

                for(let i = 0; i < checkedChannel.length; i++) {
                    SampleHandler.muteChannel(checkedChannel[i]);
                }
                for(let j = 0; j < notChecked.length; j++) {
                    SampleHandler.unmuteChannel(notChecked[j]);
                }
            }
        }
    });
}

module.exports = Desktop;





