const path = require("path")
const withPlugins = require("next-compose-plugins");
const withCSS = require('@zeit/next-css');
const withTM = require('next-transpile-modules')(['@nx-workspace/utils']);

const { PHASE_PRODUCTION_BUILD } = require('next/constants');

module.exports = (phase, { defaultConfig = defaultConfig }) => {
  let config = {
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@nx-workspace/utils': path.resolve(__dirname, '../../libs/utils/src/index.ts')
      }
      return config
    }
    // add config stuffs here
  };

  if (phase !== PHASE_PRODUCTION_BUILD) {
    // add css, less, sass, and stylus loaders
    config = withPlugins([withCSS, withTM], config);
  }

  return config;
};
