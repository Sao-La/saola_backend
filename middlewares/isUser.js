'use strict';

const { SLError, errorCodes } = require("../utils/error")

exports.isUser = (req, res, next) => {
  if (!req.user)
    throw new SLError(errorCodes.not_signed_in);
  next();
}