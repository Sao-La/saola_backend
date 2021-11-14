'use strict';

const { initializeProvinces } = require("../controllers/province");
const { initContentExractor } = require("../controllers/report");

const initialize = async () => {
  // Any handlers that runs on app create goes here
  await initializeProvinces();
  initContentExractor();
  // TODO: create child process

  console.log('Done initializing stuffs');
}

module.exports = initialize;