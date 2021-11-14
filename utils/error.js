'use strict';

const errorCodes = {
  // 1xxx: DB error
  create_user_error: 1000,
  read_user_error: 1001,
  update_user_error: 1002,
  delete_user_error: 1003,
  create_report_error: 1004,
  read_report_error: 1005,
  update_report_error: 1006,
  delete_report_error: 1007,
  create_province_error: 1008,
  read_province_error: 1009,
  update_province_error: 1010,
  delete_province_error: 1011,

  // 2xxx: User input error
  invalid_auth_token: 2000,
  sign_in_already: 2001,
  not_signed_in: 2002,
  invalid_form_data: 2003,

  // 3xxx: Data error
  user_existed: 3000,
  user_not_found: 3001,
  login_failed: 3002,
  invalid_jwt_token: 3003,

  //4xxx: Others
  server_error: 4000,
  upload_bucket_error: 4001,
  not_authorized: 4002,
  extractor_error:4003,
}

const errorMap = {};
errorMap[errorCodes.create_user_error] = "Error occured while creating user";
errorMap[errorCodes.read_user_error] = "Error occured while reading user";
errorMap[errorCodes.update_user_error] = "Error occured while updating user";
errorMap[errorCodes.delete_user_error] = "Error occured while deleting user";
errorMap[errorCodes.create_report_error] = "Error occured while creating report";
errorMap[errorCodes.read_report_error] = "Error occured while reading report";
errorMap[errorCodes.update_report_error] = "Error occured while updating report";
errorMap[errorCodes.delete_report_error] = "Error occured while deleting report";
errorMap[errorCodes.create_report_error] = "Error occured while creating province";
errorMap[errorCodes.read_province_error] = "Error occured while reading province";
errorMap[errorCodes.update_province_error] = "Error occured while updating province";
errorMap[errorCodes.delete_province_error] = "Error occured while deleting province";

errorMap[errorCodes.invalid_auth_token] = "Invalid authentication token";
errorMap[errorCodes.sign_in_already] = "User already signed in";
errorMap[errorCodes.not_signed_in] = "User haven't signed in yet";
errorMap[errorCodes.invalid_form_data] = "Invalid request data";

errorMap[errorCodes.user_existed] = "User with same information already existed";
errorMap[errorCodes.user_not_found] = "Cannot find user";
errorMap[errorCodes.login_failed] = "Email or password is incorrect";
errorMap[errorCodes.invalid_jwt_token] = "Invalid session";

errorMap[errorCodes.server_error] = "Server encountered an undefined error";
errorMap[errorCodes.upload_bucket_error] = "Error while uploading image";
errorMap[errorCodes.not_authorized] = "User is not allowed to use this method";
errorMap[errorCodes.extractor_error] = "Error while extracting content in image";


class SLError extends Error {
  constructor(errorCode, data = {}) {
    super(errorMap[errorCode]);
    this.code = errorCode;
    this.msg = errorMap[errorCode];
    this.data = data;
  }
}

module.exports = {
  errorCodes,
  errorMap,
  SLError,
}