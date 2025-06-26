'use strict';
const formatDate = require('../helpers/formatDate')
const {hashPassword} = require('../helpers/hashPassword')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Todos, {
        onDelete: 'CASCADE',
        onUpdate:'CASCADE'
      })
    }
    get formatDateCreatedAt() {
      return formatDate(this.createdAt)
    }
    get formatDateUpdatedAt() {
      return formatDate(this.updatedAt)
    }
  }
  Users.init({
    //crete validation here
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'username cannot empty'
        },
        len: {
          args: [5,8],
          msg: 'username should contains 5 - 8 character'
        }
      }
    },
    email:{
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'email cannot empty'
        },
        isEmail: {
          msg: 'please insert correct email format'
        }
      }
    }, 
    password: {
      type:DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'password cannot empty'
        },
        len: {
          args: [8],
          msg: 'password minimum 8 char'
        }
      }
    },
    role: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    description: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
    hooks: {
      beforeCreate: (instance, option) => {
        instance.password = hashPassword(instance.password)
      }
    }
  });
  return Users;
};