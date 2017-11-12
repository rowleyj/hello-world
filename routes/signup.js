const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//Bring In Models
let Article = require('../public/js/mongofizz');

//Get Single article
router.get('/signup/:id', function(req, res){
  Article.findById(req.param.id, function(err, article){
    res.render('signup', {
      article:article
    });
  });
});

//Add Route
router.get('/views/signup', function(req, res){
  res.render('/signup', {
    title: 'Sign Up For Audiophiles'
  });
});

//Add Submit POST Route
router.post('/signup', function(req, res){
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
  req.checkBody('confirmPassword', 'Passwords do not match Jesse u dumb fuck').equals(req.body.password);
//If Didn't Fill Out Field, Then Error:
  let errors = req.validationErrors();

    if(errors){
      res.render('signup',{
        errors:errors
      });
    } else {
      let newUser = new User({
      username:username,
      firstName:firstName,
      lastName:lastName,
      eMail:eMail,
      password:password
    });

      bcrypt.genSalt(26, function(err, salt){
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
          res.redirect('login');
        }
      });
    });
  });
}
module.exports = router;
