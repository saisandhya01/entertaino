'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('planners', {
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
      morning: {
        type: Sequelize.TEXT,
        allowNull:false,
      },
      afternoon: {
        type: Sequelize.TEXT,
        allowNull:false
      },
      evening: {
        type: Sequelize.TEXT,
        allowNull:false
      },
     });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('planners');
  }
};