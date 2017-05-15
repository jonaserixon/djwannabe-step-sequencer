const SampleHandler = require('./samplehandler');

let idCounter = 0;
let playChecker = true;
let muteChecker = true;
let recordChecker = true;
let timer; 
let lastPlayed;
let startingPoint;


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
            if(playButton.tagName === 'I' && playButton.className === 'fa fa-play-circle' || playButton.tagName === 'I' && playButton.className === 'fa fa-stop-circle') {
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
            //Global play/stop button
            } else if (playButton.tagName === 'I' && playButton.id === 'play-all-button' || playButton.tagName === 'I' && playButton.id === 'stop-all-button') {    //'play-all-channels-button'
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