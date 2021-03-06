'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Reports', 'content', {
          type: Sequelize.STRING(1000),
          defaultValue: '',
        }, {
          transaction: t,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Reports', 'content', {
          transaction: t,
        }),
      ]);
    });
  }
};
