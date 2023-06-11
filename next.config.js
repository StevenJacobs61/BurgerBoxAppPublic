/** @type {import('next').NextConfig} */

const compose = require('next-compose');

module.exports = compose([
  {
    webpack(config, options) {
      config.module.rules.push({
        test: /\.mp3$/,
        use: {
          loader: 'file-loader',
        },
      });
      return config;
    },
  },
  {
    reactStrictMode: true,
    swcMinify: true,
  },
]);



