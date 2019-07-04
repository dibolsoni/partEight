'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Title is required"
          }
        }
    },
    author: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Author is required"
          }
        }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      
    }
  });
  return Book;
};