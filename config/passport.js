const LocalStrategy = require('passport-local').Strategy;
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
