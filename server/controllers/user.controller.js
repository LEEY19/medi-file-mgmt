const passport = require('passport'); 
const bcrypt = require('bcrypt');
const db = require("../models");
const User = db.users;
const uuidv4 = require('uuid/v4');

const signUp = async (req, res) => {
  let {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: `Email or password is empty, both must be filled!`
    });
  };

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) reject(err)
      resolve(hash)
    });
  })

  const user_to_be_created = {
    id: uuidv4(),
    email: email,
    password: hashedPassword
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

  req.session.email = email;
  return res.json({ user: req.user.toAuthJSON() });

};

const logOut = (req, res) => {
  let {email} = req.body;

  User.findOne({
    where: {email}
  })
  .then((user) => {
    if(!user) {
      return res.status(400).json({
        message: "User is not found"
      });
    }

    req.session.destroy((err) => {
        if(err) {
          return res.status(400).json({
            message: "Session destroying failed!"
          });
        }
    });

    return res.status(200).json({ message: "Logged Out!" });
  });
};

const current = (req, res) => {
  const {payload} = req
  User.findOne({
    where: {email: payload.email}
  })
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
