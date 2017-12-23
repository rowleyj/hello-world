/////////////////////////////// require statements  ///////////////////////////////
const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs'); //database scripting ?dont need anymore?
const mongoose = require('mongoose');
const path = require('path');

//Upload:
const Grid = require('gridfs-stream'); // require Gridfs
const fs = require('fs'); // require filesystem module

//Login:
const passport = require('passport');
var port = process.env.PORT || 8080;
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user.js');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup

    passport.use('local', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

        });

    }));

passport.use('local', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'eMail',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));
};

/*const LocalStrategy = require('passport-local').Strategy;
const User = require('../public/js/mongofizz');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  //Implement Local Strategy (Through MongoDB)
  passport.use(new LocalStrategy(function(username, password, done){
    //Match username
    let query = {username:username};
    User.findOne(query, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'No user found'});
      }

    //Match password
    bcrypt.compare(password, user.password, function(err, isMatch){
      if(err) throwerr;
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Password is incorrect!'});
      }
    });
    });
  }));

  passport.serializeUser(function(user, done){
    done(null, user.id)
  });
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
    });
}
*/
