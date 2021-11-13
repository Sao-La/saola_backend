'use strict';

const { SLError, errorCodes } = require("../utils/error")

exports.isGuest = (req, res, next) => {
  if (req.user)
    throw new SLError(errorCodes.sign_in_already);
  next();
}