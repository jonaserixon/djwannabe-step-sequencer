

function Channel(id, context) {
    this.context = context;
    this.id = id;               //Channel id
    this.samples = [];          //channels audiobuffers
    this.sources = [];          //Keep track of buffersource nodes created from scheduler method
    this.timeouts = [];         //setTimeOuts
    this.sampleslotDivs = [];   //Sample-slot id

    for (let i = 0; i < 8; i++) {
        let theSlot = document.querySelector('#channel' + this.id + 'Slot' + i);
        this.sampleslotDivs.push(theSlot);
    }

    for (let i = 0; i < 8; i++) {
        loadSound(this, './audio/Silence.ogg', undefined, this.context);
    }
}

Channel.prototype = {
    addSample: function(sampleSlot, samplePath) {
        loadSound(this, samplePath, sampleSlot, this.context);
    },
    swapSample: function(sampleSlot, newSample) {
        this.samples.splice(sampleSlot, 1, newSample);
    },
    scheduler: function(gainControl, filterControl) {
        console.log(filterControl);
        for (let i = 0; i < this.samples.length; i++) {
            let audio = this.context.createBufferSource();
            this.sources[i] = audio;
            audio.buffer = this.samples[i];
            audio.connect(filterControl);
            filterControl.connect(gainControl);
            audio.start(this.context.currentTime + (audio.buffer.duration * i));

            this.timeouts.push(setTimeout(function() {
                // Add the border to the playing sample slot
                let playingSlot = this.sampleslotDivs[i];
                playingSlot.style.boxShadow = '0 0 6px 3px rgba(169, 255, 250, 0.6)';
            }.bind(this), audio.buffer.duration * i * 1000));

            audio.onended = function() {
                this.sampleslotDivs[i].style.boxShadow = '';
            }.bind(this);
        }
    }.bind(this),
    stop: function() {
        for (let i = 0; i < this.sources.length; i++) {
            this.sources[i].stop(0);
        }

        for (let i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]);
        }
    }   
}

function loadSound(channel, audiosample, sampleSlot, context) {
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

module.exports = Channel;