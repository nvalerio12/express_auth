'use strict';
const bcrypt = require('bcrypt');
const {
  Model
} = require('sequelize');
const { delete } = require('../routes/auth');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      validate:{
        len: [1,99],
        msg: 'Name must be between 1 and 99 charaters'
      }
    },
    email: {
      type: DataTypes.STRING,
        validate: {
          isEmail: {
            msg: 'Invalid email'
          }
        }
    },  
    password: {
      type:  DataTypes.STRING,
      validate: {
        len: [8,99],
        msg: 'Password must be between 8 and 99 characters'
      }
    } 
  }, {
    sequelize,
    modelName: 'user',
  });
};
  user.addHook('beforeCreate', (pendingUsser) =>{ // pendingUser is object that gets passed to DB
    // Bcrypt is going to hash the password
    let hash = bcrypt.hashSync(pendingUsser.password, 12);
    pendingUsser.password = hash; // This will go to DB
  });

  user.prototype.validatePassword = function(typePassword) {
    let isCorrectPassword =  bcrypt.compareSync(typePassword, this.password);// checks to see if password is correct
    return isCorrectPassword;
  }

  user.prototype.toJSON = function() {
    let userData = this.get();
    delete userData.prototype;// it doesn't delete password from database, only removes it. 
    return userData;
  }