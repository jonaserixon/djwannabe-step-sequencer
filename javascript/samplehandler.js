let wrapper = document.querySelector('#wrapper');
let inactiveSamples = document.querySelector('#inactive-samples');
let volumeKnob = document.querySelector('#volumeKnob');
let delayKnob = document.querySelector('#delayKnob');
let recordButton = document.querySelector('#record-button');
let mixerBoard = document.querySelector('#mixer-board');

let samples = [
    "./audio/HIMITSU Big Synth Chord.ogg",
    "./audio/HIMITSU Soft Piano.ogg"
];       //Array with all unused loaded samples

let silentAudio = [];   //Silent audiobuffers
let blobCollecter = [];

let channel1 = [];      //Channel 1's list of samples
let channel2 = [];      //Channel 2's list of samples
let channel3 = [];      //Channel 3's list of samples
let channel4 = [];      //Channel 4's list of samples
let channel5 = [];      //Channel 5's list of samples

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
    this.id = id;
    this.samples = []; //channels audiobuffers
    this.sources = []; //Keep track of buffersource nodes created from scheduler method

    this.sampleslotDivs = [];

    for (let i = 0; i < 8; i++) {
        let exde = document.querySelector('#channel' + this.id + 'Slot' + i);
        console.log('#channel' + this.id + 'Slot' + i);
        this.sampleslotDivs.push(exde);
    }

    // console.log(this.sampleslotDivs);

    for (let i = 0; i < 8; i++) {
        loadSound(this, './audio/Silence.ogg');
    }
}

Channel.prototype = {
    addSample: function(sampleSlot, samplePath) {
        loadSound(this, samplePath, sampleSlot);
    },
    swapSample: function(sampleSlot, newSample) {
        this.samples.splice(sampleSlot, 1, newSample);
    },
    scheduler: function() {
        for (let i = 0; i < this.samples.length; i++) {
            let audio = context.createBufferSource();
            this.sources[i] = audio;
            audio.buffer = this.samples[i];
            audio.connect(context.destination);
            audio.start(context.currentTime + (audio.buffer.duration * i));

            setTimeout(function() {
                console.log('bajs');
                // Add the border to the playing sample slot
                let playingSlot = this.sampleslotDivs[i];
                playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
            }.bind(this), audio.buffer.duration * i * 1000);

            audio.onended = function() {
                this.sampleslotDivs[i].style.boxShadow = '';
            }.bind(this);
        }
    }   
}


function droppableHandler(droppableId, draggableUi) {
    $('#' + droppableId).droppable('enable');       
    if($('#' + droppableId).find('div').length > 0 && $('#' + droppableId).find('div').attr("id") != draggableUi.attr("id")) {
        $('#' + droppableId).find('div').first().remove();
    }
}

//Garbage can handler
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
                    document.querySelector('#' + previousSlot).removeChild(draggableId);
                }
                if(previousSlot.includes('channel2Slot')) {
                    channel2.splice(droppableHelper, 1, silentAudio[droppableHelper]); 
                    $('#' + previousSlot).droppable('enable');
                    document.querySelector('#' + previousSlot).removeChild(draggableId);
                }
                if(previousSlot.includes('channel3Slot')) {
                    channel3.splice(droppableHelper, 1, silentAudio[droppableHelper]);  
                    $('#' + previousSlot).droppable('enable');
                    document.querySelector('#' + previousSlot).removeChild(draggableId);
                }
                if(previousSlot.includes('channel4Slot')) {
                    channel4.splice(droppableHelper, 1, silentAudio[droppableHelper]); 
                    $('#' + previousSlot).droppable('enable');
                    document.querySelector('#' + previousSlot).removeChild(draggableId);
                }
                if(previousSlot.includes('channel5Slot')) {
                    channel5.splice(droppableHelper, 1, silentAudio[droppableHelper]);  
                    $('#' + previousSlot).droppable('enable');
                    document.querySelector('#' + previousSlot).removeChild(draggableId);
                }
            } else {
                document.querySelector('#inactive-samples').removeChild(draggableId);
            }     
        }    
});

let channel55;

