(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

let Desktop = require('./javascript/desktop');

new Desktop();

    
},{"./javascript/desktop":2}],2:[function(require,module,exports){
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






},{"./samplebox":3}],3:[function(require,module,exports){
// 'use strict';

let wrapper = document.querySelector('#wrapper');
let inactiveSamples = document.querySelector('#inactive-samples');
let volumeKnob = document.querySelector('#volumeKnob');
let delayKnob = document.querySelector('#delayKnob');

let samples = [];       //Array with all unused loaded samples
let silentAudio = [];
let testArray = [];

let channel1 = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];      //Channel 1's list of samples
let channel2 = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];      //Channel 2's list of samples
let channel3 = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];      //Channel 3's list of samples
let channel4 = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];      //Channel 4's list of samples

let context = new AudioContext();
let gainNode = context.createGain();

let channel1Gain = context.createGain();
let channel2Gain = context.createGain();
let channel3Gain = context.createGain();
let channel4Gain = context.createGain();


let filter = context.createBiquadFilter();
filter.type = 'lowpass'; 
filter.frequency.value = 800;
// let channel1 = new Channel(context);

gainNode.connect(context.destination);
channel1Gain.connect(gainNode);
channel2Gain.connect(gainNode);
channel3Gain.connect(gainNode);
channel4Gain.connect(gainNode);

let audioTime = context.currentTime;


$('#garbageCan').droppable({
        drop: function (event, ui) {
                
            let previousSlot = ui.draggable.attr("previous-slot");
            let droppableHelper = ui.draggable.attr("helper");  

            let draggableHelper = ui.draggable.find("i").attr("data-playbuttonid");
            let draggableId = document.querySelector('#' + ui.draggable.attr("id"));

            if(previousSlot !== undefined) {
                if(previousSlot.includes('channel1Slot')) {
                    channel1.splice(droppableHelper, 1, silentAudio[droppableHelper]);  //put the dropped sample at the <id>-slotX index in the channel1 array
                    $('#' + previousSlot).droppable('enable');
                    draggableId.style.visibility = 'hidden';
                }
                if(previousSlot.includes('channel2Slot')) {
                    channel2.splice(droppableHelper, 1, silentAudio[droppableHelper]);  //put the dropped sample at the <id>-slotX index in the channel2 array
                    $('#' + previousSlot).droppable('enable');
                    draggableId.style.visibility = 'hidden';
                }
                if(previousSlot.includes('channel3Slot')) {
                    channel3.splice(droppableHelper, 1, silentAudio[droppableHelper]);  //put the dropped sample at the <id>-slotX index in the channel3 array
                    $('#' + previousSlot).droppable('enable');
                    draggableId.style.visibility = 'hidden';
                }
                if(previousSlot.includes('channel4Slot')) {
                    channel4.splice(droppableHelper, 1, silentAudio[droppableHelper]);  //put the dropped sample at the <id>-slotX index in the channel3 array
                    $('#' + previousSlot).droppable('enable');
                    draggableId.style.visibility = 'hidden';
                }
            } else {
                draggableId.style.visibility = 'hidden';
            }     
        }    
});

