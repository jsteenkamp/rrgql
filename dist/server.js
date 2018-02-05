// NOTE: run with node --require babel-register
import path from 'path';
import compress from 'compression';
import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import api from './server/api';
import gql from './server/gql';

// config is loaded based on node ENV (from /config via config package)
const port = process.env.PORT || config.get('express.port');
const app = express();

// server middleware
app.use(compress());
// json parsing for APIs
app.use(bodyParser.json());
// assumes you are copying build assets to public - if not you must copy and serve public directory
app.use(express.static(path.join(__dirname, 'public')));
// so we do not have to copy build to public (see public above)
app.use(express.static(path.join(__dirname, 'build')));
// data api - mainly for mocking data
app.use(config.api.path, api(config));
// graphql endpoint
app.use(config.gql.path, gql(config));

// HTML5 mode endpoint route forwards unhandled requests to index.html
app.all('*', (req, res) => {
  res.sendFile('index.html', {root:  path.join(__dirname, 'build')}, (err) => {
    if (err) {
      console.error(err);
      res.status(err.status).end();
    }
  });
});

// start server
app.listen(port, () => {
  console.info('Server started at port %d', port);
});


