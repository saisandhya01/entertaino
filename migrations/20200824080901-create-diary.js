"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("diaries", {
      date: {
        type: Sequelize.DATE,
      },
      notes: {
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
    await queryInterface.dropTable("diaries");
  },
};
