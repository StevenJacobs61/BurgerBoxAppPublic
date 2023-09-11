const compose = require('next-compose');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = compose([
  {
    webpack(config, options) {
      // Add MiniCssExtractPlugin loader with publicPath option
      config.module.rules.push({
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/build/', // Set the absolute path here
            },
          },
          'css-loader',
        ],
      });

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
