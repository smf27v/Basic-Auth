var express = require('express');
var router = express.Router();
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

const User = require('../models/user');

/* GET users listing. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/login', (req, res) => {
  res.render('auth/loginForm');
});

router.post('/login', (req, res)=> {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/loginForm", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({username: username}, (err, user)=>{
    if(err){
      next(err);
    } else {
      if (!user){
        res.render("auth/loginForm", {
          errorMessage: "Username doesn't exist sign up"
        });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("auth/loginForm", {
            errorMessage: "Incorrect password"
          });
        }
      }
    }
  });

});

router.get('/logout', (req, res)=>{
  req.session.destroy(function(err) {
    // cannot access session here
    res.redirect("/");
  });
});

router.get('/signup', function(req, res, next) {
  res.render('auth/signUpForm');
});

router.post('/signup', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signUpForm", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }else{
    User.findOne({ username: username}, (err, user) => {
      if(err){
        next(err);
      } else {
        if(!user) {
          // no user
          var salt     = bcrypt.genSaltSync(bcryptSalt);
          var hashPass = bcrypt.hashSync(password, salt);

          var newUser  = User({
            username,
            password: hashPass
          });
          newUser.save((err) => {
            if (err) {
              next(err);
            } else {
              res.redirect("/");
            }
          });
        }else {
          res.render("auth/signUpForm", {
            errorMessage: "username already taken"
          });
        }
      }
    });
  }
});



module.exports = router;
