'use strict';

let express = require('express');
let exphbs = require('express-handlebars');
let bodyParser = require('body-parser');
let path = require('path');
let socket = require('socket.io');

let app = express();
let port = 8000;

let http = require('http').Server(app);
let io = require('socket.io')(http);

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Static files
app.use(express.static(path.join(__dirname, 'public')));


//the req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




//Routes
app.use('/', require('./routes/routes.js'));


//Starts web server
http.listen(port, function() {
    console.log("Express started on http://localhost:" + port);
    console.log("Press Ctrl-C to terminate...");
});
