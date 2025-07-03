'use strict';
const formatDate = require('../helpers/formatDate')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users,{
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
  Todos.init({
    todo: {
      type:DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'todo cannot empty'
        }
      }
    }, 
    description: DataTypes.STRING,
    due_date: DataTypes.STRING,
    status: DataTypes.STRING,
    category: DataTypes.STRING,
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
            tableName: "Users"
          },
          key: 'id'
      }
    },
    isDone: DataTypes.BOOLEAN
  },{
    sequelize,
    modelName: 'Todos',
  });
  return Todos;
};