//Sample slot handler
function droppableDivs() {
    channel55 = new Channel(5);
    // inactiveSampleHandler.addSample(0, "./audio/HIMITSU Soft Piano.ogg");
    // inactiveSampleHandler.addSample(1, "./audio/HIMITSU Piano Low.ogg");

    $('.sample-slot').droppable({
        accept: '.draggable-content',
        drop: function (event, ui) {
            let draggableUi = ui.draggable;
            let draggableHelper = ui.draggable.find("i").attr("data-playbuttonid");    //ta ut samplets index från sample arrayen
            let droppableHelper = $(this).attr("helper");                               //lägg den i index (droppableId) i playlsit arrayen
            let droppableId = $(this).attr("id");
            let draggableId = document.querySelector('#' + ui.draggable.attr("id"));
            let draggableSampleId = ui.draggable.attr("sample-id");
            draggableId.setAttribute('previous-slot', droppableId);
            draggableId.setAttribute('helper', droppableHelper);
                                                                                            // console.log('draggable sample '  + draggableId + ' dropped on ' + droppableId);
            //put the dropped sample at the slot index in the channels array
            if(droppableId.includes('channel1Slot')) { channel1.splice(droppableHelper, 1, samples[draggableHelper]); droppableHandler(droppableId, draggableUi); }
            if(droppableId.includes('channel2Slot')) { channel2.splice(droppableHelper, 1, samples[draggableHelper]); droppableHandler(droppableId, draggableUi); }
            if(droppableId.includes('channel3Slot')) { channel3.splice(droppableHelper, 1, samples[draggableHelper]); droppableHandler(droppableId, draggableUi); }   
            if(droppableId.includes('channel4Slot')) { channel4.splice(droppableHelper, 1, samples[draggableHelper]); droppableHandler(droppableId, draggableUi); }   

            if(droppableId.includes('channel5Slot')) {
                channel55.addSample(droppableHelper, samples[draggableSampleId]); 
                // channel5.splice(droppableHelper, 1, samples[draggableHelper]); 
                droppableHandler(droppableId, draggableUi); 
            }   

            $(this).append(ui.draggable);
            ui.draggable.position({of: $(this), my: 'left top', at: 'left top'});
        },
        out: function(event, ui) { 
            let previousSlot = ui.draggable.attr("previous-slot"); 
            let draggableId = document.querySelector('#' + ui.draggable.attr("id"));
            let droppableId = $(this).attr("id");
            
            if(previousSlot !== undefined) {
                let preSlotNum = previousSlot.substr(previousSlot.length - 1);
                if(previousSlot.includes('channel1Slot')) { channel1.splice(preSlotNum, 1, silentAudio[preSlotNum]); }
                if(previousSlot.includes('channel2Slot')) { channel2.splice(preSlotNum, 1, silentAudio[preSlotNum]); }
                if(previousSlot.includes('channel3Slot')) { channel3.splice(preSlotNum, 1, silentAudio[preSlotNum]); }
                if(previousSlot.includes('channel4Slot')) { channel4.splice(preSlotNum, 1, silentAudio[preSlotNum]); }
                if(previousSlot.includes('channel5Slot')) { 
                    // channel5.splice(preSlotNum, 1, silentAudio[preSlotNum]);
                    channel55.addSample(preSlotNum, "./audio/Silence.ogg");
                }
            } else {
                return;
            }
        }
    });
}
            
//https://dl.dropboxusercontent.com/s/6s6rn6rcdlggdzj/Weird%20Synth.wav?dl=0
// let audios = [audio1, audio2, audio3];
//sources = collection of audio buffersource nodes
let preview, audio1, audio2, audio3, audio4, audio5, sources1 = [], sources2 = [], sources3 = [], sources4 = [], sources5 = [];  



// Store audio sample buffer in an array
function loadSound(channel, audiosample, sampleSlot) {
    let request = new XMLHttpRequest();
    request.open('GET', audiosample, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            console.log(sampleSlot);
            if (sampleSlot !== undefined) {
                channel.samples[sampleSlot] = buffer;
            } else {
                channel.samples.push(buffer);
            }
            
            // if(silence) {
            //     for(let i = 0; i < 8; i++) {
            //         // channel1.push(buffer);
            //         // channel2.push(buffer);
            //         // channel3.push(buffer);
            //         // channel4.push(buffer);
            //         // channel5.push(buffer);
            //         inactiveSampleHandler.samples.push(buffer);
            //         silentAudio.push(buffer);
            //     }
            // } else {
            //     inactiveSampleHandler.samples.push(buffer);
            // }
        }, function() {
            console.error('Could not load a sample');
        });
    }
    request.send();
}

