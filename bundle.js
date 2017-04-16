(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

let Desktop = require('./javascript/desktop');

new Desktop();

    
},{"./javascript/desktop":2}],2:[function(require,module,exports){
'use strict';

const Samplebox = require('./samplebox');
let idCounter = 0;

function Desktop() {
    let wrapper = document.querySelector('#wrapper');
    let channelDiv = document.querySelector('#snaptarget');
    let removeButton = document.querySelector('#remove-sample');
    let sampleList = document.querySelector('#sample-list'); //The list with the samples

    let sampleboxes = document.querySelector('.draggable-content ui-draggable ui-draggable-handle');
    
    /**
     * Sends audiosample path to the samplebox function
     */
    sampleList.addEventListener('click', function(event) {
        Samplebox.samplebox(idCounter, $(event.target).text());
        idCounter += 1;
    });

    // removeButton.addEventListener('click', function(event) {
        
    // });
}

module.exports = Desktop;






},{"./samplebox":3}],3:[function(require,module,exports){
'use strict';

let playChecker = true;
let wrapper = document.querySelector('#wrapper');
let inactiveSamples = document.querySelector('#inactive-samples');
let samples = [];       //Array with all unused loaded samples
let samples1 = [];

let activeSamples = []; //Array with the channels current samples

let channel1 = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];      //Channel 1's list of samples
let channel2 = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];      //Channel 2's list of samples

let context = new AudioContext();

    $('.sample-slot').droppable({
            drop: function (event, ui) {
                
                let draggableId = ui.draggable.find("button").attr("data-playbuttonid");    //ta ut samplets index från sample arrayen
                let droppableHelper = $(this).attr("helper");                               //lägg den i index (droppableId) i playlsit arrayen
                let droppableId = $(this).attr("id");
                console.log('draggable sample '  + draggableId + ' dropped on ' + droppableId);

                //check which channel to add the sample to
                if(droppableId.includes('channel1Slot')) {
                    channel1.splice(droppableHelper, 1, samples[draggableId]);  //put the dropped sample at the <id>-slotX index in the channel1 array
                    $('#channel1Slot' + droppableHelper).droppable('disable');
                }

                //check which channel to add the sample to
                if(droppableId.includes('channel2Slot')) { 
                    channel2.splice(droppableHelper, 1, samples1[draggableId]);  //put the dropped sample at the <id>-slotX index in the channel1 array
                    $('#channel2Slot' + droppableHelper).droppable('disable');
                }
                
            },
            // out: function(event, ui) {  
            //     ui.draggable.find("button").attr("data-playbuttonid");
            //     // let index = activeSamples.indexOf(audiosample);           
            //     // activeSamples.splice(index, 1);                 //Remove the sample 
            //     ui.draggable('destroy');
            // }
        });

/**
 * Skapar en samplebox div som är draggable + innehåller ett sample + en play knapp
 * @param id = idCounter
 * @param sample = path to sample
 */