$('.sample-slot').droppable({
    drop: function (event, ui) {
        let draggableHelper = ui.draggable.find("i").attr("data-playbuttonid");    //ta ut samplets index från sample arrayen
        let droppableHelper = $(this).attr("helper");                               //lägg den i index (droppableId) i playlsit arrayen
        let droppableId = $(this).attr("id");
        let draggableId = document.querySelector('#' + ui.draggable.attr("id"));
        console.log(droppableId);
        draggableId.setAttribute('previous-slot', droppableId);
        draggableId.setAttribute('helper', droppableHelper);

        // console.log('draggable sample '  + draggableId + ' dropped on ' + droppableId);

        if(droppableId.includes('channel1Slot')) {
            channel1.splice(droppableHelper, 1, samples[draggableHelper]);  //put the dropped sample at the <id>-slotX index in the channel array
            // $('#' + droppableId).droppable('disable');
        }
        if(droppableId.includes('channel2Slot')) { 
            channel2.splice(droppableHelper, 1, samples[draggableHelper]);  
            // $('#' + droppableId).droppable('disable');  // disabla droppable om jag stoppar in ett sample i sloten
                                                        // göra sloten droppable igen om jag tar bort/flyttar ett sample
        }
        if(droppableId.includes('channel3Slot')) {
            channel3.splice(droppableHelper, 1, samples[draggableHelper]);  
            // $('#' + droppableId).droppable('disable');
        }   
        if(droppableId.includes('channel4Slot')) {
            channel4.splice(droppableHelper, 1, samples[draggableHelper]);  
            // $('#' + droppableId).droppable('disable');
        }   

        $(this).append(ui.draggable);
        ui.draggable.position({of: $(this), my: 'left top', at: 'left top'});

        // document.querySelector('#' + droppableId).appendChild(draggableId);

        // ui.draggable.position({
        //     my: 'center',
        //     at: 'center',
        //     of: $(this),
        //     using: function(pos) {
        //         $(this).animate(pos, 'center', 'linear');
        //     } 
        // });

        // ui.draggable.detach().appendTo(posElement);
        
        // let clonedElement = ui.helper.clone();
        // clonedElement.appendTo('#' + droppableId);
        // clonedElement.draggable
    
    },
    out: function(event, ui) { 
        let previousSlot = ui.draggable.attr("previous-slot"); 
        let draggableId = document.querySelector('#' + ui.draggable.attr("id"));
        let droppableId = $(this).attr("id");
        let droppableHelper = $(this).attr("helper");    
        
        if(previousSlot.includes('channel1Slot')) {
            channel1.splice(droppableHelper, 1, silentAudio[droppableHelper]);  //put the dropped sample at the <id>-slotX index in the channel1 array
        }
        if(previousSlot.includes('channel2Slot')) {
            channel2.splice(droppableHelper, 1, silentAudio[droppableHelper]);  //put the dropped sample at the <id>-slotX index in the channel2 array
        }
        if(previousSlot.includes('channel3Slot')) {
            channel3.splice(droppableHelper, 1, silentAudio[droppableHelper]);  //put the dropped sample at the <id>-slotX index in the channel3 array
        }
        if(previousSlot.includes('channel4Slot')) {
            channel4.splice(droppableHelper, 1, silentAudio[droppableHelper]);  //put the dropped sample at the <id>-slotX index in the channel3 array
        }
    }
});
            
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
                        channel2.splice(i, 1, buffer);
                        channel3.splice(i, 1, buffer);
                        channel4.splice(i, 1, buffer);
                        silentAudio.push(buffer);
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

// let audios = [audio1, audio2, audio3];
let preview;        //preview samplebox
let audio1;         //channel 1 audio 
let audio2;         //channel 2 audio 
let audio3;         //channel 3 audio
let audio4;
let sources1 = [];  //audio1 buffersource nodes
let sources2 = [];  //audio2 buffersource nodes
let sources3 = [];  //audio3 buffersource nodes
let sources4 = [];  //audio4 buffersource nodes

function playChannels(index) {
    let audioStart = context.currentTime;  //start the sound at this time
    let next = 0;
    // scheduler(audioStart, next, index)
    for(let i = 0; i < 8; i++) {
        scheduler1(audioStart, next);
        scheduler2(audioStart, next);
        scheduler3(audioStart, next);
        scheduler4(audioStart, next);
        next++;
    }
}

function scheduler1(audioStart, index) {
    let playingSlot = document.querySelector('#channel1Slot' + index);
    playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
    // audios[index] = context.createBufferSource(); 
    audio1 = context.createBufferSource(); 
    sources1.splice(index, 0, audio1);
    audio1.buffer = channel1[index]; 
    audio1.connect(channel1Gain);
    audio1.start(audioStart + (audio1.buffer.duration * index));
    audio1.onended = function() {
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(0, 0, 0, 0.5)';
        playingSlot.style.opacity = '0.5';
    }
}

