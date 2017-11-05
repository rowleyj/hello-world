  //require statements
var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require('mongojs'); //database scripting
var path = require('path');

  //set app to express
var app = express(); // set app to run express function

  //View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); //set path to views

  // body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

  //set middleware for STATIC files (path)
app.use(express.static(path.join(__dirname, 'public')))

  //tell the browser to get the / directory which takes to index file
app.get('/',function (req, res){
  res.render('index',{
      title: 'Audiophiles',
    });
});


  //set app.js to port 8080
app.listen(8080, function(){
  console.log('Server Started on Port 8080...');
})
