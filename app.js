/////////////////////////////// require statements  ///////////////////////////////
const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs'); //database scripting ?dont need anymore?
const mongoose = require('mongoose');
const path = require('path');

//Signup:
const bcrypt = require('bcryptjs');
const expressValidator = require('express-validator');

//Upload:
const Grid = require('gridfs-stream'); // require Gridfs
const fs = require('fs'); // require filesystem module

//Login:
const config = require('./config/database');
const passport = require('passport');

//Browse:


//Models
const Song = require('./public/js/songUpload'); //needed model


///////////////////////////////////////////////////////////////////////////////////

/////////////////////////////// App Initialize ////////////////////////////////////
const app = express(); // set app to run express function
/*  View Engine - Embedded Javascript(.EJS) */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); //set path to views
///////////////////////////////////////////////////////////////////////////////////

/////////////////////////////// Database Initialize ///////////////////////////////

/*  connection  */
mongoose.connect(config.database);
Grid.mongo = mongoose.mongo; //set Gridfs to use mongoose
  let db = mongoose.connection;
/* test connection */
  db.once('open', function(){
    console.log('Connected To MongoDB');
  });
  db.on('error',function(err){
    console.log(err);
  });
///////////////////////////////////////////////////////////////////////////////////

const gfs = Grid(db) // set gfs to fs.files
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
/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////Passport MiddleWare/////////////////////////////////////
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());
//IDEA: WHEN WE HAVE USERS, IN OUR CSS WE CAN SET IT TO SEE LOGIN IF LOGGED OUT AND LOGOUT IF LOGGED IN
//That is why I have code commented below (Travery Media Ep 10 18mins or so)

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

////////////////////////////////  EJS View Routes /////////////////////////////////
/* index  */
app.get('/',function (req, res){
  res.render('index', {
      title: 'Audiophiles',
  });
});

/*  browse ejs  */
app.get('/browse',function (req, res){
 /* access song files, assign to docs */
 var filesColl = db.collection('fs.files');
 var filesQuery = filesColl.find({});
 filesQuery.toArray(function(error, docs) {

   res.render('browse',{
        title: "Your Library",
       songs: docs
     });
})
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
app.get('/signup',function (req, res){
    res.render('signup', {
      title: 'AudioPhiles'
    });
  });

///////////////////////////////////////////////////////////////////////////////////

///////////////////////////////  UPLOAD POST METHOD //////////////////////////////////////
/* upload */

app.post('/upload',function(req, res){


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
    let newSong = new Song({
      filename: req.body.fileToUpload,
      metadata:{
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album
      }
    });
    /* create write stream "songUp" */
    var songUp = gfs.createWriteStream(newSong);
    //write audiofile and metadata(title,artist,and album to db)
    req.pipe(songUp);

    /* check if stream closes */
    songUp.on('close', function(file){
      //do something with files
    console.log(file.filename+' Written to DB');
     });
      }
      res.redirect('/'); //send back to home
    });
///////////////////////////////////////////////////////////////////////////////////

//////////////////////////////Sign-Up POST//////////////////////////////////////////
  const User = require('./public/js/mongofizz'); //Needed model
app.post('/signup', function(req, res){
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const eMail = req.body.eMail;
  const confirmEMail = req.body.confirmEMail;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  req.checkBody('username', 'Username is required.').notEmpty();
  req.checkBody('firstName', 'First name is required.').notEmpty();
  req.checkBody('lastName', 'Last name is required.').notEmpty();
  req.checkBody('eMail', 'eMail is not valid.').isEmail();
  req.checkBody('eMail', 'eMail is required.').notEmpty();
  req.checkBody('confirmEMail', 'Confirm eMail is required.').notEmpty();
  req.checkBody('password', 'password is required.').notEmpty();
  req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();
//If unsuccessful
    if(errors){
      console.log('Sign-Up was unsuccessful');
      res.render('signup', {
        title: 'AudioPhiles'
      });
    } else {
      let newUser = new User({
        username: username,
        firstName: firstName,
        lastName: lastName,
        eMail: eMail,
        password: password
      });//If successful
//Generate salt to hide password
        bcrypt.genSalt(8, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
          if(err){
            console.log(err);
          }
      newUser.password=hash;
      newUser.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          res.redirect('/login')
        }//Redirect to login if successful
      });
    });
  });
}
});
///////////////////////////// Login Process /////////////////////////////////////
app.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
  })(req, res, next);
});

///////////////////////////// Localhost Port /////////////////////////////////////
app.listen(8080, function(){
  console.log('Server Started on Port 8080...');
});
///////////////////////////////////////////////////////////////////////////////////