function scheduler2(audioStart, index) {
    let playingSlot = document.querySelector('#channel2Slot' + index);
    playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
    audio2 = context.createBufferSource();
    sources2.splice(index, 0, audio2);
    audio2.buffer = channel2[index];  //array with all the loaded audio
    audio2.connect(channel2Gain);
    audio2.start(audioStart + (audio2.buffer.duration * index));
    audio2.onended = function() {
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(0, 0, 0, 0.5)';
        playingSlot.style.opacity = '0.5';
    }
}

function scheduler3(audioStart, index) {
    let playingSlot = document.querySelector('#channel3Slot' + index);
    playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
    audio3 = context.createBufferSource();
    sources3.splice(index, 0, audio3);
    audio3.buffer = channel3[index];  //array with all the loaded audio
    audio3.connect(channel3Gain);
    audio3.start(audioStart + (audio3.buffer.duration * index));  
    audio3.onended = function() {
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(0, 0, 0, 0.5)';
        playingSlot.style.opacity = '0.5';
    }
}

function scheduler4(audioStart, index) {
    let playingSlot = document.querySelector('#channel4Slot' + index);
    playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
    audio4 = context.createBufferSource();
    sources4.splice(index, 0, audio4);
    audio4.buffer = channel4[index];  //array with all the loaded audio
    audio4.connect(channel4Gain);
    audio4.start(audioStart + (audio4.buffer.duration * index));
    audio4.onended = function() {
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(0, 0, 0, 0.5)';
        playingSlot.style.opacity = '0.5';
        if(index === 7) {      //Reset the opacity when channel is finished playing or stopped
            for(let i = 0; i < 8; i++) {
                for(let j = 1; j < 5; j++) {
                    document.querySelector('#channel' + j + 'Slot' + i).style.opacity = '1';
                }
            }
        }
    }
}

function previewSample(index, stopper) {
    if(stopper) {
        preview.stop(0);
    } else {
        preview = context.createBufferSource(); 
        preview.buffer = samples[index]; 
        preview.connect(context.destination);  
        preview.start(0);
    }
}

function stopAll() {
    for(let i = 0; i < 8; i++) {
        if (sources1[i]) {
            sources1[i].stop(0);
            sources2[i].stop(0);
            sources3[i].stop(0);
            sources4[i].stop(0);
        }
    }
}

function muteChannel(id) {
    if(id == 1) {
        channel1Gain.gain.value = 0;
    }
    if(id == 2) {
        channel2Gain.gain.value = 0;
    }    
    if(id == 3) {
        channel3Gain.gain.value = 0;
    }
    if(id == 4) {
        channel4Gain.gain.value = 0;
    }
}

function unmuteChannel(id) {
    if(id == 1) {
        channel1Gain.gain.value = 1;
    }
    if(id == 2) {
        channel2Gain.gain.value = 1;
    }    
    if(id == 3) {
        channel3Gain.gain.value = 1;
    }
    if(id == 4) {
        channel4Gain.gain.value = 1;
    }
}

volumeKnob.addEventListener('click', function() {
    let volume = volumeKnob.value / 100;
    let volumeUp = document.querySelector('#volume-icon-up');
    let volumeDown = document.querySelector('#volume-icon-down');
    gainNode.gain.value = volume;

    if(volume < 0.5) {
        volumeDown.style.color = 'ghostwhite';
        volumeUp.style.color = '#8FB3CD';
    } else {
        volumeDown.style.color = '#8FB3CD';
        volumeUp.style.color = 'ghostwhite';
    }
    console.log('Volume: ' + (Math.round(gainNode.gain.value * 100)) + '%');
})
 
module.exports = {
    loadSound: loadSound,
    playChannels: playChannels,
    previewSample: previewSample, 
    stopAll: stopAll,
    muteChannel: muteChannel,
    unmuteChannel: unmuteChannel
};
},{}]},{},[1]);
