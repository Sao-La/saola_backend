'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserStat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserStat.init({
    money: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    x: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    y: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    username: {
      type: DataTypes.STRING
    },
    user: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'UserStat',
  });
  return UserStat;
};