function playChannels(startPoint, playButton) {
    if(channel1[0] === undefined) {
        return;
    } else {
        $('#starting-point').prop('selectedIndex', 0);
        document.querySelector('#play-all-button').style.pointerEvents = 'none';
        $('#starting-point').prop('disabled', true); //disable all starting point buttons
        
        if(playButton) {
            playButton.style.opacity = '';
            playButton.style.color = '#d3e2ed';
            playButton.style.pointerEvents = 'none';    //prevent spamming multiple layer of sounds by disabling button
            document.querySelector('#stop-all-button').style.opacity = '0.6';
            document.querySelector('#stop-all-button').style.color = '';
        }
        let counterPoint = startPoint;
        let audioStart = context.currentTime;  //start the sound at this time
        let next = 0;
        // scheduler(audioStart, next, index)
        if(startPoint) {
            for(let i = 0; i < 8; i++) {
                startPointHandler(audioStart, counterPoint, next);  //the specified starting point of playback
                counterPoint++;
                next++;
            }
        } else {
            for(let i = 0; i < 8; i++) {
                startPointHandler(audioStart, next, next);
                next++;
            }
        }
    }
}

/**
 * @param audioStart = context.startTime
 * @param next = sample to schedule 
 * @param startingPoint = starting point for playback
 */
function startPointHandler(audioStart, next, startingPoint) {
    scheduler1(audioStart, next, startingPoint);
    scheduler2(audioStart, next, startingPoint);
    scheduler3(audioStart, next, startingPoint);
    scheduler4(audioStart, next, startingPoint);
    scheduler5(audioStart, next, startingPoint);
}

function scheduler1(audioStart, index, starthere) {
    let playingSlot = document.querySelector('#channel1Slot' + index);
    if(playingSlot === null) {
        return;
    } else {
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
        playingSlot.style.opacity = '';
        // audios[index] = context.createBufferSource(); 
        audio1 = context.createBufferSource(); 
        sources1.splice(index, 0, audio1);
        audio1.buffer = channel1[index]; 
        audio1.connect(channel1Filter);
        channel1Filter.connect(channel1Gain);
        audio1.start(audioStart + (audio1.buffer.duration * starthere));
        audio1.onended = function() {
            playingSlot.style.boxShadow = '';
            playingSlot.style.opacity = '0.5';
        }
    }
}

function scheduler2(audioStart, index, starthere) {
    let playingSlot = document.querySelector('#channel2Slot' + index);
    if(playingSlot === null) {
        return;
    } else {
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
        audio2 = context.createBufferSource();
        sources2.splice(index, 0, audio2);
        audio2.buffer = channel2[index];  //array with all the loaded audio
        audio2.connect(channel2Filter);
        channel2Filter.connect(channel2Gain);
        audio2.start(audioStart + (audio2.buffer.duration * starthere));
        audio2.onended = function() {
            playingSlot.style.boxShadow = '';
            playingSlot.style.opacity = '0.5';
        }
    }
}

function scheduler3(audioStart, index, starthere) {
    let playingSlot = document.querySelector('#channel3Slot' + index);
    if(playingSlot === null) {
        return;
    } else {
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
        audio3 = context.createBufferSource();
        sources3.splice(index, 0, audio3);
        audio3.buffer = channel3[index];  //array with all the loaded audio
        audio3.connect(channel3Filter);
        channel3Filter.connect(channel3Gain);
        audio3.start(audioStart + (audio3.buffer.duration * starthere));  
        audio3.onended = function() {
            playingSlot.style.boxShadow = '';
            playingSlot.style.opacity = '0.5';
        }
    }
}

function scheduler4(audioStart, index, starthere) {
    let playingSlot = document.querySelector('#channel4Slot' + index);
    if(playingSlot === null) {
        return;
    } else {
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
        audio4 = context.createBufferSource();
        sources4.splice(index, 0, audio4);
        audio4.buffer = channel4[index];  //array with all the loaded audio
        audio4.connect(channel4Filter);
        channel4Filter.connect(channel4Gain);
        audio4.start(audioStart + (audio4.buffer.duration * starthere));
        audio4.onended = function() {
            playingSlot.style.boxShadow = '';    
            playingSlot.style.opacity = '0.5';
        }
    }
}

