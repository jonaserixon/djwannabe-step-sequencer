function Channel(context) {
    this.audiocontext = context;
    this.samples = [undefined, undefined, undefined];
}


// let channel1 = new Channel(["hej.mp3", hej2.mp3]);
// channel1.addSample(3, "asdasdalsdjasd.mp3");
// channel1.play();
// channel1.stop();

module.exports = Channel;
