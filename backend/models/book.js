'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Các association của Book
     */
    static associate(models) {
      // 1 sách thuộc 1 thể loại
      Book.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });

      // 1 sách có nhiều lượt mượn
      Book.hasMany(models.Borrow, { foreignKey: 'book_id', as: 'borrows' });

      // 1 sách có thể có nhiều log
      Book.hasMany(models.Log, { foreignKey: 'book_id', as: 'logs' });
    }
  }

  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: true, // nếu muốn bắt buộc thì để false
      },
      quantity_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      quantity_available: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Book',
      tableName: 'books',
      underscored: true,
    }
  );

  return Book;
};
