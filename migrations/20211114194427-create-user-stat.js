'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserStats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      money: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      x: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      y: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      username: {
        type: Sequelize.STRING
      },
      user: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserStats');
  }
};