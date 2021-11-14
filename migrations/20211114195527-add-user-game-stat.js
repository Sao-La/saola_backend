'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Users', 'userStat', {
          type: Sequelize.INTEGER,
          allowNull: true,
        }, {
          transaction: t,
        }),
        queryInterface.addColumn('Users', 'animalStats', {
          type: Sequelize.ARRAY(Sequelize.INTEGER),
          defaultValue: [],
        }, {
          transaction: t,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Users', 'userStat', {
          transaction: t,
        }),
        queryInterface.removeColumn('Users', 'animalStats', {
          transaction: t,
        }),
      ]);
    });
  }
};
