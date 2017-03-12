var express = require('express');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/wordstudy');

var path = require('path');
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// Make our db accessible to our router
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    req.db = db;
    next();
});

// Define the port to run on
app.set('port', 3000);
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('public'));
app.get('/:userId', function(req, res) {
    var userId = req.params.userId;
    var db = req.db;
    var collUsers = db.get("users");
    var words = collUsers.find({ userId: userId }).then((words) => {
        res.send(words);
        console.log(words);
    });
});
app.post('/:userId', function(req, res) {
    var userId = req.params.userId;
    var db = req.db;
    var collUsers = db.get('users');
    collUsers.update({ 'userId': userId }, { 'userId': userId, 'words': req.body.body }, { upsert: true });
    console.log('Got post request, updated to DB');
});
// Listen for requests
var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
});