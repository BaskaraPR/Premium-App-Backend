"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tier extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.aplikasi, {
        foreignKey: "tierID",
        as: "tierAplikasi",
      });
      this.hasMany(models.detail_transaksi, {
        foreignKey: "tierID",
        as: "detailAplikasi",
      });
    }
  }
  tier.init(
    {
      tierID: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      harga: DataTypes.STRING,
      nama: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "tier",
    }
  );
  return tier;
};
