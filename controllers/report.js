'use strict';

require('dotenv').config({ silent: true });
const express = require('express');
const { Report } = require('../models');
const { SLError, errorCodes } = require('../utils/error');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const axios = require('axios');
const child_process = require('child_process');
const fs = require('fs');

/**
 * 
 * @returns {Object[]} Array of reports
 */

exports.getAllReports = async () => {
  try {
    const reports = await Report.findAll();
    return {
      reports,
    }
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.read_report_error, err);
  }
}

/**
 * 
 * @param {Object} user 
 * @returns {Object[]} Array of reports
 */

exports.getUserReports = async (user) => {
  try {
    const reports = await Report.findAll({ user: user.id });
    return {
      reports,
    }
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.read_report_error, err);
  }
}

aws.config.update({
  // Your SECRET ACCESS KEY from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
  secretAccessKey: process.env.AWS_SECRET_KEY,
  // Not working key, Your ACCESS KEY ID from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.BUCKET_REGION // region of your bucket
});

const s3 = new aws.S3();

const getExt = (mimetype) => {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

  switch (mimetype) {
    case 'image/bmp': {
      return 'bmp';
    }
    case 'image/gif': {
      return 'gif';
    }
    case 'image/vnd.microsoft.icon': {
      return 'ico';
    }
    case 'image/jpeg': {
      return 'jpg';
    }
    case 'image/png': {
      return 'png';
    }
    case 'image/svg+xml': {
      return 'svg';
    }
    case 'image/tiff': {
      return 'tiff';
    }
    case 'image/webp': {
      return 'webp';
    }
  }
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      const fileName = `saola/${Date.now().toString()}-${file.originalname}`;
      cb(null, fileName);
    }
  })
});

exports.singleUpload = upload.single('img');

const instance = axios.create({
  baseUrl: process.env.EXTRACTOR_ADDRESS,
  timeout: 5000,
});

/**
 * 
 * @param {String} img Image url
 * @returns {Object} Content extracted
 */

exports.getImgExtraction = async (img) => {
  const content = await instance.get('/?url=' + img);
  return {
    img,
    content,
  }
}

/**
 * 
 * @param {Object} user 
 * @param {Object} reportPayload 
 * @returns {Object} Created report
 */

exports.createReport = async (user, reportPayload) => {
  let createdReport;
  try {
    createdReport = await Report.create({
      user: user.id,
      desc: reportPayload.desc,
      location: reportPayload.location,
      img: reportPayload.img,
    });
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.create_report_error, err);
  }

  this.sendExtractQuery(createdReport.id, reportPayload.img);

  // TODO: Update heat map counter

  return {
    report: createdReport,
  }
}

exports.extractor = null;

exports.initContentExtractor = () => {
  this.extractor = child_process.spawn('conda', ['run', '--no-capture-output', '-n', 'saola', 'python3', './extract_info.py'], {
    cwd: '/home/ubuntu/saola_AI',
  });

  this.extractor.stdout.on('data', (data) => handleExtractorMessage(data));
  this.extractor.stderr.on('data', (data) => {
    console.log(`===ERROR===\n${data}\n=======`);
  });
  this.extractor.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

exports.sendExtractQuery = async (report, url) => {
  if (!this.extractor)
    throw new SLError(errorCodes.extractor_error);
  await fs.writeFileSync('/home/ubuntu/saola_AI/input', report + " " + url);
}

const handleExtractorMessage = async (data) => {
  data = JSON.parse(data.toString().trim().replace(/'/g, '"'));
  console.log(`Received content of report ${data.report} as: ${JSON.stringify(data.content)}`);
  try {
    await Report.update({
      content: JSON.stringify(data.content),
    }, {
      where: { id: parseInt(data.report) },
    });
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.update_report_error, err);
  }
}
