'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AnimalStat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AnimalStat.init({
    earnRate: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    lifeEnd: {
      type: DataTypes.DATE
    },
    user: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'AnimalStat',
  });
  return AnimalStat;
};