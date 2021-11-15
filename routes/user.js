'use strict';

require('dotenv').config({ silent: true });
const { body, validationResult } = require("express-validator");
const { signIn, updateUser, getUserInfo, createUser } = require("../controllers/user");
const { SLError, errorCodes } = require("../utils/error");
const { statusCode } = require("../utils/statusCode");

exports.signIn = async (req, res) => {
  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    const errors = validate.array({ onlyFirstError: true });
    throw new SLError(errorCodes.invalid_form_data, errors);
  }
  
  const data = await signIn(req.body);
  return res.status(statusCode.success).json({
    msg: "Login successfully",
    code: 0,
    data,
  })
}

exports.signIn.validate = [
  body('email')
  .exists()
  .withMessage('is required')

  .isEmail()
  .withMessage('is invalid'),

  body('password')
  .exists()
  .trim()
  .notEmpty()
  .withMessage('is required')

  .isLength({ min: 8 })
  .withMessage('is at least 8 characters'),
]

exports.signup = async (req, res) => {
  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    const errors = validate.array({ onlyFirstError: true });
    throw new SLError(errorCodes.invalid_form_data, errors);
  }
  
  const data = await createUser(req.body);
  return res.status(statusCode.success).json({
    msg: "Create account successful",
    code: 0,
    data,
  })
}

exports.signup.validate = [
  body('email')
  .exists()
  .withMessage('is required')

  .isEmail()
  .withMessage('is invalid'),

  body('name')
  .trim()
  .notEmpty()
  .withMessage('is required'),

  body('password')
  .exists()
  .trim()
  .notEmpty()
  .withMessage('is required')

  .isLength({ min: 8 })
  .withMessage('is at least 8 characters'),
]

exports.updateUser = async (req, res) => {
  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    const errors = validate.array({ onlyFirstError: true });
    throw new SLError(errorCodes.invalid_form_data, errors);
  }

  const data = await updateUser(req.body);
  return res.status(statusCode.success).json({
    msg: "Update information successfully",
    code: 0,
    data,
  })
}

exports.updateUser.validate = [
  body('password')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('cannot be blank')

  .isLength({ min: 8 })
  .withMessage('is at least 8 characters'),

  body('avt')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('cannot be blank')

  .isURL()
  .withMessage('is invalid url'),
]

exports.getUserInfo = async (req, res) => {
  const data = await getUserInfo(req.user);
  return res.status(statusCode.success).json({
    msg: "Get user information successfully",
    code: 0,
    data,
  })
}

exports.adminCreateUser = async (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD)
    throw new SLError(errorCodes.not_authorized);

  const data = await createUser(req.body);
  return res.status(statusCode.success).json({
    msg: "Created user successfully",
    code: 0,
    data,
  })
}