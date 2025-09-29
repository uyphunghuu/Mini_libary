'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // 1 category có nhiều book
      Category.hasMany(models.Book, { foreignKey: 'category_id', as: 'books' });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      underscored: true, // dùng created_at thay vì createdAt
    }
  );

  return Category;
};
