'use strict';

require('dotenv').config({ silent: true });
const { User } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const { SLError, errorCodes } = require('../utils/error');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * 
 * @param {{uid: Number, idToken: Number}} authPayload 
 * @returns {} User info
 */

exports.userAuthGoogle = async (authPayload) => {
  const { uid, idToken } = authPayload;
  
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  if (uid !== ticket.getUserId())
    throw new SLError(errorCodes.invalid_auth_token);

  const payload = ticket.getPayload();
  const userPayload = {
    name: payload.name,
    email: payload.email,
    avt: payload.picture,
  }

  const user = await User.findOne({ where: { email: payload.email } });
  if (!user) {
    // Register
    const data = await createUser(userPayload);
    return data;
  }
  else {
    // Login
    return {
      user: userPayload,
      token: jwt.sign(
        userPayload,
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      )
    }
  }
}

/**
 * 
 * @param {{email: String, name: String, avt: String}} userPayload 
 * @returns {} Created user info
 */

exports.createUser = async (userPayload) => {
  const user = await User.findOne({ where: { email: userPayload.email } });
  if (user)
    throw new SLError(errorCodes.user_existed);

  try {
    const createdUser = await User.create(userPayload);
    return {
      user: createdUser,
    }
  }
  catch(err) {
    console.error(err);
    throw new SLError(errorCodes.create_user_error, err);
  }
}

/**
 * 
 * @param {String} s 
 * @returns Hashed string
 */

const hash = (s) => {
  // Adding super-duper-amazing-cryptagraphic-hash-ever later
  return s;
}

/**
 * 
 * @param {{email: String, password: String}} userPayload 
 * @returns {} User info
 */

exports.signIn = async(userPayload) => {
  const user = await User.findOne({ where: { email: userPayload.email }, raw: true });
  if (!user)
    throw new SLError(errorCodes.login_failed);

  if (user.password !== hash(userPayload.password))
    throw new SLError(errorCodes.login_failed);
  
  delete user.id;
  delete user.password;

  return {
    user,
    token: jwt.sign(
      user,
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    )
  }
}

exports.updateUser = async (userPayload) => {
  const { email } = userPayload;
  const payload = {
    avt: userPayload.avt,
    password: userPayload.password,
  }

  let user;
  try {
    user = await User.findOne({ where: { email } });
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.read_user_error, err);
  }

  if (!user)
    throw new SLError(errorCodes.user_not_found);

  try {
    const updatedUser = await User.update(payload, {
      where: { email },
      returning: true,
    });

    return {
      user: updatedUser[1][0],
    }
  }
  catch (err) {
    throw new SLError(errorCodes.update_user_error, err);
  }
}
