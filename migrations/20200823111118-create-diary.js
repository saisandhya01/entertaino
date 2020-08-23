"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("diaries", {
      username: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("diaries");
  },
};