function samplebox(id, sample) {

    $(function () {
        $('#samplebox' + id).draggable({
            revert: 'invalid',
            zIndex: 10,
            snap: '.sample-slot',
            snapMode: 'inner',
            snapTolerance: 80
        });   
    });

    let sampleBox = document.createElement('div');
    sampleBox.setAttribute('class', 'draggable-content');
    sampleBox.setAttribute('id', 'samplebox' + id);
    sampleBox.setAttribute('sample', sample);
    
    //Color-picker for the samples
    switch(sample) {
        case 'Lead Melody.ogg':
            sampleBox.style.backgroundColor = 'ghostwhite';
            break;
        case 'Piano Chords.ogg':
            sampleBox.style.backgroundColor = 'black';
            break;
        case 'Synth Chords.ogg':
            sampleBox.style.backgroundColor = '#008395';
            break;
        case 'Weird Synth.wav':
            sampleBox.style.backgroundColor = 'pink';
            break;
    }

    /**
     * The 'play' button for specific samplebox
     */
    let playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.setAttribute('data-playbuttonid', id);
    playButton.setAttribute('class', 'sampleButton');
    playButton.setAttribute('id', 'playbutton' + id);

    //Create new audio sample
    let audiosample = './audio/' + sample;
    
    inactiveSamples.appendChild(sampleBox);
    sampleBox.appendChild(playButton);

    loadSound('./audio/Silence.ogg', true); 
    loadSound(audiosample, false);
}

    //https://dl.dropboxusercontent.com/s/6s6rn6rcdlggdzj/Weird%20Synth.wav?dl=0

    function loadSound(audiosample, silence) {
        let request = new XMLHttpRequest();
        request.open('GET', audiosample, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            context.decodeAudioData(request.response, function(buffer) {
                if(silence) {
                    for(let i = 0; i < channel1.length; i++) {
                        if(channel1[i] === undefined) {
                            channel1.splice(i, 1, buffer);
                        }
                    }
                    for(let j = 0; j < channel2.length; j++) {
                        if(channel2[j] === undefined) {
                            channel2.splice(j, 1, buffer);
                        }
                    }
                } else {
                    samples.push(buffer); 
                    samples1.push(buffer);
                }
            }, function() {
                console.error('Could not load a sample');
            });
        }
        request.send();
    }


    let sound;  //channel 1 sound handler
    let sound1; //channel 2 sound handler
    let audio;
    let audio1;

    function playChannel1() {
        let audioStart = context.currentTime;  //start the sound at this time and then schedule next
        let next = 0;
        
        for(let i = 0; i < 8; i++) {
            bufferBuilder1(audioStart, next);
            next++;
        }
    }

    function playChannel2() {
        let audioStart = context.currentTime;  //start the sound at this time and then schedule next
        let next = 0;

        for(let i = 0; i < 8; i++) {
            bufferBuilder2(audioStart, next);
            next++;
        }
        
        
        
    }

    function bufferBuilder1(audioStart, index) {
        let playingSlot = document.querySelector('#channel1Slot' + index);
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
        playingSlot.style.opacity = '1';
        audio = context.createBufferSource(); 
        audio.buffer = channel1[index]; 
        audio.connect(context.destination);  
        let soundDuration = audio.buffer.duration;
        audio.start(audioStart + (soundDuration * index));

        audio.onended = function() {
            playingSlot.style.boxShadow = '0 0 6px 3px rgba(0, 0, 0, 0.5)';
            playingSlot.style.opacity = '0.5';

            if(index === 7) {
                for(let i = 0; i < 8; i++) {
                    let reset = document.querySelector('#channel1Slot' + i);
                    reset.style.opacity = '1';
                }
            }
        }
    }

    function bufferBuilder2(audioStart, index) {
        let playingSlot = document.querySelector('#channel2Slot' + index);
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
        audio1 = context.createBufferSource(); 
        audio1.buffer = channel2[index]; 
        audio1.connect(context.destination);  
        let soundDuration = audio1.buffer.duration;
        audio1.start(audioStart + (soundDuration * index));

        audio1.onended = function() {
            playingSlot.style.boxShadow = '0 0 6px 3px rgba(0, 0, 0, 0.5)';
            playingSlot.style.opacity = '0.5';

            if(index === 7) {
                for(let i = 0; i < 8; i++) {
                    let reset = document.querySelector('#channel2Slot' + i);
                    reset.style.opacity = '1';
                }
            }
        }
    }

document.addEventListener('click', function(event) {
    let playButton = document.getElementById(event.target.id);

    /**
     * Play sample
     */
        if(playButton.tagName === 'BUTTON' && playButton.className === 'sampleButton') {
            console.log(playButton.tagName);
            playButton.textContent = 'Play';

            if(playChecker) {
                // playChannel1(playButton.getAttribute("data-playbuttonid"));
                playButton.textContent = 'Stop';
                playChecker = false;
            } else {
                playButton.textContent = 'Play';
                playButton.parentNode.style.border = 'solid black';
                stopSound();
                playChecker = true;
            }
        } else if (playButton.tagName === 'BUTTON' && playButton.id === 'play-all-button') {
            if(playChecker) {
                playChecker = false;
                playChannel1();
                playChannel2();
                playButton.textContent = 'Stop all samples';
                
            } else {
                playChecker = true;
                stopSound();
                playButton.textContent = 'Play all samples';
                
            }
        }    
});

module.exports = {
    samplebox: samplebox
}
},{}]},{},[1]);
