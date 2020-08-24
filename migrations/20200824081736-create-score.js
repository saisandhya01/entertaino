"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("scores", {
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
      username: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        references: {
          model: "users",
          key: "username",
          as: "username",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("scores");
  },
};
