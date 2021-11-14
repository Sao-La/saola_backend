'use strict';

require('dotenv').config({ silent: true });
const { getProvinces, updateProvinces } = require("../controllers/province");
const { SLError, errorCodes } = require('../utils/error');
const { statusCode } = require("../utils/statusCode");

exports.getProvinces = async (req, res) => {
  const data = await getProvinces();

  return res.status(statusCode.success).json({
    msg: "Get provinces data successfully",
    code: 0,
    data,
  })
}

exports.updateProvinces = async (req, res) => {
  const { password, provinces } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD)
    throw new SLError(errorCodes.not_authorized);

  const data = await updateProvinces(provinces || []);
  return res.status(statusCode.success).json({
    msg: "Update provinces data successfully",
    code: 0,
    data,
  })
}