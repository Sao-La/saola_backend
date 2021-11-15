'use strict';

require('dotenv').config({ silent: true });
const { initializeProvinces } = require("../controllers/province");
const { initContentExtractor } = require("../controllers/report");

const initialize = async () => {
  // Any handlers that runs on app create goes here
  await initializeProvinces();
  if (process.env.NODE_ENV === "production")
    initContentExtractor();
  // TODO: create child process

  console.log('Done initializing stuffs');
}

module.exports = initialize;