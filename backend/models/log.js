'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate(models) {
      // Log thuộc về User
      Log.belongsTo(models.User, { foreignKey: 'user_id'});

      // Log có thể liên quan đến Book
      Log.belongsTo(models.Book, { foreignKey: 'book_id'});
    }
  }

  Log.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM(
          'borrow_book',
          'return_book',
          'add_book',
          'update_book',
          'delete_book'
        ),
        allowNull: false,
      },
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Log',
      tableName: 'logs',
      underscored: true,
      timestamps: false, // chỉ có created_at
    }
  );

  return Log;
};
