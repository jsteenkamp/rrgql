import express from 'express';
import expressJwt from 'express-jwt';
import auth from './auth';
import grid from './grid';
import proxy from './proxy';

const app = express();

export default function(config) {
  // use mount path to configure API
  app.on('mount', () => {
    // Note: you can use app.mountpath to configure - remove double path delimiter with .replace(/\/+/g, '/')
    const apiVersionPath = `${app.mountpath}/${config.api.version}`;

    // jwt protects api - allow signin api access without token
    const authPathRegex = new RegExp(`${apiVersionPath}/auth/*`);
    // allow access without auth for testing
    const proxyPathRegex = new RegExp(`${apiVersionPath}/proxy/*`);

    // paths excluded from authorization
    app.use(apiVersionPath, expressJwt({secret: config.jwt.secret})
      .unless({
        path: [
          authPathRegex,
          proxyPathRegex
        ]
      })
    );

    // throw error for unauthorized paths otherwise pass through (or nothing will be rendered)
    app.use((err, req, res, next) => {
      if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid Token...');
      } else {
        next();
      }
    });

    // app APIs must start with '/' and are appended to the mount path
    app.use(`/${config.api.version}/auth`, auth);
    app.use(`/${config.api.version}/grid`, grid);
    app.use(`/${config.api.version}/proxy`, proxy);

    console.info('API is available at %s', apiVersionPath);
  });

  return app;
}
