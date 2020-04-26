const jwt = require('jsonwebtoken');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      },
      unique: {
          args: true,
          msg: 'Email address already in use!'
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  User.prototype.generateJWT = function () { 
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'medi-file-mgmt');  
  }

  User.prototype.toAuthJSON = function() {
    return {
      _id: this._id,
      email: this.email,
      token: this.generateJWT(),
    };
  };
  
  return User;
};
