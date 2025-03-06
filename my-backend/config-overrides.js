// filepath: c:\Users\David\Desktop\uni\cuarto\SegundoCuatri\DSW\TrabajoLab\aplicacion\my-frontend\config-overrides.js
const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    util: require.resolve('util/'),
    zlib: require.resolve('browserify-zlib'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert/'),
    url: require.resolve('url/'),
    crypto: require.resolve('crypto-browserify'),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );
  return config;
};