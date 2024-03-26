const { Op } = require("sequelize");
const { ResponseData } = require("../helpers/ResponseHelper");
const {
  tier: tierModel,
  detail_transaksi: detailTransaksiModel,
  transaksi: transaksiModel,
} = require("../db/models/index");

exports.getAllTier = async (request, response) => {
  try {
    let tiers = await tierModel.findAll({
      order: [["createdAt", "DESC"]],
    });

    return response
      .status(200)
      .send(
        ResponseData(true, "Sukses mengambil seluruh data tier", null, tiers),
      );
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .send(ResponseData(false, error.message, error, null));
  }
};

exports.findTier = async (request, response) => {
  try {
    const keyword = request.body.keyword;
    const tiers = await tierModel.findAll({
      where: {
        [Op.or]: [
          { nama: { [Op.substring]: keyword } },
          { harga: { [Op.substring]: keyword } },
        ],
      },
    });

    if (!tiers.length) {
      return response
        .status(404)
        .send(ResponseData(true, "Tier data tidak ditemukan", null, null));
    }

    return response
      .status(200)
      .send(ResponseData(true, "Sukses mendapatkan data tier", null, tiers));
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .send(ResponseData(false, error.message, error, null));
  }
};

exports.addTier = async (request, response) => {
  try {
    let newTier = {
      harga: request.body.harga,
      nama: request.body.nama,
    };

    await tierModel.create(newTier);

    return response
      .status(201)
      .send(ResponseData(true, "Sukses membuat data tier", null, newTier));
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .send(ResponseData(false, error.message, error, null));
  }
};

exports.updateTier = async (request, response) => {
  try {
    let tierID = request.params.id;
    let newTier = {
      nama: request.body.nama,
      harga: request.body.harga,
    };
    const findTier = await tierModel.findOne({ where: { tierID: tierID } });

    if (!findTier) {
      return response
        .status(404)
        .send(ResponseData(true, "Tier data tidak ditemukan", null, null));
    }

    const existingName = await tierModel.findOne({
      where: { nama: newTier.nama },
    });

    if (existingName) {
      return response
        .status(400)
        .send(
          ResponseData(false, "Bad Request", ["Nama Sudah Digunakan"], null),
        );
    }

    const existingDetailTransaksi = await detailTransaksiModel.findAll({
      where: { tierID: tierID },
      include: {
        model: transaksiModel,
        as: "detailTransaksi",
      },
    });
    await tierModel.update(newTier, { where: { tierID: tierID } });

    for (let i = 0; i < existingDetailTransaksi.length; i++) {
      const status = existingDetailTransaksi[i].detailTransaksi.status;
      const existingDetail = existingDetailTransaksi[i];
      const updatedTotalHarga = existingDetail.durasi * newTier.harga;

      if (status === "draft") {
        await detailTransaksiModel.update(
          { harga: newTier.harga, total_harga: updatedTotalHarga },
          { where: { detail_transaksiID: existingDetail.detail_transaksiID } },
        );
      }
    }

    return response
      .status(201)
      .send(ResponseData(true, "Sukses update data tier", null, newTier));
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .send(ResponseData(false, error.message, error, null));
  }
};

exports.deleteTier = async (request, response) => {
  try {
    let tierID = request.params.id;

    const result = await tierModel.destroy({ where: { tierID: tierID } });

    if (!result) {
      return response
        .status(404)
        .send(ResponseData(false, "Tier tidak ditemukan", null, null));
    }

    return response
      .status(201)
      .send(ResponseData(true, "Sukses menghapus data tier", null, null));
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .send(ResponseData(false, error.message, error, null));
  }
};
