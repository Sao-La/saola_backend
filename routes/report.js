'use strict'

const express = require("express");
const { validationResult, body } = require("express-validator");
const { getUserReports, getAllReports, uploadReportImg, createReport, getImgExtraction, singleUpload } = require("../controllers/report");
const { SLError, errorCodes } = require("../utils/error");
const { statusCode } = require("../utils/statusCode");

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */

exports.getUserReports = async (req, res) => {
  const data = await getUserReports(req.user);
  return res.status(statusCode.success).json({
    msg: "Get report list successfully",
    code: 0,
    data,
  })
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */

exports.getAllReports = async (req, res) => {
  // Authentication, change later (TODO)
  const { password } = req.query;
  if (!password || password !== process.env.ADMIN_PASSWORD)
    throw new SLError(errorCodes.not_authorized);

  const data = await getAllReports();
  return res.status(statusCode.success).json({
    msg: "Get report list successfully",
    code: 0,
    data,
  })
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */

exports.uploadReportImg = async (req, res, next) => {
  try {
    await singleUpload(req, res, next);
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.upload_bucket_error, err);
  }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */

exports.createReport = async (req, res) => {
  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    const errors = validate.array({ onlyFirstError: true });
    throw new SLError(errorCodes.invalid_form_data, errors);
  }

  if (!req.file)
    throw new SLError(errorCodes.invalid_form_data, {
      msg: "is required",
      file: "img",
      location: "request",
    });

  const data = await createReport(req.user, { ...req.body, img: req.file.location });
  return res.status(statusCode.success).json({
    msg: "Create report successfully",
    code: 0,
    data,
  })
}

exports.createReport.validate = [
  body('desc')
  .exists()
  .withMessage('is required')

  .trim()
  .notEmpty()
  .withMessage('cannot be blank'),

  body('location')
  .exists()
  .withMessage('is required')

  .custom(value => {
    return Array.isArray(value) && value.length === 2;
  })
  .withMessage('must be array with 2 elements'),
]
