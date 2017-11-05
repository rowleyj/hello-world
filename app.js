var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator'); //form validation
var mongojs = require('mongojs'); //database scripting


var app = express(); // set app to run express function




app.listen(8080, function(){
  console.log('Server Stated on Port 8080...');
})
