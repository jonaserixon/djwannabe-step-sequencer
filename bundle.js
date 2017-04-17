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

let testArray = [];

let channel1 = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];      //Channel 1's list of samples
let channel2 = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];      //Channel 2's list of samples

let context = new AudioContext();
let audioTime = context.currentTime;
$('.sample-slot').droppable({
        drop: function (event, ui) {
            
            let draggableId = ui.draggable.find("i").attr("data-playbuttonid");    //ta ut samplets index från sample arrayen
            let droppableHelper = $(this).attr("helper");                               //lägg den i index (droppableId) i playlsit arrayen
            let droppableId = $(this).attr("id");
            console.log('draggable sample '  + draggableId + ' dropped on ' + droppableId);

            //check which channel to add the sample to
            if(droppableId.includes('channel1Slot')) {
                channel1.splice(droppableHelper, 1, samples[draggableId]);  //put the dropped sample at the <id>-slotX index in the channel1 array
                $('#' + droppableId).droppable('disable');
            }

            //check which channel to add the sample to
            if(droppableId.includes('channel2Slot')) { 
                channel2.splice(droppableHelper, 1, samples[draggableId]);  //put the dropped sample at the <id>-slotX index in the channel1 array
                // $('#' + droppableId).droppable('disable');  //disabla droppable om jag stoppar in ett sample i sloten
                // göra sloten droppable igen om jag tar bort/flyttar ett sample
            }

            console.log('channel1: ' + channel1);
            console.log('channel2: ' + channel2);
            
        },
        out: function(event, ui) {  
            let droppableId = $(this).attr("id");
            console.log(droppableId);
            // let index = activeSamples.indexOf(audiosample);           
            // activeSamples.splice(index, 1);                 //Remove the sample 
            // $('#' + droppableId).droppable('enable');
        }
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

    loadSound('./audio/Silence.ogg', true); 
    loadSound(audiosample, false);
}

//https://dl.dropboxusercontent.com/s/6s6rn6rcdlggdzj/Weird%20Synth.wav?dl=0

// Store audio sample buffer in an array
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
            }
        }, function() {
            console.error('Could not load a sample');
        });
    }
    request.send();
}

let preview;    //preview samplebox
let audio;      //channel 1 audio 
let audio1;     //channel 2 audio 
let sources = [];
let sources1 = [];

function playChannel1() {
    let audioStart = context.currentTime;  //start the sound at this time
    let next = 0;
    
    for(let i = 0; i < 8; i++) {
        scheduler1(audioStart, next);
        next++;
    }
}

function playChannel2() {
    let audioStart = context.currentTime;  //start the sound at this time 
    let next = 0;

    for(let i = 0; i < 8; i++) {
        scheduler2(audioStart, next);
        next++;
    }
}

function scheduler1(audioStart, index) {
    let playingSlot = document.querySelector('#channel1Slot' + index);
    playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
    audio = context.createBufferSource(); 
    sources1[index] = audio;
    audio.buffer = channel1[index]; 
    audio.connect(context.destination);  
    audio.start(audioStart + (audio.buffer.duration * index));

    audio.onended = function() {
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(0, 0, 0, 0.5)';
        playingSlot.style.opacity = '0.5';

        if(index === 7) {      //Reset the opacity when channel is finished playing
            for(let i = 0; i < 8; i++) {
                let reset = document.querySelector('#channel1Slot' + i);
                reset.style.opacity = '1';
            }
        }
    }
}


function scheduler2(audioStart, index) {

    let playingSlot = document.querySelector('#channel2Slot' + index);
    playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
    audio1 = context.createBufferSource();
    sources[index] = audio1; 
    audio1.buffer = channel2[index];  //array with all the loaded audio
    audio1.connect(context.destination);  
    audio1.start(audioStart + (audio1.buffer.duration * index));
        
    audio1.onended = function() {
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(0, 0, 0, 0.5)';
        playingSlot.style.opacity = '0.5';

        if(index === 7) {       //Reset the opacity when channel is finished playing
            for(let i = 0; i < 8; i++) {
                let reset = document.querySelector('#channel2Slot' + i);
                reset.style.opacity = '1';
            }
        }
    }

}

function previewSample(index) {
    preview = context.createBufferSource(); 
    preview.buffer = samples[index]; 
    preview.connect(context.destination);  
    preview.start(0);
}

function stopAll() {
    for(let i = 0; i < 8; i++) {
        if (sources[i]) {
            sources[i].stop(0);
        }
        if(sources1[i]) {
            sources1[i].stop(0);
        }
    }
        
}
/**
 * Play buttons handler
 */
document.addEventListener('click', function(event) {
    console.log(context.currentTime);
    if(event.target.id === '') {
        return;
    } else {
        let playButton = document.getElementById(event.target.id);
        
        //'play-specific-sample-button'
        if(playButton.tagName === 'I' && playButton.className === 'fa fa-play-circle' || playButton.tagName === 'I' && playButton.className === 'fa fa-stop-circle') {
            if(playChecker) {
                previewSample(playButton.getAttribute("data-playbuttonid"));

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
        } else if (playButton.tagName === 'I' && playButton.id === 'play-all-button') {
            if(playChecker) {
                playChannel1();
                playChannel2();

                playButton.removeAttribute('class');
                playButton.setAttribute('class', 'fa fa-stop');
                playChecker = false;                
            } else {
                stopAll();
                // audio.stop(audioTime);
                // audio1.stop(audioTime);
                console.log('stop');
                playButton.removeAttribute('class');
                playButton.setAttribute('class', 'fa fa-play');
                playChecker = true;
            }
        }      
    }
});

module.exports = {
    samplebox: samplebox
}
},{}]},{},[1]);
