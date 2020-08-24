"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("planners", {
      date: {
        type: Sequelize.DATE,
      },
      morning: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      afternoon: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      evening: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    await queryInterface.dropTable("planners");
  },
};
