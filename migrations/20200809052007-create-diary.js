'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('diaries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      Date: {
        type: Sequelize.DATE
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull:false
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('diaries');
  }
};