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

    createChannel(6, 16);
    
    //Sends audiosample path to samplebox()
    sampleList.addEventListener('click', function(event) {
        document.querySelector('#box ul').style.boxShadow = 'none';
        if(event.target.id === 'sample-list' || event.target.id === 'library-h3' || event.target.tagName === 'I') {
            return;
        } else {
            let sampleboxes = document.querySelectorAll('#inactive-samples .draggable-content');

            for(let i = 0; i < sampleboxes.length; i++) {
                if(sampleboxes[i].getAttribute('sample-id') === event.target.getAttribute('sample-id')) {
                    return;
                }
            } 
            samplebox(idCounter, event.target.getAttribute('sample-id'), event, $(event.target).text());
            console.log(event.target.getAttribute('sample-id'));
            idCounter += 1;
        }
    });

    $('#mixer-board').draggable({containment: 'document'});
    
    /**
     * Create samplebox
     * @param id = idCounter
     * @param sample = path to sample
     */
    function samplebox(id, sample, event, sampleName) {
        //Make samplebox draggable
        $(function () {
            $('.draggable-content').draggable({
                revert: 'invalid', 
                disabled: false,
                containment: 'document',
                zIndex: 10,
                opacity: 0.5,
                snap: '.sample-slot',
                snapMode: 'inner',
                helper: 'clone',
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
        sampleBox.setAttribute('title', sampleName);
        sampleBox.setAttribute('original-box', sample);
        let img = document.createElement('img');
        
        //Set color and image
        if(sample == 0 || sample == 9 || sample == 10 || sample == 13 || sample == 14 || sample == 15) {
            img.src = "./images/synth_icon.png";
            sampleBox.style.backgroundColor = '#27a0c4';
        } else if(sample == 1 || sample == 3 || sample == 16 || sample == 17 || sample == 18) {
            img.src = "./images/piano_icon.png";
            sampleBox.style.backgroundColor = '#bdff92';
        } else if(sample == 5 || sample == 12) {
            img.src = "./images/vocals_icon.png";
            sampleBox.style.backgroundColor = '#e998ff';
        } else if(sample == 4 || sample == 11){
            img.src = "./images/drums_icon.png";
        } else if(sample == 21 || sample == 22 || sample == 23){
            img.src = "./images/drums_icon.png";
            sampleBox.style.backgroundColor = '#d94949';
        } else if(sample == 2 || sample == 6 || sample == 8 || sample == 19 || sample == 20){
            img.src = "./images/synth_icon.png";
            sampleBox.style.backgroundColor = '#93e6ff';
        }   
        
        //Create a preview button
        let playButton = document.createElement('i');
        playButton.setAttribute('data-playbuttonid', event.target.getAttribute('sample-id'));
        playButton.setAttribute('class', 'fa fa-play-circle');
        playButton.setAttribute('id', 'playbutton' + id);
        playButton.setAttribute('button-css', 'boxButton');
        playButton.setAttribute('aria-hidden', 'true');
        // playButton.style.fontSize = '30px';

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
            //Samplebox preview button
            if(playButton.tagName === 'I' && playButton.className === 'fa fa-play-circle' && playButton.parentNode.tagName === 'DIV' || playButton.tagName === 'I' && playButton.className === 'fa fa-stop-circle' && playButton.parentNode.tagName === 'DIV' ) {
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
            //Sample library preview button
            } else if (playButton.tagName === 'I' && playButton.className === 'fa fa-play-circle' && playButton.parentNode.tagName === 'LI' ||playButton.tagName === 'I' && playButton.className === 'fa fa-stop-circle' && playButton.parentNode.tagName === 'LI' ) {
                if(playChecker) {
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
            } else if (playButton.tagName === 'I' && playButton.className === 'fa fa-play' || playButton.tagName === 'I' && playButton.className === 'fa fa-stop') {   
                if(playButton.className === 'fa fa-play') {
                    document.querySelector('#starting-point').style.pointerEvents = 'none';
                    if(startingPoint !== undefined && startingPoint !== '0') {
                        SampleHandler.playChannels(startingPoint, startingPoint);
                        playButton.removeAttribute('class');
                        playButton.setAttribute('class', 'fa fa-stop');
                    } else {
                        SampleHandler.playChannels(false);
                        playButton.removeAttribute('class');
                        playButton.setAttribute('class', 'fa fa-stop');
                    }
                } else {
                    document.querySelector('#starting-point').style.pointerEvents = '';
                    SampleHandler.stopAll();
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
                    SampleHandler.unmuteChannel(notChecked[j], playButton.id);
                }
            //Record button
        } else if(playButton.id === 'record-button') {
            let chromeChecker = MediaRecorder.isTypeSupported('audio/webm;codecs=opus');
            if(chromeChecker) {
                setTimeout(function() { return alert('The recorder is only available in Firefox!'); }, 1);
            } 
                if(recordChecker) {
                    SampleHandler.audioRecorder(true);
                    recordChecker = false;
                } else {
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

    //Space play/stop button
    document.addEventListener('keypress', function(event) {
        if(event.keyCode === 0 || event.keyCode === 32) {
            event.preventDefault();
            console.log('space');
            let playButton = document.querySelector('#play-all-button');

            if(playButton.className === 'fa fa-play') {
                    document.querySelector('#starting-point').style.pointerEvents = 'none';
                    if(startingPoint !== undefined && startingPoint !== '0') {
                        SampleHandler.playChannels(startingPoint, startingPoint);
                        playButton.removeAttribute('class');
                        playButton.setAttribute('class', 'fa fa-stop');
                    } else {
                        SampleHandler.playChannels(false);
                        playButton.removeAttribute('class');
                        playButton.setAttribute('class', 'fa fa-stop');
                    }
                } else {
                    document.querySelector('#starting-point').style.pointerEvents = '';
                    SampleHandler.stopAll();
                    if(recordChecker === false) {
                        SampleHandler.audioRecorder(false);
                        recordChecker = true;
                    }
                }
        }
    })

    //Playback starting point
    document.querySelector('#starting-point').addEventListener('change', function(event) {
        startingPoint = this.options[this.selectedIndex].value;

        for(let i = 1; i < 6; i++) {
            for(let j = 0; j < 16; j++) {
                document.querySelector('#channel' + i + 'Slot' + j).style.boxShadow = 'none';
            }
        }

        for(let i = 1; i < 6; i++) {
            document.querySelector('#channel' + i + 'Slot' + startingPoint).style.boxShadow = '0 0 3px 3px rgba(194, 216, 233, 0.8)';
        }
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