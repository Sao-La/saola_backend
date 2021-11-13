'use strict';

require('dotenv').config({ silent: true });
const jwt = require('jsonwebtoken');
const { SLError, errorCodes } = require('../utils/error');
const { User } = require('../models');

const userAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || token.length === 0)
    return next();
  
  let decoded = {};

  try {
    decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET);
  }
  catch (err) {
    console.error(err);
  }

  if (Date.now() < decoded.exp * 1000) {
    const { name, email } = decoded;
    if (name && email) {
      try {
        const user = await User.findOne({ where: { name, email } });
        if (!user) {
          throw new SLError(errorCodes.invalid_jwt_token);
        }

        req.user = user;
      }
      catch (err) {
        console.error(err);
        throw new SLError(errorCodes.read_user_error);
      }
    }
  }

  next();
}

module.exports = userAuth;