"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class diary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  diary.init(
    {
      username: DataTypes.STRING,
      date: DataTypes.DATE,
      notes: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "diary",
    }
  );
  return diary;
};
