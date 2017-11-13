/////////////////////////////// require statements  ///////////////////////////////
const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs'); //database scripting ?dont need anymore?
const mongoose = require('mongoose');
const path = require('path');
const expressValidator = require('express-validator')
const Grid = require('gridfs-stream'); // require Gridfs
const fs = require('fs'); // require filesystem module
///////////////////////////////////////////////////////////////////////////////////

/////////////////////////////// App Initialize ////////////////////////////////////
const app = express(); // set app to run express function
const router = express.Router(); //link router
/*  View Engine - Embedded Javascript(.EJS) */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); //set path to views
///////////////////////////////////////////////////////////////////////////////////

/////////////////////////////// Database Initialize ///////////////////////////////
Grid.mongo = mongoose.mongo; //set Gridfs to use mongoose
/*  connection  */
mongoose.connect('mongodb://localhost/audiodb');
  let db = mongoose.connection;
/* test connection */
  db.once('open', function(){
    console.log('Connected To MongoDB');
  });
  db.on('error',function(err){
    console.log(err);
  });
///////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////// MiddleWare ///////////////////////////////////
/* body-parser middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* static file pathway (js,images,css)  */
app.use(express.static(path.join(__dirname, 'public')));

/* Validator Middleware */
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
///////////////////////////////////////////////////////////////////////////////////

//////Bring In Models ?????????????????????????????? rename article something descriptive?
let Article = require('./public/js/mongofizz'); /// ???????????????
/// ?????????????????????????????????????????????

///////////////////////////////////////////////////////////////////////////////////

////////////////////////////////  EJS View Routes /////////////////////////////////
/* index  */
app.get('/',function (req, res){
  res.render('index', {
      title: 'Audiophiles',
  });
});
/*  browse ejs  */
app.get('/browse',function (req, res){
  res.render('browse',{
      title: 'Audiophiles',
    });
});
/*  upload ejs  */
app.get('/upload',function (req, res){
  res.render('upload',{
      title: 'Audiophiles',
    });
});
/*  login ejs */
app.get('/login',function (req, res){
  res.render('login',{
      title: 'Audiophiles',
    });
});
/* get signup ejs */ // IDEA: i got rid of other app.get for signup
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
///////////////////////////////////////////////////////////////////////////////////

///////////////////////////////  POST METHOD //////////////////////////////////////
/* upload */
app.post('/upload',function(req, res){

  const gfs = Grid(db.db) // set gfs to grid function of db
  //form validation
  req.checkBody('title', 'Title is Required').notEmpty();
  req.checkBody('artist', 'Artist is Required').notEmpty();

  //check for errors within form submission
  var errors = req.validationErrors();

  if(errors){
    console.log('error experienced while attempting upload');
    /* rerender upload view */
    res.render('upload',{
      title: 'AudioPhiles',
    });
  }else{
    const writeStream = gfs.createWriteStream({
      filename: req.body.fileToUpload,
      metadata:{
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album
      }
      });
    //write audiofile and metadata(title,artist,and album to db)
    req.pipe(writeStream);
    /* check if stream closes */
    writeStream.on('close', function(file){
      //do something with files
      console.log(file.filename+' Written to DB');
    });
      }
      res.redirect('/'); //send back to home
    });
///////////////////////////////////////////////////////////////////////////////////

//Add Router Routes
let signup = require('./routes/signup');
app.use('/signup', signup);


///////////////////////////// Localhost Port /////////////////////////////////////
app.listen(8080, function(){
  console.log('Server Started on Port 8080...');
});
///////////////////////////////////////////////////////////////////////////////////
