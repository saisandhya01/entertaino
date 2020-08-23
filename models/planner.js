"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class planner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  planner.init(
    {
      username: DataTypes.STRING,
      date: DataTypes.DATE,
      morning: DataTypes.TEXT,
      afternoon: DataTypes.TEXT,
      evening: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "planner",
    }
  );
  return planner;
};
