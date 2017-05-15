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
let timer; 
let lastPlayed;
let startingPoint;
let channelSetter;
let slotSetter;


function Desktop() {
    let wrapper = document.querySelector('#wrapper');
    let channelDiv = document.querySelector('#snaptarget');
    let removeButton = document.querySelector('#remove-sample');
    let sampleList = document.querySelector('#sample-list'); 
    let sampleboxes = document.querySelector('.draggable-content ui-draggable ui-draggable-handle');
    let inactiveSamples = document.querySelector('#inactive-samples');
    let playlistContainer = document.querySelector('#playlist-container');
    
    function createChannel(numChannels, numSlots) {
        for(let i = 1; i < numChannels; i++) {
            let snapDiv = document.createElement('div');
            snapDiv.textContent = '';
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
        SampleHandler.droppableDivs();
    }

    createChannel(6, 8);
    

    // document.querySelector('#channel-setter').addEventListener('change', function() {
    //     channelSetter = this.options[this.selectedIndex].value;
    // })  

    // document.querySelector('#slot-setter').addEventListener('change', function() {
    //     slotSetter = this.options[this.selectedIndex].value;
    // })  

    // document.querySelector('#createChannels').addEventListener('click', function() {
    //     createChannel(channelSetter, slotSetter);
    // })

    //Sends audiosample path to samplebox()
    sampleList.addEventListener('click', function(event) {
        if(event.target.id === 'sample-list' || event.target.id === 'library-h3' || event.target.tagName === 'I') {
            return;
        } else {
            samplebox(idCounter, $(event.target).text(), event);
            idCounter += 1;
        }
    });

    $('#mixer-board').draggable({containment: 'document'});
    
    /**
     * Create samplebox
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
        sampleBox.setAttribute('title', sample);
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
            if(playButton.tagName === 'I' && playButton.className === 'fa fa-play-circle' && playButton.parentNode.tagName === 'DIV' || playButton.tagName === 'I' && playButton.className === 'fa fa-stop-circle' && playButton.parentNode.tagName === 'DIV' ) {
                console.log('BOX PREVIEW');
                if(playChecker) {
                    SampleHandler.previewSample(playButton.getAttribute("data-playbuttonid"), false);
                    playButton.removeAttribute('class');
                    playButton.setAttribute('class', 'fa fa-stop-circle');
                    playChecker = false;
                    lastPlayed = playButton;
                    //Reset preview button
                    timer = setTimeout(function() {
                        playButton.removeAttribute('class');
                        playButton.setAttribute('class', 'fa fa-play-circle');
                        playChecker = true;
                    }, 5500);
                } else {
                    SampleHandler.previewSample(null, true, playButton);
                    playButton.removeAttribute('class');
                    playButton.setAttribute('class', 'fa fa-play-circle');

                    lastPlayed.removeAttribute('class');
                    lastPlayed.setAttribute('class', 'fa fa-play-circle');
                    playChecker = true;
                    //Clear preview timeout
                    clearTimeout(timer);
                }
            } else if (playButton.tagName === 'I' && playButton.className === 'fa fa-play-circle' && playButton.parentNode.tagName === 'LI' ||playButton.tagName === 'I' && playButton.className === 'fa fa-stop-circle' && playButton.parentNode.tagName === 'LI' ) {
                if(playChecker) {
                    console.log('SAMPLE LIB PREVIEW');
                    SampleHandler.previewSample(playButton.id, false);
                    playButton.removeAttribute('class');
                    playButton.setAttribute('class', 'fa fa-stop-circle');
                    playChecker = false;
                    lastPlayed = playButton;
                    //Reset preview button
                    timer = setTimeout(function() {
                        playButton.removeAttribute('class');
                        playButton.setAttribute('class', 'fa fa-play-circle');
                        playChecker = true;
                    }, 5500);
                } else {
                    SampleHandler.previewSample(null, true, playButton);
                    playButton.removeAttribute('class');
                    playButton.setAttribute('class', 'fa fa-play-circle');

                    lastPlayed.removeAttribute('class');
                    lastPlayed.setAttribute('class', 'fa fa-play-circle');
                    playChecker = true;
                    //Clear preview timeout
                    clearTimeout(timer);
                }
            //Global play/stop button
            } else if (playButton.tagName === 'I' && playButton.id === 'play-all-button' || playButton.tagName === 'I' && playButton.id === 'stop-all-button') {   
                if(playButton.id === 'play-all-button') {
                    if(startingPoint !== undefined && startingPoint !== '-') {
                        SampleHandler.playChannels(startingPoint, playButton);
                    } else {
                        SampleHandler.playChannels(false, playButton);
                    }
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
        startingPoint = this.options[this.selectedIndex].value;
    });

    //Sample library minimizer
    $("#minimize-button").click(function(){
        if($(this).html() == "-"){
            $(this).html("+");
        } else{
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
let looper = document.querySelector('#loop-button');

let samples = audioSamples.audioSamples(); //audiosample paths

let blobCollecter = []; //Recorded audio
let preview;

let channel1, channel2, channel3, channel4, channel5;      

let context = new AudioContext();
let dest = context.createMediaStreamDestination();
let recorder = new MediaRecorder(dest.stream);

let gainNode = context.createGain(); //Master gain
gainNode.connect(dest);              //Enables audio playback during recording



function Channel(id) {
    this.id = id;               //Channel id
    this.samples = [];          //channels audiobuffers
    this.sources = [];          //Keep track of buffersource nodes created from scheduler method
    this.timeouts = [];         //setTimeOuts
    this.sampleslotDivs = [];   //Sample-slot id
    this.ctx = document.getElementById("volume-meter-" + this.id).getContext("2d");  //Canvas context

    this.javascriptNode = context.createScriptProcessor(512);
    this.analyser = context.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.3;
    this.channelGain = context.createGain();
    this.channelFilter = context.createBiquadFilter();
    this.channelFilter.frequency.value = 20000;

    this.javascriptNode.onaudioprocess = function() {
            let array =  new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(array);
            let average = this.getAverageVolume(array)
            
            this.ctx.clearRect(0, 0, 60, 130);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = 'rgb(0, 0, 0)';
            this.ctx.fillStyle= '#b5dffe';
            this.ctx.fillRect(0, 130 - average, 25, 130);
        }.bind(this);

    for (let i = 0; i < 8; i++) {
        let theSlot = document.querySelector('#channel' + this.id + 'Slot' + i);
        this.sampleslotDivs.push(theSlot);
    }

    loadSound(this, './audio/Silence.ogg');
}

Channel.prototype = {
    addSample: function(sampleSlot, samplePath) {
        loadSound(this, samplePath, sampleSlot);
    },
    scheduler: function(startPoint, i) {            
            let audio = context.createBufferSource();
            this.sources[startPoint] = audio;
            audio.buffer = this.samples[startPoint];

            audio.connect(this.channelFilter);
            this.channelFilter.connect(this.channelGain);
            this.channelGain.connect(gainNode);
            gainNode.connect(context.destination);

            //Connect the volume-meter
            this.channelGain.connect(this.analyser);
            this.analyser.connect(this.javascriptNode);
            this.javascriptNode.connect(gainNode);
            
            audio.start(context.currentTime + (5.5 * i));

            if(audio.buffer === null) {
                return;
            }

            this.timeouts.push(setTimeout(function() {
                // Add the border to the playing sample slot
                let playingSlot = this.sampleslotDivs[startPoint];
                playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
            }.bind(this), audio.buffer.duration * i * 1000));
            
            audio.onended = function() {
                this.sampleslotDivs[startPoint].style.boxShadow = '';
            }.bind(this);
    },
    stop: function() {
        for (let i = 0; i < 8; i++) {
            if (this.sources[i] !== undefined) {
                this.sources[i].stop(0);
            }
        }

        for (let i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]);
        }
    },
    getAverageVolume: function(array) {
        let values = 0;
        let average;
 
        let length = array.length;
        for (let i = 0; i < length; i++) {
            values += array[i];
        }
        average = values / length;
        return average;
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
                    for(let i = 0; i < 8; i++) {
                        channel.samples[i] = buffer;
                    }
                    // channel.samples.push(buffer); //silence
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

function playChannels(counterPoint, playButton) {
    let startPoint = counterPoint;

    if(counterPoint) {
        for(let i = 0; i < channel1.samples.length; i++) {
            startPointHandler(startPoint, i);
            startPoint++;
        }
    } else {
        for(let i = 0; i < channel1.samples.length; i++) {
            startPointHandler(i, i);
        }
    }
    
    if(playButton) {
        playButton.style.opacity = '';
        playButton.style.color = '#d3e2ed';
        playButton.style.pointerEvents = 'none';                                //disable playbutton
        document.querySelector('#stop-all-button').style.opacity = '0.6';
        document.querySelector('#stop-all-button').style.color = '';
    }
}

function startPointHandler(startPoint, i) {
    channel1.scheduler(startPoint, i);
    channel2.scheduler(startPoint, i);
    channel3.scheduler(startPoint, i);
    channel4.scheduler(startPoint, i);
    channel5.scheduler(startPoint, i);
}

function previewSample(index, stopper, playButton) {
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
    if(id == 1) { channel1.channelGain.gain.value = 1; }
    if(id == 2) { channel2.channelGain.gain.value = 1; }    
    if(id == 3) { channel3.channelGain.gain.value = 1; }
    if(id == 4) { channel4.channelGain.gain.value = 1; }
    if(id == 5) { channel5.channelGain.gain.value = 1; }
}

function audioRecorder(recording) {
    let chromeChecker = MediaRecorder.isTypeSupported('audio/webm;codecs=opus');
    let firefoxChecker = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus'); 
    if(chromeChecker) {
        return alert('Chrome är cp. Om du vill ladda ner låten så använd Firefox.');
    } 
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
        let blob;
        
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
            case 'mixVolume1': channel1.channelGain.gain.value = event.target.value / 100;
                break;
            case 'mixVolume2': channel2.channelGain.gain.value = event.target.value / 100;
                break;
            case 'mixVolume3': channel3.channelGain.gain.value = event.target.value / 100;
                break;
            case 'mixVolume4': channel4.channelGain.gain.value = event.target.value / 100;
                break;
            case 'mixVolume5': channel5.channelGain.gain.value = event.target.value / 100;
                break;
        }
    }
    if(event.target.className === 'mixer-filter') {
        let filterFrequency = 20000 / event.target.value;

        //Preventing the frequency to become infinite
        if(filterFrequency > 20000) {
            filterFrequency = 20000;
        }

        switch(event.target.id) {
            case 'lowpassFilter1': channel1.channelFilter.frequency.value = filterFrequency;
                break;
            case 'lowpassFilter2': channel2.channelFilter.frequency.value = filterFrequency;
                break;
            case 'lowpassFilter3': channel3.channelFilter.frequency.value = filterFrequency;
                break;
            case 'lowpassFilter4': channel4.channelFilter.frequency.value = filterFrequency;
                break;
            case 'lowpassFilter5': channel5.channelFilter.frequency.value = filterFrequency;
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
