const audioSamples = require('./audioSamples');

let wrapper = document.querySelector('#wrapper');
let inactiveSamples = document.querySelector('#inactive-samples');
let volumeKnob = document.querySelector('#volumeKnob');
let delayKnob = document.querySelector('#delayKnob');
let recordButton = document.querySelector('#record-button');
let mixerBoard = document.querySelector('#mixer-board');
let panControl = document.querySelector('.stereo-panner');

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
    this.panNode = context.createStereoPanner();
    this.panNode.pan.value = 0;
    this.channelFilter = context.createBiquadFilter();
    this.channelFilter.frequency.value = 20000;

    this.javascriptNode.onaudioprocess = function() {
            let array =  new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(array);
            let average = this.getAverageVolume(array)
            
            this.ctx.clearRect(0, 0, 60, 130);
            this.ctx.fillStyle= '#00c543';
            this.ctx.fillRect(0, 130 - average, 25, 130);
        }.bind(this);

    //Change number of sample-slots here
    for (let i = 0; i < 16; i++) {
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
            this.channelGain.connect(this.panNode);
            this.panNode.connect(gainNode);
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
                playingSlot.style.boxShadow = '0 0 10px 3px rgba( 109, 250, 157 , 1)';
            }.bind(this), audio.buffer.duration * i * 1000));
            
            audio.onended = function() {
                this.sampleslotDivs[startPoint].style.boxShadow = '';
            }.bind(this);
    },
    stop: function() {
        for (let i = 0; i < 16; i++) {
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

function makeDraggable(id) {
    $(function () {
            $(id).draggable({
                revert: 'invalid', 
                disabled: false,
                containment: 'document',
                zIndex: 10,
                opacity: 0.5,
                snap: '.sample-slot',
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
}

function droppableDivs() {
    channel1 = new Channel(1); 
    channel2 = new Channel(2); 
    channel3 = new Channel(3); 
    channel4 = new Channel(4); 
    channel5 = new Channel(5); 

    // channels.push(new Channel());
    // channels[2]
    let xd = 0;
    $('.sample-slot').droppable({
        accept: '.draggable-content',
        drop: function (event, ui) {
            let draggableUi = ui.draggable;
            let draggableHelper = ui.draggable.find("i").attr("data-playbuttonid");    //ta ut samplets index från sample arrayen
            let droppableHelper = $(this).attr("helper");                              //lägg den i index (droppableId) i playlist arrayen
            let droppableId = $(this).attr("id");
            let draggableId = document.querySelector('#' + ui.draggable.attr("id"));
            let draggableSampleId = ui.draggable.attr("sample-id");
            // draggableId.setAttribute('previous-slot', droppableId);
            draggableId.setAttribute('helper', droppableHelper);

            if(droppableId.includes('channel1Slot')) { droppableHandler(droppableId, draggableUi, droppableHelper, draggableSampleId, channel1); }   
            if(droppableId.includes('channel2Slot')) { droppableHandler(droppableId, draggableUi, droppableHelper, draggableSampleId, channel2); }   
            if(droppableId.includes('channel3Slot')) { droppableHandler(droppableId, draggableUi, droppableHelper, draggableSampleId, channel3); }      
            if(droppableId.includes('channel4Slot')) { droppableHandler(droppableId, draggableUi, droppableHelper, draggableSampleId, channel4); }    
            if(droppableId.includes('channel5Slot')) { droppableHandler(droppableId, draggableUi, droppableHelper, draggableSampleId, channel5); }   

            if(ui.draggable.attr("original-box")) {
                let clonedBox = ui.draggable.clone().prop('id', 'yolo' + xd);
                $(this).append(clonedBox);
                clonedBox.position({of: $(this), my: 'left top', at: 'left top'});
                clonedBox.attr('previous-slot', droppableId);
                clonedBox.removeAttr('original-box');
                clonedBox.removeClass();
                clonedBox.prop('class', 'draggable-content');
                makeDraggable('.draggable-content');
            } else {
                draggableUi.attr('previous-slot', droppableId);
                $(this).append(ui.draggable);
                ui.draggable.position({of: $(this), my: 'left top', at: 'left top'});
            }
            xd++;
            console.log(document.querySelectorAll('#playlist-container .draggable-content').length);
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
                } else {    //silence audio
                    for(let i = 0; i < 16; i++) {
                        channel.samples[i] = buffer;
                    }
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
        playButton.style.pointerEvents = 'none'; 
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
    if(id == 'm1') { channel1.channelGain.gain.value = 0; }
    if(id == 'm2') { channel2.channelGain.gain.value = 0; }    
    if(id == 'm3') { channel3.channelGain.gain.value = 0; }
    if(id == 'm4') { channel4.channelGain.gain.value = 0; }
    if(id == 'm5') { channel5.channelGain.gain.value = 0; }
}

function unmuteChannel(id) {
    if(id == 'm1') { channel1.channelGain.gain.value = 1; }
    if(id == 'm2') { channel2.channelGain.gain.value = 1; }    
    if(id == 'm3') { channel3.channelGain.gain.value = 1; }
    if(id == 'm4') { channel4.channelGain.gain.value = 1; }
    if(id == 'm5') { channel5.channelGain.gain.value = 1; }
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

$(function() {
    let size = 50;
    if($(window).width() < 1600) { size = 40; }
        $(".jquery-filter-knob").knob({
            'angleOffset': -125,
            'angleArc': 250,
            'width': size,
            'height': size,
            'lineCap': 'round',
            'fgColor': '#061a29',
            'change': function(event) { 
                $('#mixer-board').draggable('disable');
                let filterFrequency = 20000 / event;

                //Preventing the frequency to become infinite
                if(filterFrequency > 20000) {
                    filterFrequency = 20000;
                }
                switch(this.$.attr('id')) {
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
            },
            'release': function(event) {
                $('#mixer-board').draggable('enable');
            }
        });
});


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

    if(event.target.className === 'stereo-panner') {
        switch(event.target.id) {
            case 'panner1': channel1.panNode.pan.value = event.target.value;
                break;
            case 'panner2': channel2.panNode.pan.value = event.target.value;
                break;
            case 'panner3': channel3.panNode.pan.value = event.target.value;
                break;
            case 'panner4': channel4.panNode.pan.value = event.target.value;
                break;
            case 'panner5': channel5.panNode.pan.value = event.target.value;
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