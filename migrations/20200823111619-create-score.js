"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("scores", {
      username: {
        type: Sequelize.STRING,
      },
      game1: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      game2: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      game3: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("scores");
  },
};
