'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn('UserStats', 'money', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        }, {
          transaction: t,
        }),
        queryInterface.addColumn('AnimalStats', 'animalID', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        }, {
          transaction: t,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {await queryInterface.sequelize.transaction(t => {
    return Promise.all([
      queryInterface.changeColumn('UserStats', 'money', {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      }, {
        transaction: t,
      }),
      queryInterface.removeColumn('AnimalStats', 'animalID', {
        transaction: t,
      }),
    ]);
  });
  }
};
