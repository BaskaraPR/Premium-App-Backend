"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey:"userID", as:"userTransaksi"
      })
      this.belongsTo(models.aplikasi, {
        foreignKey:"aplikasiID", as:"aplikasiTransaksi"
      })
    }
  }
  transaksi.init(
    {
      transaksiID: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      tgl: DataTypes.DATE,
      id_user: DataTypes.INTEGER,
      id_aplikasi: DataTypes.INTEGER,
      status: DataTypes.ENUM("sudah", "belum"),
    },
    {
      sequelize,
      modelName: "transaksi",
    }
  );
  return transaksi;
};
