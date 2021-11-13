'use strict';

const express = require('express');
const { isGuest } = require('../middlewares/isGuest');
const { isUser } = require('../middlewares/isUser');
const userAuth = require('../middlewares/userAuth');
const { errorHandler } = require('../utils/errorHandler');
const { signIn, updateUser, getUserInfo } = require('./user');

const router = express.Router();

// Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(errorHandler(userAuth));

// Routes

router.post('/signin', 
  [errorHandler(isGuest), signIn.validate],
  errorHandler(signIn),
)

router.get('/user', 
  [errorHandler(isUser)],
  errorHandler(getUserInfo),
)

router.put('/user', 
  [errorHandler(isUser), updateUser.validate],
  errorHandler(updateUser),
)

/**
 * 
 * @param {express.Express} app 
 */

module.exports = (app) => {
  app.use(router);
};