'use strict';

const { body, validationResult } = require("express-validator");
const { signIn, updateUser } = require("../controllers/user");
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
  .withMessage('is invalid'),
]

exports.getUserInfo = (req, res) => {
  return res.status(statusCode.success).json({
    msg: "Get user information successfully",
    code: 0,
    data: {
      user: req.user,
    }
  })
}