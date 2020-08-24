"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class score extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      score.belongsTo(models.user, {
        foreignKey: "username",
        onDelete: "CASCADE",
      });
    }
  }
  score.init(
    {
      game1: DataTypes.INTEGER,
      game2: DataTypes.INTEGER,
      game3: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "score",
    }
  );
  return score;
};
