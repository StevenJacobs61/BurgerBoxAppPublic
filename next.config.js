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
    async headers() {
      return [
        {
          source: '/',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: 'default-src *',
            },
          ],
        },
      ];
    },
  },
  {
    reactStrictMode: true,
    swcMinify: true,
  },
]);




