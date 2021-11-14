'use strict';

const { initializeProvinces } = require("../controllers/province");
const { initContentExtractor } = require("../controllers/report");

const initialize = async () => {
  // Any handlers that runs on app create goes here
  await initializeProvinces();
  initContentExtractor();
  // TODO: create child process

  console.log('Done initializing stuffs');
}

module.exports = initialize;