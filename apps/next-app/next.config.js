const withCSS = require('@zeit/next-css');

const { PHASE_PRODUCTION_BUILD } = require('next/constants');

module.exports = (phase, { defaultConfig = defaultConfig }) => {
  let config = {
    // add config stuffs here
  };

  if (phase !== PHASE_PRODUCTION_BUILD) {
    // add css, less, sass, and stylus loaders
    config = withCSS(config);
  }

  return config;
};
