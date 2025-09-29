module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("books", "genre", {
      type: Sequelize.STRING(100),
      allowNull: true, // cho phép null (nếu muốn bắt buộc thì để false)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("books", "genre");
  },
};
