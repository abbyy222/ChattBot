'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoodLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        MoodLog.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  MoodLog.init({
    userId: DataTypes.INTEGER,
    mood: DataTypes.STRING,
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'MoodLog',
  });
  return MoodLog;
};