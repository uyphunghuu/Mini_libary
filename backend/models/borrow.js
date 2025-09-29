'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Borrow extends Model {
    static associate(models) {
      // Borrow thuộc về User
      Borrow.belongsTo(models.User, { foreignKey: 'user_id'});

      // Borrow thuộc về Book
      Borrow.belongsTo(models.Book, { foreignKey: 'book_id'});
    }
  }

  Borrow.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      borrow_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      return_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'returned', 'overdue'),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'Borrow',
      tableName: 'borrows',
      underscored: true,
    }
  );

  return Borrow;
};
