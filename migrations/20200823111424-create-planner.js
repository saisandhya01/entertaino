"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("planners", {
      username: {
        type: Sequelize.STRING,
      },
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("planners");
  },
};
