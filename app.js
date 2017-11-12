  //require statements
const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs'); //database scripting
const mongoose = require('mongoose');
const path = require('path');
const expressValidator = require('express-validator')

//connect to DB
mongoose.connect('mongodb://localhost/audiophilesdb');
  let db = mongoose.connection;

//Check DB connection
  db.once('open', function(){
    console.log('Connected To MongoDB');
  });


//Check for DB Errors:
  db.on('error',function(err){
    console.log(err);
  });

  //set app to express
const app = express(); // set app to run express function

const router = express.Router();

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); //set path to views

// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set middleware for STATIC files (path)
app.use(express.static(path.join(__dirname, 'public')));

//Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root    = namespace.shift()
    , formParam = root;

  while(namespace.length){
    formParam += '[' + namespace.shift() + ']';
  }
  return {
    param: formParam,
    msg: msg,
    value: value
  };
  }
}));

//Bring In Models
let Article = require('./public/js/mongofizz');

//Add Route
app.get('/views/signup', function(req, res){
  res.render('/signup', {
    title: 'Sign Up For Audiophiles'
  });
});
  //tell the browser to get the / directory which takes to index file
app.get('/',function (req, res){
  res.render('index', {
      title: 'Audiophiles',
  });
});
//get browse ejs
app.get('/browse',function (req, res){
  res.render('browse',{
      title: 'Audiophiles',
    });
});
// get upload ejs
app.get('/upload',function (req, res){
  res.render('upload',{
      title: 'Audiophiles',
    });
});
// get login ejs
app.get('/login',function (req, res){
  res.render('login',{
      title: 'Audiophiles',
    });
});
//include get signup ejs
app.get('/signup',function (req, res){
  Article.find({},function(err, articles){
    if(err){
      console.log(err);
    } else {
    res.render('signup', {
      title: 'Sign Up For Audiophiles',
      articles: articles
    });
    }
  });
});

//Add Router Routes
let signup = require('./routes/signup');
app.use('/signup', signup);
  //set app.js to port 8080
app.listen(8080, function(){
  console.log('Server Started on Port 8080...');
});
