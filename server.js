// you know what these are
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

// let's set up our app to throw jsons around
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// router
app.use(express.static(path.join(__dirname, '/public')));
app.post('/', calendar);

function calendar(req, res) {
  var ssol = require('ssol-api');
  ssol.authLogin(req.body.lg_username, req.body.lg_password, function (err, sessionToken, creation) {
    if (err) {
      throw err;
      res.status(500);
      res.send(err);
    }
    ssol.academicSchedule(sessionToken, function (err, message) {
      res.status(200);
      res.send(message);
    });
  });
}

// initialize the server
var port = Number(process.env.PORT || 5000);
console.log("Server running on port " + port);
app.listen(port);
