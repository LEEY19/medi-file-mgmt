const passport = require('passport'); 
const bcrypt = require('bcrypt');
const db = require("../models");
const User = db.user;

const signUp = (req, res) => {
  let {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email or password is empty, both must be filled!"
    });
  };

  const user_to_be_created = {
    email: email,
    password: bcrypt.hash(password, 10, (err, hash) => return hash)
  };

  User.create(user_to_be_created)
    .then(user_created => {
      res.json({ user: user_created.toAuthJSON() });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
};

const logIn = (req, res) => {
  let {email, password} = req.body;
  if (!email || !password) {
    res.status(400).json({
      message: "Email or password is empty, both must be filled!"
    });
    return;
  };
  
  const temp = req.session.passport;

  req.session.regenerate((err) => {
    if (err) {
      console.log("error regen session")
    }
  });

  req.session.passport = temp;
    
  req.session.save((err) => {
    if (err) {
      console.log("error save session")
    }
  });

  return res.json({ user: req.user.toAuthJSON() });

};

const logOut = (req, res) => {
  req.session.destroy(function(err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({
        success: true,
        message: 'You are logged out'
      });
    }
  });
};

const current = (req, res) => {
  User.findByPk(id)
    .then((user) => {
      if(!user) {
        return res.status(400).json({
          message: "User is not found"
        });
      }

      return res.json({ user: user.toAuthJSON() });
    });
};

module.exports = {
  signUp: signUp,
  logIn: logIn,
  logOut: logOut,
  current: current
}
