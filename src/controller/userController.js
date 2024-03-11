const { user: userModel } = require(`../db/models/index`);
const { Op } = require(`sequelize`);
const { ResponseData } = require("../helpers/ResponseHelper");
const { PasswordHashing } = require("../helpers/PasswordHelper");

exports.getAllUser = async (request, response) => {
  try {
    let users = await userModel.findAll();
    return response
      .status(200)
      .send(
        ResponseData(true, "Sukses mengambil seluruh data user", null, users)
      );
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .send(ResponseData(false, error.message, error, null));
  }
};

exports.findUser = async (request, response) => {
  try {
    let keyword = request.body.key;
    let users = await userModel.findAll({
      where: {
        [Op.or]: [
          { userID: { [Op.substring]: keyword } },
          { username: { [Op.substring]: keyword } },
          { nama: { [Op.substring]: keyword } },
          { role: { [Op.substring]: keyword } },
        ],
      },
    });

    if (!users) {
      return response
        .status(404)
        .send(ResponseData(true, "User tidak ditemukan", null, null));
    }

    return response
      .status(200)
      .send(ResponseData(true, "Sukses mengambil user", null, users));
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .send(ResponseData(false, error.message, error, null));
  }
};

exports.addUser = async (request, response) => {
  try {
    const newUser = {
      username: request.body.username,
      nama: request.body.nama,
      password: await PasswordHashing(request.body.password),
      role: request.body.role,
    };

    await userModel.create(newUser);

    return response
      .status(201)
      .send(ResponseData(true, "Sukses membuat data user", null, newUser));
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .send(ResponseData(false, error.message, error, null));
  }
};

exports.updateUser = async (request, response) => {
  try {
    let userID = request.params.id;
    let newUser = {
      username: request.body.username,
      nama: request.body.nama,
      password: request.body.password,
      confirmPassword: request.body.password,
      role: request.body.role,
    };
    const existingUser = await userModel.findOne({
      where: { userID: userID },
    });
    if (!existingUser) {
      return response
        .status(404)
        .send(ResponseData(true, "User tidak ditemukan", null, null));
    }
    await userModel.update(newUser, { where: { userID: userID } });
    return response
      .status(201)
      .send(ResponseData(true, "Sukses update data user", null, newUser));
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .send(ResponseData(false, error.message, error, null));
  }
};

exports.deleteUser = async (request, response) => {
  try {
    let userID = request.params.id;
    const result = await userModel.destroy({ where: { userID: userID } });
    if (!result) {
      return response
        .status(404)
        .send(ResponseData(false, "User tidak ditemukan", null, null));
    }
    return response
      .status(201)
      .send(ResponseData(true, "Sukses menghapus data user", null, null));
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .send(ResponseData(false, error.message, error, null));
  }
};

exports.topUpSaldo = async (request, response) => {
  try {
    const userID = request.params.userID;
    const findUser = await userModel.findOne({ where: { userID: userID } });
    if (!findUser) {
      return response
        .status(404)
        .send(ResponseData(false, "User tidak ditemukan", null, null));
    }
    await userModel.update(
      { saldo: request.body.saldo },
      { where: { userID: userID } }
    );

    return response
      .status(201)
      .send(ResponseData(true, "Sukses menambahkan saldo user", null, null));
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .send(ResponseData(false, error.message, error, null));
  }
};
