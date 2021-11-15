'use strict';

require('dotenv').config({ silent: true });
const express = require('express');
const { getUserReports, createReport, getAllReports, uploadReportImg } = require('./report');
const { isGuest } = require('../middlewares/isGuest');
const { isUser } = require('../middlewares/isUser');
const userAuth = require('../middlewares/userAuth');
const { errorHandler } = require('../utils/errorHandler');
const { signIn, updateUser, getUserInfo, adminCreateUser, signup } = require('./user');
const { getProvinces, updateProvinces } = require('./province');
const cors = require('cors');

const router = express.Router();

// Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(errorHandler(userAuth));
router.use(cors({ origin: process.env.FRONTEND_ADDRESS }))

// Routes

router.get('/', (req, res) => res.status(200).send('Hi there :D'));

router.post('/signin', 
  errorHandler(isGuest),
  signIn.validate,
  errorHandler(signIn),
)

router.post('/signup', 
  errorHandler(isGuest),
  signup.validate,
  errorHandler(signup),
)

router.get('/user', 
  errorHandler(isUser),
  errorHandler(getUserInfo),
)

router.put('/user', 
  errorHandler(isUser),
  updateUser.validate,
  errorHandler(updateUser),
)

router.post('/admin/user',
  errorHandler(adminCreateUser),
)

router.get('/report',
  errorHandler(isUser),
  errorHandler(getUserReports),
)

router.post('/report',
  errorHandler(isUser),
  uploadReportImg,
  createReport.validate,
  errorHandler(createReport),
)

router.get('/admin/report',
  errorHandler(getAllReports),
)

router.get('/province',
  errorHandler(getProvinces),
)

router.put('/admin/province', 
  errorHandler(updateProvinces),
)

/**
 * 
 * @param {express.Express} app 
 */

module.exports = (app) => {
  app.use(router);
};
