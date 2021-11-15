'use strict';

require('dotenv').config({ silent: true });
const { User, UserStat, AnimalStat } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const { SLError, errorCodes } = require('../utils/error');
const jwt = require('jsonwebtoken');

exports.getUserInfo = async (user) => {
  try {
    user = await User.findOne({ where: { email: user.email } });
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.read_user_error, err);
  }

  try {
    user.userStat = await UserStat.findOne({ where: { user: user.id } });
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.read_user_error, err);
  }

  try {
    user.animalStats = await Promise.all(user.animalStats.map(animal => new Promise(async resolve => {
      animal = await AnimalStat.findOne({ where: { id: animal } });
      return resolve(animal);
    })));
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.read_user_error, err);
  }

  delete user.password;

  return {
    user
  }
}

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
    const data = await this.createUser(userPayload);
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
 * @param {{email: String, name: String, avt: String, password:String}} userPayload 
 * @returns {} Created user info
 */

exports.createUser = async (userPayload) => {
  const user = await User.findOne({ where: { email: userPayload.email } });
  if (user)
    throw new SLError(errorCodes.user_existed);

  let createdUser;

  try {
    createdUser = await User.create(userPayload);
  }
  catch(err) {
    console.error(err);
    throw new SLError(errorCodes.create_user_error, err);
  }

  let createdUserStat;

  try {
    createdUserStat = await UserStat.create({
      username: userPayload.email.split('@')[0],
      user: createdUser.id,
    });
  }
  catch(err) {
    console.error(err);
    throw new SLError(errorCodes.create_user_error, err);
  }

  try {
    createdUser = await User.update({
      userStat: createdUserStat.id,
    }, {
      where: { id: createdUser.id },
      raw: true,
      returning: true,
    });
  }
  catch(err) {
    console.error(err);
    throw new SLError(errorCodes.create_user_error, err);
  }

  return {
    user: createdUser[1][0],
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
  let user = await User.findOne({ where: { email: userPayload.email }, raw: true });
  if (!user)
    throw new SLError(errorCodes.login_failed);

  if (user.password !== hash(userPayload.password))
    throw new SLError(errorCodes.login_failed);
  
  user = (await this.getUserInfo(user)).user;

  return {
    user,
    token: jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
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
