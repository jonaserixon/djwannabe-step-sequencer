'use strict';

let Desktop = require('./javascript/desktop');
new Desktop(); 

let loader = setTimeout(function() {
    $( "*" ).css('visibility', '');
}, 300);