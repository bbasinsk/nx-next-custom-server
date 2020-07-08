const withCSS = require('@zeit/next-css');

const internalNodeModulesRegExp = /@nx-workspace(?!.*node_modules)/
const externalNodeModulesRegExp = /node_modules(?!\/@nx-workspace(?!.*node_modules))/;

const { PHASE_PRODUCTION_BUILD } = require('next/constants');

module.exports = (phase, { defaultConfig = defaultConfig }) => {
  let config = {
    webpack: (config, { defaultLoaders, dir }) => {
      config.resolve.symlinks = false;

      config.externals = config.externals && config.externals.map(external => {
        if (typeof external !== 'function') return external;
        return (ctx, req, cb) =>
          internalNodeModulesRegExp.test(req) ? cb() : external(ctx, req, cb);
      });

      config.module.rules.push({
        test: /\.+(js|jsx)$/,
        loader: defaultLoaders.babel,
        include: [internalNodeModulesRegExp]
      });

      config.module.rules = config.module.rules.map(
        r =>
          String(r.test) === String(/\.(ts|tsx)$/)
            ? {
              test: /\.(ts|tsx)$/,
              include: [dir, internalNodeModulesRegExp],
              exclude: externalNodeModulesRegExp,
              use: [
                defaultLoaders.babel,
                {
                  loader: "ts-loader",
                  options: Object.assign(
                    {},
                    {
                      transpileOnly: true
                    },
                    config.typescriptLoaderOptions
                  )
                }
              ]
            }
            : r
        );

      return config
    }
    // add config stuffs here
  };

  if (phase !== PHASE_PRODUCTION_BUILD) {
    // add css, less, sass, and stylus loaders
    config = withCSS(config);
  }

  return config;
};
