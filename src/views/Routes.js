import React from 'react';
import {Route} from 'react-router-dom';
import NotFound from './NotFound';
import BrowserDetect from 'Components/BrowserDetect';
import Authorize from 'Containers/Authorize';
import Workspace from 'Containers/Workspace';
// testing - remove in production
import TestRoutes from './Test';

const View = () => (
  <BrowserDetect>
    <Authorize>
      <Route exact path="/" component={Workspace} />
      <TestRoutes />
      <Route component={NotFound} />
    </Authorize>
  </BrowserDetect>
);

export default View;
