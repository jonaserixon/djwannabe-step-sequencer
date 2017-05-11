(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

let Desktop = require('./javascript/desktop');

new Desktop();

    
},{"./javascript/desktop":3}],2:[function(require,module,exports){
exports.audioSamples = function() {
    let audioPath = './audio/HIMITSU';

    return [
        audioPath + " Big Synth Chord.ogg",
        audioPath + " Soft Piano.ogg",
        audioPath + " Soft Synth.ogg",
        audioPath + " Piano Low.ogg",
        audioPath + " Drum Beat.ogg",
        audioPath + " Cute Vocals.ogg",
        audioPath + " Main Melody.ogg"
    ];   
}
},{}],3:[function(require,module,exports){
const SampleHandler = require('./samplehandler');

let idCounter = 0;
let playChecker = true;
let muteChecker = true;
let recordChecker = true;

function Desktop() {
    let wrapper = document.querySelector('#wrapper');
    let channelDiv = document.querySelector('#snaptarget');
    let removeButton = document.querySelector('#remove-sample');
    let sampleList = document.querySelector('#sample-list'); 
    let sampleboxes = document.querySelector('.draggable-content ui-draggable ui-draggable-handle');
    let inactiveSamples = document.querySelector('#inactive-samples');
    let playlistContainer = document.querySelector('#playlist-container');
    
    //Create channels + sample slots
    function createChannel(numChannels, numSlots) {
        for(let i = 1; i < numChannels; i++) {
            let snapDiv = document.createElement('div');
            snapDiv.setAttribute('id', 'snaptarget' + i);
            snapDiv.setAttribute('class', 'main-timeline');
            let h3 = document.createElement('h3');
            h3.textContent = i;
            snapDiv.appendChild(h3);
            for(let j = 0; j < numSlots; j++) {
                let sampleSlot = document.createElement('div');
                sampleSlot.classList.add('sample-slot');
                sampleSlot.setAttribute('id', 'channel' + i + 'Slot' + j);
                sampleSlot.setAttribute('helper', j);
                playlistContainer.appendChild(snapDiv);
                snapDiv.appendChild(sampleSlot);
            }
        }
    }

    createChannel(6, 8);
    SampleHandler.droppableDivs();

    //Sends audiosample path to samplebox()
    sampleList.addEventListener('click', function(event) {
        if(event.target.id === 'sample-list' || event.target.id === 'library-h3') {
            return;
        } else {
            samplebox(idCounter, $(event.target).text(), event);
            $('#starting-point').prop('disabled', false); //enable all starting point buttons
            idCounter += 1;
        }
    });

    $('#mixer-board').draggable({containment: 'document'});
    
    /**
     * Skapar en samplebox div som är draggable + innehåller ett sample + en play knapp
     * @param id = idCounter
     * @param sample = path to sample
     */
    function samplebox(id, sample, event) {
        //Make samplebox draggable
        $(function () {
            $('#samplebox' + id).draggable({
                revert: 'invalid', 
                disabled: false,
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

        //Create a samplebox
        let sampleBox = document.createElement('div');
        sampleBox.setAttribute('class', 'draggable-content');
        sampleBox.setAttribute('id', 'samplebox' + id);
        sampleBox.setAttribute('sample-id', event.target.getAttribute('sample-id'));
        let img = document.createElement('img');
        
        //Set color and image
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
        //Create a preview button
        let playButton = document.createElement('i');
        playButton.setAttribute('data-playbuttonid', event.target.getAttribute('sample-id'));
        playButton.setAttribute('class', 'fa fa-play-circle');
        playButton.setAttribute('id', 'playbutton' + id);
        playButton.setAttribute('aria-hidden', 'true');
        playButton.style.fontSize = '30px';

        inactiveSamples.appendChild(sampleBox);
        sampleBox.appendChild(playButton);
        sampleBox.appendChild(img);
    }

    //Button handler
    document.addEventListener('click', function(event) {
        if(event.target.id === '') {
            return;
        } else {
            let playButton = document.getElementById(event.target.id);
            //Preview button
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
            //Global play/stop button
            } else if (playButton.tagName === 'I' && playButton.id === 'play-all-button' || playButton.tagName === 'I' && playButton.id === 'stop-all-button') {    //'play-all-channels-button'
                if(playButton.id === 'play-all-button') {
                    SampleHandler.playChannels(false, playButton);
                } else {
                    SampleHandler.stopAll(playButton);
                    if(recordChecker === false) {
                        SampleHandler.audioRecorder(false);
                        recordChecker = true;
                    }
                }
            //Mixer checkbox
            } else if(playButton.type === 'checkbox') {     
                let idSelector = function() { return this.id; };
                let checkedChannel = $(":checkbox:checked").map(idSelector).get();
                let notChecked = $(":checkbox:not(:checked)").map(idSelector).get();
                for(let i = 0; i < checkedChannel.length; i++) {
                    SampleHandler.muteChannel(checkedChannel[i]);
                }
                for(let j = 0; j < notChecked.length; j++) {
                    SampleHandler.unmuteChannel(notChecked[j]);
                }
            //Record button
            } else if(playButton.id === 'record-button') {
                if(recordChecker) {
                    SampleHandler.playChannels(false);
                    SampleHandler.audioRecorder(true);
                    recordChecker = false;
                } else {
                    SampleHandler.stopAll();
                    SampleHandler.audioRecorder(false);
                    recordChecker = true;
                }
            //Project-controller locker
            } else if(playButton.id === 'locker') {
                if(playButton.className === 'fa fa-lock') {
                    $('#project-controller').draggable({containment: 'document'});
                    $('#project-controller').draggable('enable');
                    playButton.removeAttribute('class');
                    playButton.setAttribute('class', 'fa fa-unlock-alt ');
                } else {
                    $('#project-controller').draggable('disable');
                    playButton.removeAttribute('class');
                    playButton.setAttribute('class', 'fa fa-lock');
                }
            }  
        }
    });

    //Playback starting point
    document.querySelector('#starting-point').addEventListener('change', function(event) {
        switch(this.options[this.selectedIndex].value) {
            case '1': SampleHandler.playChannels(1); 
                break;
            case '2': SampleHandler.playChannels(2); 
                break;
            case '3': SampleHandler.playChannels(3);
                break;
            case '4': SampleHandler.playChannels(4);
                break;
            case '5': SampleHandler.playChannels(5);
                break;
            case '6': SampleHandler.playChannels(6);
                break;
            case '7': SampleHandler.playChannels(7);
                break;                    
        }
    });

    //Sample library minimizer
    $("#minimize-button").click(function(){
        if($(this).html() == "-"){
            $(this).html("+");
        }
        else{
            $(this).html("-");
        }
        $("#box").slideToggle();
    });

}

module.exports = Desktop;
},{"./samplehandler":4}],4:[function(require,module,exports){
const audioSamples = require('./audioSamples');

let wrapper = document.querySelector('#wrapper');
let inactiveSamples = document.querySelector('#inactive-samples');
let volumeKnob = document.querySelector('#volumeKnob');
let delayKnob = document.querySelector('#delayKnob');
let recordButton = document.querySelector('#record-button');
let mixerBoard = document.querySelector('#mixer-board');

let samples = audioSamples.audioSamples();

let blobCollecter = [];
let preview;

let channel1;  
let channel2;     
let channel3;       
let channel4;       
let channel5;      

let context = new AudioContext();

let gainNode = context.createGain(); //Create a gain node
let audioTime = context.currentTime; //Current time since audioContext declared

let channel1Gain = context.createGain();
let channel2Gain = context.createGain();
let channel3Gain = context.createGain();
let channel4Gain = context.createGain();
let channel5Gain = context.createGain();

let channel1Filter = context.createBiquadFilter();
let channel2Filter = context.createBiquadFilter();
let channel3Filter = context.createBiquadFilter();
let channel4Filter = context.createBiquadFilter();
let channel5Filter = context.createBiquadFilter();

channel1Filter.frequency.value = 20000;
channel2Filter.frequency.value = 20000;
channel3Filter.frequency.value = 20000;
channel4Filter.frequency.value = 20000;
channel5Filter.frequency.value = 20000;

let dest = context.createMediaStreamDestination();
let recorder = new MediaRecorder(dest.stream);

gainNode.connect(context.destination);
gainNode.connect(dest);

channel1Gain.connect(gainNode);
channel2Gain.connect(gainNode);
channel3Gain.connect(gainNode);
channel4Gain.connect(gainNode);
channel5Gain.connect(gainNode);

function Channel(id) {
    this.id = id;               //Channel id
    this.samples = [];          //channels audiobuffers
    this.sources = [];          //Keep track of buffersource nodes created from scheduler method
    this.timeouts = [];         //setTimeOuts
    this.sampleslotDivs = [];   //Sample-slot id
    this.channelGain = context.createGain();
    this.channelFilter = context.createBiquadFilter();
    this.channelFilter.frequency.value = 20000;

    for (let i = 0; i < 8; i++) {
        let theSlot = document.querySelector('#channel' + this.id + 'Slot' + i);
        this.sampleslotDivs.push(theSlot);
    }

    for (let i = 0; i < 8; i++) {
        loadSound(this, './audio/Silence.ogg');
    }
}

Channel.prototype = {
    addSample: function(sampleSlot, samplePath) {
        loadSound(this, samplePath, sampleSlot);
    },
    scheduler: function() {
        for (let i = 0; i < this.samples.length; i++) {
            
            let audio = context.createBufferSource();
            this.sources[i] = audio;
            audio.buffer = this.samples[i];
            audio.connect(this.channelFilter);
            this.channelFilter.connect(this.channelGain);
            this.channelGain.connect(gainNode);
            audio.start(context.currentTime + (audio.buffer.duration * i));
            this.timeouts.push(setTimeout(function() {
                // Add the border to the playing sample slot
                let playingSlot = this.sampleslotDivs[i];
                playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
            }.bind(this), audio.buffer.duration * i * 1000));
            
            audio.onended = function() {
                this.sampleslotDivs[i].style.boxShadow = '';
            }.bind(this);
        }
    },
    stop: function() {
        for (let i = 0; i < this.sources.length; i++) {
            this.sources[i].stop(0);
        }

        for (let i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]);
        }
    }   
}


function droppableHandler(droppableId, draggableUi, droppableHelper, draggableSampleId, channel) {
    $('#' + droppableId).droppable('enable');       
    if($('#' + droppableId).find('div').length > 0 && $('#' + droppableId).find('div').attr("id") != draggableUi.attr("id")) {
        $('#' + droppableId).find('div').first().remove();
    }
    channel.addSample(droppableHelper, samples[draggableSampleId]);
}

function garbageHandler(droppableHelper, previousSlot, draggableId, channel) {
    channel.addSample(droppableHelper, "./audio/Silence.ogg");
    $('#' + previousSlot).droppable('enable');
    document.querySelector('#' + previousSlot).removeChild(draggableId);
}

$('#garbageCan').droppable({
        drop: function (event, ui) {
            let previousSlot = ui.draggable.attr("previous-slot");
            let droppableHelper = ui.draggable.attr("helper");  
            let draggableHelper = ui.draggable.find("i").attr("data-playbuttonid");
            let draggableId = document.querySelector('#' + ui.draggable.attr("id"));
            if(previousSlot !== undefined) {
                if(previousSlot.includes('channel1Slot')) { garbageHandler(droppableHelper, previousSlot, draggableId, channel1); }
                if(previousSlot.includes('channel2Slot')) { garbageHandler(droppableHelper, previousSlot, draggableId, channel2); }
                if(previousSlot.includes('channel3Slot')) { garbageHandler(droppableHelper, previousSlot, draggableId, channel3); }
                if(previousSlot.includes('channel4Slot')) { garbageHandler(droppableHelper, previousSlot, draggableId, channel4); }
                if(previousSlot.includes('channel5Slot')) { garbageHandler(droppableHelper, previousSlot, draggableId, channel5); }
            } else {
                document.querySelector('#inactive-samples').removeChild(draggableId);
            }     
        }    
});

function droppableDivs() {
    channel1 = new Channel(1, context); 
    channel2 = new Channel(2, context); 
    channel3 = new Channel(3, context); 
    channel4 = new Channel(4, context); 
    channel5 = new Channel(5, context); 

    $('.sample-slot').droppable({
        accept: '.draggable-content',
        drop: function (event, ui) {
            let draggableUi = ui.draggable;
            let draggableHelper = ui.draggable.find("i").attr("data-playbuttonid");    //ta ut samplets index från sample arrayen
            let droppableHelper = $(this).attr("helper");                              //lägg den i index (droppableId) i playlist arrayen
            let droppableId = $(this).attr("id");
            let draggableId = document.querySelector('#' + ui.draggable.attr("id"));
            let draggableSampleId = ui.draggable.attr("sample-id");
            draggableId.setAttribute('previous-slot', droppableId);
            draggableId.setAttribute('helper', droppableHelper);

            if(droppableId.includes('channel1Slot')) { droppableHandler(droppableId, draggableUi, droppableHelper, draggableSampleId, channel1); }   
            if(droppableId.includes('channel2Slot')) { droppableHandler(droppableId, draggableUi, droppableHelper, draggableSampleId, channel2); }   
            if(droppableId.includes('channel3Slot')) { droppableHandler(droppableId, draggableUi, droppableHelper, draggableSampleId, channel3); }      
            if(droppableId.includes('channel4Slot')) { droppableHandler(droppableId, draggableUi, droppableHelper, draggableSampleId, channel4); }    
            if(droppableId.includes('channel5Slot')) { droppableHandler(droppableId, draggableUi, droppableHelper, draggableSampleId, channel5); }   

            $(this).append(ui.draggable);
            ui.draggable.position({of: $(this), my: 'left top', at: 'left top'});
        },
        out: function(event, ui) { 
            let previousSlot = ui.draggable.attr("previous-slot"); 
            let draggableId = document.querySelector('#' + ui.draggable.attr("id"));
            let droppableId = $(this).attr("id");
            
            if(previousSlot !== undefined) {
                let preSlotNum = previousSlot.substr(previousSlot.length - 1);
                if(previousSlot.includes('channel1Slot')) { channel1.addSample(preSlotNum, "./audio/Silence.ogg"); }
                if(previousSlot.includes('channel2Slot')) { channel2.addSample(preSlotNum, "./audio/Silence.ogg"); }
                if(previousSlot.includes('channel3Slot')) { channel3.addSample(preSlotNum, "./audio/Silence.ogg"); }
                if(previousSlot.includes('channel4Slot')) { channel4.addSample(preSlotNum, "./audio/Silence.ogg"); }
                if(previousSlot.includes('channel5Slot')) { channel5.addSample(preSlotNum, "./audio/Silence.ogg"); }
            } else {
                return;
            }
        }
    });
}
            
function loadSound(channel, audiosample, sampleSlot) {
    let request = new XMLHttpRequest();
    request.open('GET', audiosample, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            if (channel !== undefined) {
                if (sampleSlot !== undefined) {
                    channel.samples[sampleSlot] = buffer;
                } else {
                    channel.samples.push(buffer);
                }
            } else {
                //Preview a sample
                preview = context.createBufferSource(); 
                preview.buffer = buffer; 
                preview.connect(context.destination);  
                preview.start(0);
            }
        }, function() {
            console.error('Could not load a sample');
        });
    }
    request.send();
}

function playChannels(startPoint, playButton) {
    channel1.scheduler(channel1Gain, channel1Filter);
    channel2.scheduler(channel2Gain, channel2Filter);
    channel3.scheduler(channel3Gain, channel3Filter);
    channel4.scheduler(channel4Gain, channel4Filter);
    channel5.scheduler(channel5Gain, channel5Filter);

    if(channel1.samples[0] === undefined) {
        return;
    } else {
        $('#starting-point').prop('selectedIndex', 0);
        document.querySelector('#play-all-button').style.pointerEvents = 'none';
        $('#starting-point').prop('disabled', true);                                //disable all starting point buttons

        if(playButton) {
            playButton.style.opacity = '';
            playButton.style.color = '#d3e2ed';
            playButton.style.pointerEvents = 'none';                                //prevent spamming multiple layer of sounds by disabling button
            document.querySelector('#stop-all-button').style.opacity = '0.6';
            document.querySelector('#stop-all-button').style.color = '';
        }
    }
}

function previewSample(index, stopper) {
    if(stopper) {
        preview.stop(0);
    } else {
       loadSound(undefined, samples[index]);
    }
}

function stopAll(playButton) {
    channel1.stop();
    channel2.stop();
    channel3.stop();
    channel4.stop();
    channel5.stop();

    if(playButton) {
        playButton.style.opacity = '';
        playButton.style.color = '#d3e2ed';
        document.querySelector('#play-all-button').style.opacity = '0.6';
        document.querySelector('#play-all-button').style.color = '';
        document.querySelector('#play-all-button').style.pointerEvents = '';
    }
}

function muteChannel(id) {
    if(id == 1) { channel1.channelGain.gain.value = 0; }
    if(id == 2) { channel2.channelGain.gain.value = 0; }    
    if(id == 3) { channel3.channelGain.gain.value = 0; }
    if(id == 4) { channel4.channelGain.gain.value = 0; }
    if(id == 5) { channel5.channelGain.gain.value = 0; }
}

function unmuteChannel(id) {
    if(id == 1) { channel1Gain.gain.value = 1; }
    if(id == 2) { channel2Gain.gain.value = 1; }    
    if(id == 3) { channel3Gain.gain.value = 1; }
    if(id == 4) { channel4Gain.gain.value = 1; }
    if(id == 5) { channel5Gain.gain.value = 1; }
}

function audioRecorder(recording) {
    if(recording) {
        recorder.start();
        recordButton.style.opacity = '1';
    } else {
        recorder.stop();
        recordButton.style.opacity = '';
    }

    recorder.ondataavailable = function(event) {
        blobCollecter.push(event.data);
    };

    recorder.onstop = function(event) {
        let chromeChecker = MediaRecorder.isTypeSupported('audio/webm;codecs=opus');
        let firefoxChecker = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus'); 
        let blob;
        if(chromeChecker) {
            return alert('Chrome är cp. Om du vill ladda ner låten så använd Firefox.');
        } 
        if(firefoxChecker) {
            blob = new Blob(blobCollecter, { 'type' : 'audio/ogg; codecs=opus' });
        }
        
        let url = URL.createObjectURL(blob);
        let a = document.querySelector("#audio-recorder");
        a.style = 'display: none';
        a.href = url;
        a.download = 'djwannabe_track.ogg';
        a.click();
        window.URL.revokeObjectURL(url);
    };
}

mixerBoard.addEventListener('input', function(event) {
    if(event.target.className === 'mixer-volume') {
        switch(event.target.id) {
            case 'mixVolume1': channel1Gain.gain.value = event.target.value / 100;
                break;
            case 'mixVolume2': channel2Gain.gain.value = event.target.value / 100;
                break;
            case 'mixVolume3': channel3Gain.gain.value = event.target.value / 100;
                break;
            case 'mixVolume4': channel4Gain.gain.value = event.target.value / 100;
                break;
            case 'mixVolume5': channel5Gain.gain.value = event.target.value / 100;
                break;
        }
    }
    if(event.target.className === 'mixer-filter') {
        let filterFrequency = 20000 / event.target.value;
        if(filterFrequency > 20000) {
            filterFrequency = 20000;
        }
        console.log(filterFrequency);
        switch(event.target.id) {
            case 'lowpassFilter1': channel1Filter.frequency.value = filterFrequency;
                break;
            case 'lowpassFilter2': channel2Filter.frequency.value = filterFrequency;
                break;
            case 'lowpassFilter3': channel3Filter.frequency.value = filterFrequency;
                break;
            case 'lowpassFilter4': channel4Filter.frequency.value = filterFrequency;
                break;
            case 'lowpassFilter5': channel5Filter.frequency.value = filterFrequency;
                break;
        }
    }
})

volumeKnob.addEventListener('input', function() {
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
    playChannels: playChannels,
    previewSample: previewSample, 
    stopAll: stopAll,
    muteChannel: muteChannel,
    unmuteChannel: unmuteChannel,
    audioRecorder: audioRecorder,
    droppableDivs: droppableDivs,
};
},{"./audioSamples":2}]},{},[1]);
