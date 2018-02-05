// NOTE: run with node --require babel-register
import path from 'path';
import compress from 'compression';
import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack/webpack.dev.babel';
import api from './dist/server/api';
import gql from './dist/server/gql';
import {graphiqlExpress} from 'graphql-server-express';

// config is loaded based on node ENV (from /config via config package)
const port = process.env.PORT || config.get('express.port');
const app = express();
// webpack compiler
const compiler = webpack(webpackConfig);
// option: quiet = no logging
const middleware = webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
});
// webpackDevMiddleware uses memory-fs internally to store build artifacts
const fs = middleware.fileSystem;

app.use(middleware);
app.use(webpackHotMiddleware(compiler));

// server middleware
app.use(compress());
// json parsing for APIs
app.use(bodyParser.json());
// webpack is not copying public directory static assets for dev
app.use(express.static(path.join(__dirname, 'dist/public')));
// data api - mainly for mocking data
app.use(config.api.path, api(config));
// graphql endpoint
app.use(config.gql.path, gql(config));
// graphiql endpoint (serves graphiql client)
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: config.gql.path,
  })
);

// HTML5 mode endpoint route forwards unhandled requests to index.html
app.get('*', (req, res) => {
  const file = fs.readFileSync(path.join(compiler.outputPath, 'index.html'));
  res.send(file.toString());
});

// start server
app.listen(port, () => {
  console.info('Server started at port %d', port);
});
