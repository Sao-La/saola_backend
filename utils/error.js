'use strict';

const errorCodes = {
  // 1xxx: DB error
  create_user_error: 1000,
  read_user_error: 1001,
  update_user_error: 1002,
  delete_user_error: 1003,

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
}

const errorMap = {};
errorMap[errorCodes.create_user_error] = "Error occured while creating user";
errorMap[errorCodes.read_user_error] = "Error occured while reading user";
errorMap[errorCodes.update_user_error] = "Error occured while updating user";
errorMap[errorCodes.delete_user_error] = "Error occured while deleting user";

errorMap[errorCodes.invalid_auth_token] = "Invalid authentication token";
errorMap[errorCodes.sign_in_already] = "User already signed in";
errorMap[errorCodes.not_signed_in] = "User haven't signed in yet";
errorMap[errorCodes.invalid_auth_token] = "Invalid request data";

errorMap[errorCodes.user_existed] = "User with same information already existed";
errorMap[errorCodes.user_not_found] = "Cannot find user";
errorMap[errorCodes.login_failed] = "Email or password is incorrect";
errorMap[errorCodes.invalid_jwt_token] = "Invalid session";

errorMap[errorCodes.server_error] = "Server encountered an undefined error";


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