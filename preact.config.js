/* eslint-disable no-param-reassign */
import path from 'path';
import envVars from 'preact-cli-plugin-env-vars';

export default (config, env, helpers) => {
  config.resolve.alias.Components = path.resolve(__dirname, 'src/components');
  config.resolve.alias.Cards = path.resolve(__dirname, 'src/routes/habitat/components/CardTabs/cards');
  config.resolve.alias.Assets = path.resolve(__dirname, 'src/assets');
  config.resolve.alias.Shared = path.resolve(__dirname, 'src/shared');
  envVars(config, env, helpers);

  if (env.production && !env.isServer) {
    config.entry['public-bundle'] = path.resolve(__dirname, 'public-page.entry.js');
    config.entry.bundle = path.resolve(__dirname, 'app.entry.js');
    // using this to prevent 'entry.js' from assigning a service worker
    // we want it assigned from 'app.entry.js'
    env.sw = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const { plugin: { options } } of helpers.getPluginsByName(config, 'HtmlWebpackPlugin')) {
      if (options.url === '/account') {
        options.chunks = ['bundle', 'polyfills'];
        options.template = `!!ejs-loader?esModule=false!${path.resolve(__dirname, './src/app-template.ejs')}`;
      } else {
        options.chunks = ['public-bundle', 'polyfills'];
        options.template = `!!ejs-loader?esModule=false!${path.resolve(__dirname, './src/public-template.ejs')}`;
      }
    }
  }

  const { plugin: htmlPlugin } = helpers.getPluginsByName(config, 'HtmlWebpackPlugin')[0] || {};
  const { PREACT_APP_SEGMENT_ID: segmentId } = process.env;

  if (htmlPlugin) {
    htmlPlugin.options.segmentId = segmentId;
  }

  if (config.devServer) {
    config.devServer.proxy = [{
      path: '/assets/**',
      secure: false,
      changeOrigin: true,
      target: 'https://zoolife.brizi.tech/',
    }];
  }
};
