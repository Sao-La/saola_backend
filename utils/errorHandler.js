'use strict';

const { SLError, errorCodes } = require("./error");
const { statusCode } = require("./statusCodes");

/**
 * Handles callback and responds errors if any
 * @param {Callback} handler 
 * @returns 
 */

exports.errorHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    }
    catch (err) {
      console.error(`============\nERRORRRR: ${err.code} - ${err.msg}\n============`);
      let errData = {}
      try {
        JSON.stringify(err.data);
        errData = err.data;
      }
      catch (e) {
        // Do nothing
      }
      if (err instanceof SLError) {
        return res.status(statusCode.bad_request).json({
          code: err.code,
          msg: err.msg,
          data: errData
        })
      }
      else {
        const error = new SLError(errorCodes.server_error)
        return res.status(statusCode.internal_error).json({
          code: error.code,
          msg: error.msg,
          data: errData,
        })
      }
    }
  }
}