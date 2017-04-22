'use strict';

let playChecker = true;
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

let context = new AudioContext();
let gainNode = context.createGain();
let delayNode = context.createDelay(10);

gainNode.connect(context.destination);
delayNode.connect(context.destination);

let audioTime = context.currentTime;


$('#garbageCan').droppable({
        drop: function (event, ui) {
            let previousSlot = ui.draggable.attr("previous-slot");
            let droppableHelper = ui.draggable.attr("helper");  

            let draggableHelper = ui.draggable.find("i").attr("data-playbuttonid");
            let draggableId = document.querySelector('#' + ui.draggable.attr("id"));


            if(previousSlot.includes('channel1Slot')) {
                channel1.splice(droppableHelper, 1, silentAudio[droppableHelper]);  //put the dropped sample at the <id>-slotX index in the channel1 array
                $('#' + previousSlot).droppable('enable');
                draggableId.style.visibility = 'hidden';
            }
            if(previousSlot.includes('channel2Slot')) {
                channel2.splice(droppableHelper, 1, silentAudio[droppableHelper]);  //put the dropped sample at the <id>-slotX index in the channel1 array
                $('#' + previousSlot).droppable('enable');
                draggableId.style.visibility = 'hidden';
            }
            if(previousSlot.includes('channel3Slot')) {
                channel3.splice(droppableHelper, 1, silentAudio[droppableHelper]);  //put the dropped sample at the <id>-slotX index in the channel1 array
                $('#' + previousSlot).droppable('enable');
                draggableId.style.visibility = 'hidden';
            }
            console.log('hehehe ' + previousSlot);
        }    
});

/**
 * Droppable slots
 */
$('.sample-slot').droppable({
        drop: function (event, ui) {
            
            let draggableHelper = ui.draggable.find("i").attr("data-playbuttonid");    //ta ut samplets index från sample arrayen
            let droppableHelper = $(this).attr("helper");                               //lägg den i index (droppableId) i playlsit arrayen
            let droppableId = $(this).attr("id");
            let draggableId = document.querySelector('#' + ui.draggable.attr("id"));
            draggableId.setAttribute('previous-slot', droppableId);
            draggableId.setAttribute('helper', droppableHelper);

            console.log('draggable sample '  + draggableId + ' dropped on ' + droppableId);

            //check which channel to add the sample to
            if(droppableId.includes('channel1Slot')) {
                channel1.splice(droppableHelper, 1, samples[draggableHelper]);  //put the dropped sample at the <id>-slotX index in the channel1 array
                $('#' + droppableId).droppable('disable');
            }
            if(droppableId.includes('channel2Slot')) { 
                channel2.splice(droppableHelper, 1, samples[draggableHelper]);  //put the dropped sample at the <id>-slotX index in the channel1 array
                $('#' + droppableId).droppable('disable');  //disabla droppable om jag stoppar in ett sample i sloten
                // göra sloten droppable igen om jag tar bort/flyttar ett sample
            }
            if(droppableId.includes('channel3Slot')) {
                channel3.splice(droppableHelper, 1, samples[draggableHelper]);  //put the dropped sample at the <id>-slotX index in the channel1 array
                $('#' + droppableId).droppable('disable');
            }   
            ui.draggable.position({
                my: 'center',
                at: 'center',
                of: $(this),
                using: function(pos) {
                $(this).animate(pos, 'center', 'linear');
            } 
            });
        },
        // tolerance: "touch",

        // out: function(event, ui) {  
        //     let droppableId = $(this).attr("id");
        //     let droppableHelper = $(this).attr("helper");    
        //     console.log(channel1); 
        //     if(droppableId.includes('channel1Slot')) {
        //         channel1.splice(droppableHelper, 1, silentAudio[0]);  //put the dropped sample at the <id>-slotX index in the channel1 array
        //         $('#' + droppableId).droppable('enable');
        //         console.log(channel1);
        //     }   
            
        // }
    });



/**
 * Skapar en samplebox div som är draggable + innehåller ett sample + en play knapp
 * @param id = idCounter
 * @param sample = path to sample
 */
function samplebox(id, sample, e) {

    $(function () {
        $('#samplebox' + id).draggable({
            // revert: 'invalid',
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

    // console.log('xD');
    // var x = e.pageX + 'px';
    // var y = e.pageY + 'px';
    // var divBox = $(sampleBox).css({
    //     "position": "absolute",                    
    //     "left": x,
    //     "top": y
    // });

    // document.body.appendChild(sampleBox);   

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
                        channel2.splice(i, 1, buffer);
                        channel3.splice(i, 1, buffer);
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

let preview;        //preview samplebox
// let audios = [audio1, audio2, audio3];
let audio1;         //channel 1 audio 
let audio2;         //channel 2 audio 
let audio3;         //channel 3 audio
let sources1 = [];  //audio1 buffersource nodes
let sources2 = [];  //audio2 buffersource nodes
let sources3 = [];  //audio3 buffersource nodes

function playChannel1(index) {
    let audioStart = context.currentTime;  //start the sound at this time
    let next = 0;

    // scheduler(audioStart, next, index);
    
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

function playChannel3() {
    let audioStart = context.currentTime;  //start the sound at this time 
    let next = 0;

    for(let i = 0; i < 8; i++) {
        scheduler3(audioStart, next);
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
    audio1.connect(gainNode);
    // audio1.connect(context.destination);  
    audio1.start(audioStart + (audio1.buffer.duration * index));
    audio1.onended = function() {
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
    audio2 = context.createBufferSource();
    sources2.splice(index, 0, audio2);
    audio2.buffer = channel2[index];  //array with all the loaded audio
    audio2.connect(gainNode);
    audio2.start(audioStart + (audio2.buffer.duration * index));
        
    audio2.onended = function() {
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

function scheduler3(audioStart, index) {

    let playingSlot = document.querySelector('#channel3Slot' + index);
    playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
    audio3 = context.createBufferSource();
    sources3.splice(index, 0, audio3);
    audio3.buffer = channel3[index];  //array with all the loaded audio
    audio3.connect(gainNode);
    // audio3.connect(delayNode);
    audio3.start(audioStart + (audio3.buffer.duration * index));
        
    audio3.onended = function() {
        playingSlot.style.boxShadow = '0 0 6px 3px rgba(0, 0, 0, 0.5)';
        playingSlot.style.opacity = '0.5';

        if(index === 7) {       //Reset the opacity when channel is finished playing
            for(let i = 0; i < 8; i++) {
                let reset = document.querySelector('#channel3Slot' + i);
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
        if (sources1[i]) {
            //resetta opacityn etc. här istället för onended
            sources1[i].stop(0);
            sources2[i].stop(0);
            sources3[i].stop(0);
        }
    }
}

volumeKnob.addEventListener('click', function() {
    let volumeMeter = volumeKnob.value / 100;
    gainNode.gain.value = volumeMeter;
    console.log('Volume: ' + gainNode.gain.value);
})

// delayKnob.addEventListener('click', function() {
//     let delayMeter = (delayKnob.value / 10) / 2;
//     delayNode.delayTime.value = delayMeter;
//     console.log(delayNode.delayTime.value);
// })

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
                playChannel3();
                playButton.removeAttribute('class');
                playButton.setAttribute('class', 'fa fa-stop');
                playChecker = false;       
            } else {
                stopAll();
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