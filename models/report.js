'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Report.init({
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.ARRAY(DataTypes.FLOAT),
      defaultValue: [0, 0],
    },
    user: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'Users',
        },
        key: 'id',
      }
    },
    content: {
      type: DataTypes.STRING(1000),
      defaultValue: '',
    },
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};
