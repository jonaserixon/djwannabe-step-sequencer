'use strict';

const Samplebox = require('./samplebox');
let idCounter = 0;

function Desktop() {
    let wrapper = document.querySelector('#wrapper');
    let channelDiv = document.querySelector('#snaptarget');
    let removeButton = document.querySelector('#remove-sample');
    let sampleList = document.querySelector('#sample-list'); //The list with the samples

    let sampleboxes = document.querySelector('.draggable-content ui-draggable ui-draggable-handle');
    
    /**
     * Sends audiosample path to the samplebox function
     */
    sampleList.addEventListener('click', function(event) {
        Samplebox.samplebox(idCounter, $(event.target).text());
        idCounter += 1;
        Samplebox.makeDroppable('slot' + idCounter);
    });

    removeButton.addEventListener('click', function(event) {
        
    });


}

module.exports = Desktop;