function scheduler5(audioStart, index, starthere) {
    let playingSlot = document.querySelector('#channel5Slot' + index);
    if(playingSlot === null) {
        return;
    } else {
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
        audio5 = context.createBufferSource();
        sources5.splice(index, 0, audio5);
        audio5.buffer = channel5[index];  //array with all the loaded audio
        audio5.connect(channel5Filter);
        channel5Filter.connect(channel5Gain);
        audio5.start(audioStart + (audio5.buffer.duration * starthere));
        audio5.onended = function() {
            playingSlot.style.boxShadow = '';    
            playingSlot.style.opacity = '0.5';
            if(index === 7) {      //Reset the opacity when channel is finished playing or stopped
                for(let j = 1; j < 6; j++) {
                    for(let i = 0; i < 8; i++) {
                        document.querySelector('#channel' + j + 'Slot' + i).style.opacity = '';
                        $('#starting-point').prop('disabled', false); //enable all starting point buttons
                        document.querySelector('#play-all-button').style.pointerEvents = '';

                        recorder.stop();
                        recordButton.style.opacity = '';
                        console.log('Stop recording!');
                    }
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

function stopAll(playButton) {
    for(let i = 0; i < 8; i++) {
        if (sources1[i]) {
            sources1[i].stop(0);
            sources2[i].stop(0);
            sources3[i].stop(0);
            sources4[i].stop(0);
            sources5[i].stop(0);
        }
        if(playButton) {
            playButton.style.opacity = '';
            playButton.style.color = '#d3e2ed';
            document.querySelector('#play-all-button').style.opacity = '0.6';
            document.querySelector('#play-all-button').style.color = '';
            document.querySelector('#play-all-button').style.pointerEvents = '';
        }
    }
    if(typeof sources !== 'undefined') {
        $('#starting-point').prop('disabled', false); //enable all starting point buttons
    } else {
        return;
    }
    
}

function muteChannel(id) {
    if(id == 1) { channel1Gain.gain.value = 0; }
    if(id == 2) { channel2Gain.gain.value = 0; }    
    if(id == 3) { channel3Gain.gain.value = 0; }
    if(id == 4) { channel4Gain.gain.value = 0; }
    if(id == 5) { channel5Gain.gain.value = 0; }
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
        console.log('Start recording!');
    } else {
        recorder.stop();
        recordButton.style.opacity = '';
        console.log('Stop recording!');
    }

    recorder.ondataavailable = function(event) {
        blobCollecter.push(event.data);
    };

    recorder.onstop = function(event) {
        let chromeChecker = MediaRecorder.isTypeSupported('audio/webm;codecs=opus');
        let firefoxChecker = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus'); 
        let blob;
        if(chromeChecker) {
            alert('Chrome är cp. Om du vill ladda ner låten så använd Firefox.');
        } 
        if(firefoxChecker) {
            blob = new Blob(blobCollecter, { 'type' : 'audio/ogg; codecs=opus' });
        }
        
        var url = URL.createObjectURL(blob);
        var a = document.querySelector("#audio-recorder");
        a.style = 'display: none';
        a.href = url;
        a.download = 'djwannabe_track.ogg';
        a.click();
        window.URL.revokeObjectURL(url);


    };
}

mixerBoard.addEventListener('input', function(event) {
    channel55.scheduler(audioTime);
    // inactiveSampleHandler.scheduler(1);
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

// function toggler(element) {
//   source.disconnect(0);
//   filter.disconnect(0);
//   
//   if (element.checked) {
//     
//     source.connect(filter);
//     filter.connect(context.destination);
//   } else {
//    
//     source.connect(context.destination);
//   }
// };

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
    loadSound: loadSound,
    playChannels: playChannels,
    previewSample: previewSample, 
    stopAll: stopAll,
    muteChannel: muteChannel,
    unmuteChannel: unmuteChannel,
    audioRecorder: audioRecorder,
    droppableDivs: droppableDivs,
};