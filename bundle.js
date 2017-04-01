(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

let Desktop = require('./javascript/desktop');

new Desktop();
},{"./javascript/desktop":2}],2:[function(require,module,exports){
"use strict";

const Samplebox = require('./samplebox');
// const $ = require('jquery');
let idCounter = 0;

function Desktop() {
    let wrapper = document.querySelector('#wrapper');

    /**
     * Logic running when a div is dropped on the droppable
     */
    // $('.main-timeline').droppable({
    //     drop: function( event, ui ) {
    //         $( this );
    //     }
    // });

    let sampleList = document.querySelector('#sample-list'); //The list with the samples

    /**
     * Sends audiosample path to the samplebox function
     */
    sampleList.addEventListener('click', function(event) {
        Samplebox(idCounter, $(event.target).text());
        idCounter += 1;
    });
}

module.exports = Desktop;






},{"./samplebox":3}],3:[function(require,module,exports){
'use strict';
// const $ = require('jquery');

let playChecker = true;
let wrapper = document.querySelector('#wrapper');
let samples = [];       //Array with all current samples
let activeSamples = []; //Array with the channels current samples

/**
 * The audio sample creator
 * sample - path to audio sample
 */


//The 'play-all' button
let playAllButton = document.createElement('button');
playAllButton.setAttribute('id', 'play-all-button');
playAllButton.textContent = 'Play all samples';
wrapper.appendChild(playAllButton);


/**
 * Skapar en samplebox div som är draggable + innehåller ett sample + en play knapp
 * @param id = idCounter
 * @param sample = path to sample
 */
function samplebox(id, sample) {
    $(function () {
        $('#samplebox' + id).draggable({
            revert: false,
            zIndex: 10,
            snap: '.sample-slot',
            snapMode: 'inner',
            snapTolerance: 40
        });   
    });

    let sampleBox = document.createElement('div');
    sampleBox.setAttribute('class', 'draggable-content');
    sampleBox.setAttribute('id', 'samplebox' + id);
    sampleBox.setAttribute('sample', sample);
    
    switch(sample) {
        case 'Lead Melody.wav':
            sampleBox.style.backgroundColor = 'ghostwhite';
            break;
        case 'Piano Chords.wav':
            sampleBox.style.backgroundColor = 'black';
            break;
        case 'Synth Chords.wav':
            sampleBox.style.backgroundColor = '#008395';
            break;
        case 'Weird Synth.wav':
            sampleBox.style.backgroundColor = 'pink';
            break;
    }

    /**
     * The 'play' button for specific samplebox
     */
    let playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.setAttribute('data-playbuttonid', id);
    playButton.setAttribute('class', 'sampleButton');
    playButton.setAttribute('id', 'playbutton' + id);

    //Create new audio sample
    let audiosample = new Howl({
        src: './audio/' + sample,
        vol: 1,
        onend: function() {
            playChecker = true;
            sampleBox.style.border = 'solid black';
            playButton.textContent = 'Play';
        }
    });
    samples.push(audiosample);
    playlistHandler(audiosample);

    wrapper.appendChild(sampleBox);
    sampleBox.appendChild(playButton);
}

function playlistHandler (audiosample) {
    $(function() {                                             //lägga in sample i kanal-arrayen här nånstans vid drop
    $(".main-timeline").droppable({
            drop: function (event, ui) {
                let dropped = ui.draggable;
                dropped.destroy();
                activeSamples.push(audiosample);
                // activeSamples[2].play();    //gör eventlistener till arrayen
            },
            out: function( event, ui ) {
                if($('.draggable-content').length === 0) {
                    $(playAllButton).remove();
                }
            }
        });
    });
}

document.addEventListener('click', function(event) {
    let playButton = document.getElementById(event.target.id);
    // console.log($(event.target).text());

    /**
     * Play sample
     */
        if(playButton.tagName === 'BUTTON' && playButton.className === 'sampleButton') {
            console.log(playButton.tagName);
            playButton.textContent = 'Play';

            if(playChecker) {
                playButton.parentNode.style.border = 'solid limegreen';
                // sampleFile(getSample, playButton, playButton.parentNode);
                samples[playButton.getAttribute("data-playbuttonid")].play();
                playButton.textContent = 'Stop';
                playChecker = false;
            } else {
                playButton.textContent = 'Play';
                playButton.parentNode.style.border = 'solid black';
                samples[playButton.getAttribute("data-playbuttonid")].stop();
                playChecker = true;
            }
        } else if (playButton.tagName === 'BUTTON' && playButton.id === 'play-all-button') {
            if(playChecker) {
                for(let i = 0; i < samples.length; i++) {
                    samples[i].play();
                }
                playButton.parentNode.style.border = 'solid limegreen';
                playButton.textContent = 'Stop all samples';
                playChecker = false;
            } else {
                for(let i = 0; i < samples.length; i++) {
                    samples[i].stop();
                }
                playButton.parentNode.style.border = 'solid black';
                playButton.textContent = 'Play all samples';
                playChecker = true;
            }
        }    
});

module.exports = samplebox;
},{}]},{},[1]);
