"use strict";

const Samplebox = require('./samplebox');
// const $ = require('jquery');
let idCounter = 0;

function Desktop() {
    let wrapper = document.querySelector('#wrapper');

    /**
     * Logic running when a div is dropped on the droppable
     */
    $('.main-timeline').droppable({
        drop: function( event, ui ) {
            $( this );
        }
    });

    let sampleList = document.querySelector('#sample-list'); //The list with the samples

    /**
     * listen for click on a new sample and loads it with the samplebox();
     */
    sampleList.addEventListener('click', function(event) {
        Samplebox(idCounter, $(event.target).text());

        idCounter += 1;
    });








}

module.exports = Desktop;




