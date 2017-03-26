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
    console.log('Got post request, updated to DB ');
});
app.get('/admin/:word', function(req, res) {
    var word = req.params.word;
    var db = req.db;
    var collUsers = db.get('words');
    console.log('Got GET request ', word);
    var entry = collUsers.find({ 'word': word }, { entry: 1 });
    console.log('Updated to DB ', word);
    res.send(entry);
});
app.post('/admin/:word', function(req, res) {
    var word = req.params.word;
    var db = req.db;
    var collUsers = db.get('words');
    console.log('Got post request ', word);
    collUsers.update({ 'word': word }, { 'word': word, 'entries': req.body.body }, { upsert: true });
    console.log('Updated to DB ', word);
    res.send("OK");
});
// Listen for requests
var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
});

//[‘bald','Beard','Cloak','Coot','Ecstatic','Embarrassing','Exhaust','Friction','Frustrated','Jealous','Miserable','Nervous','Occasion','Seldom','Abundant','Barely','Contradict','Contrast','Dense','Fertilizer','Formerly','Inclement','Ornamental','Pesticide','Scarcely','Shade','Subsequent','Privilege','Compulsion','Disorder','Obsessive','Trend','Upbringing','Blubber','Brood','Cone','Deficiency','Hollow','Hubble','Pastel','Perception','Retina','Rural','Suburb','Suburban','Urban','Feud','Diversity','Nowadays','Obviously','Biographer','Ever','Frequently','Plead','Probation','Upon','Glitch','Although','Cognitive','Consequently','Despite','Likewise','Nevertheless','chase','Coherence','Nourish','Rhythm']

//db.users.update({userId:'tranthainam'},{userId:'tranthainam',unsavedwords:['bald','Beard','Cloak','Coot','Ecstatic','Embarrassing','Exhaust','Friction','Frustrated','Jealous','Miserable','Nervous','Occasion','Seldom','Abundant','Barely','Contradict','Contrast','Dense','Fertilizer','Formerly','Inclement','Ornamental','Pesticide','Scarcely','Shade','Subsequent','Privilege','Compulsion','Disorder','Obsessive','Trend','Upbringing','Blubber','Brood','Cone','Deficiency','Hollow','Hubble','Pastel','Perception','Retina','Rural','Suburb','Suburban','Urban','Feud','Diversity','Nowadays','Obviously','Biographer','Ever','Frequently','Plead','Probation','Upon','Glitch','Although','Cognitive','Consequently','Despite','Likewise','Nevertheless','chase','Coherence','Nourish','Rhythm']},{upsert:true})