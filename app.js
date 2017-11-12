//require statements
const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs'); //database scripting ?dont need anymore?
const mongoose = require('mongoose');
const path = require('path');
const expressValidator = require('express-validator')

//connect to DB
mongoose.connect('mongodb://localhost/audiodb');
  let db = mongoose.connection;
  //music upload addition
// require Gridfs
const Grid = require('gridfs-stream');
// require filesystem module
const fs = require('fs');
  //end

// where to find audio in FILESYSTEM that will be stored in db  ///////
var audioPath = path.join(__dirname, '/music/drama.m4a'); //////
//////////// will have to change to a variable set by the form ///////

//connect Gridfs and MongoDB
Grid.mongo = mongoose.mongo;

//Check DB connection
  db.once('open', function(){
    console.log('Connected To MongoDB');

    //////////////////////////////////////  up
    var gfs = Grid(db.db)

    //when connection is open, create WRITE stream
    var writeStream = gfs.createWriteStream({
      //will be store in Mongo as 'Goodmorning'
      filename: 'Drama'
    });
    //create a read-stream from where file currently is (audioPath)
    // and pipe it into the database (using writeStream)
    fs.createReadStream(audioPath).pipe(writeStream);

    writeStream.on('close', function(file){
      //do something with files
      console.log(file.filename+' Written to DB');
    });
    ////////////////////////////////////////  up
  });

//Check for DB Errors:
  db.on('error',function(err){
    console.log(err);
  });

//set app to express
const app = express(); // set app to run express function
//link router
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

/////APP.GET STATEMENTS
//Bring In Models
let Article = require('./public/js/mongofizz');

//Add Route
app.get('/signup', function(req, res){
  res.render('signup', {
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
// get signup ejs
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
