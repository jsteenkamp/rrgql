import React from 'react';
import {Route, Switch} from 'react-router-dom';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
// example of Viewport FaC
import Viewport from 'Components/Viewport';
// Test components
import GraphQL from './GraphQL';
import Icons from './Icons';
import Intl from './Intl';
import Layout from './Layout';
import Proxy from './Proxy';
import Worker from './Worker';
import Panels from './Panels';
import PanelLayout from './PanelLayout';
import Tabs from './Tabs';
import Accordion from './Accordion';
import TestModal from './Modal';
import Virtual from './Virtual';
import Tooltip from './Tooltip';
import ContextMenu from './ContextMenu';
import BrowserDetect from './BrowserDetect';
import MultiGrid from './MultiGrid';
import ScrollSync from './ScrollSync';
import RenderProp from './RenderProp';
import FP from './FP';
import API from './ComponentApi';
import D3 from './D3';
import StyledSystem from './StyledSystem';
import ReactTests from './ReactTests';
import ErrorBoundary from './ErrorBoundary';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  h1 {
   margin: 1em 0;
   font-size: 1.5em;
  }
  li { 
    margin: .25em 0;
  }
  a {
    color: royalblue;
    &:hover {
      color: blue;
    }
  }
`;

const Test = () => (
  <Viewport>
    {({width, height}) => (
      <Container>
        <h1>Viewport ({width} x {height})</h1>
        <ul>
          <li><Link to="/test/accordion">Accordion</Link></li>
          <li><Link to="/test/api">API Test Component</Link></li>
          <li><Link to="/test/bowser">Browser Detection</Link></li>
          <li><Link to="/test/context-menu">Context Menu</Link></li>
          <li><Link to="/test/d3">Test D3</Link></li>
          <li><Link to="/test/error-boundary">Component Error Boundary</Link></li>
          <li><Link to="/test/fp">Test FP</Link></li>
          <li><Link to="/test/gql">GraphQL Query</Link></li>
          <li><Link to="/test/icons">SVG Icons</Link></li>
          <li><Link to="/test/intl">Internationalization (i18n)</Link></li>
          <li><Link to="/test/layout">Workspace Layout</Link></li>
          <li><Link to="/test/panel-layout">Panel Layout</Link></li>
          <li><Link to="/test/modal">Modal</Link></li>
          <li><Link to="/test/multigrid">MultiGrid</Link></li>
          <li><Link to="/test/panels">Resizable Panels</Link></li>
          <li><Link to="/test/proxy">Proxy Request</Link></li>
          <li><Link to="/test/react-tests">React Tests</Link></li>
          <li><Link to="/test/renderprop">Render Prop</Link></li>
          <li><Link to="/test/scrollsync">ScrollSync</Link></li>
          <li><Link to="/test/styled-system">Styled System</Link></li>
          <li><Link to="/test/tabs">Tabs</Link></li>
          <li><Link to="/test/tooltip">Tooltip</Link></li>
          <li><Link to="/test/virtual">Virtual Scroll</Link></li>
          <li><Link to="/test/worker">Web Worker</Link></li>
        </ul>
      </Container>
    )}
  </Viewport>
);

export const Routes = () => (
  <Switch>
    <Route exact path="/test" component={Test} />
    <Route path="/test/accordion" component={Accordion} />
    <Route path="/test/api" component={API} />
    <Route path="/test/bowser" component={BrowserDetect} />
    <Route path="/test/context-menu" component={ContextMenu} />
    <Route path="/test/d3" component={D3} />
    <Route path="/test/error-boundary" component={ErrorBoundary} />
    <Route path="/test/fp" component={FP} />
    <Route
      path="/test/gql/:id"
      render={({match, location}) => (
        <GraphQL greeting="Apollo Client" match={match} location={location} />
      )}
    />
    <Route
      path="/test/gql"
      render={({match}) => (
        <GraphQL greeting="Apollo Client" match={match} />
      )}
    />
    <Route path="/test/icons" component={Icons} />
    <Route path="/test/intl" component={Intl} />
    <Route path="/test/layout" component={Layout} />
    <Route path="/test/panel-layout" component={PanelLayout} />
    <Route path="/test/modal" component={TestModal} />
    <Route path="/test/multigrid" component={MultiGrid} />
    <Route path="/test/panels" component={Panels} />
    <Route path="/test/proxy" component={Proxy} />
    <Route path="/test/react-tests" component={ReactTests} />
    <Route path="/test/renderprop" component={RenderProp} />
    <Route path="/test/scrollsync" component={ScrollSync} />
    <Route path="/test/styled-system" component={StyledSystem} />
    <Route path="/test/tabs" component={Tabs} />
    <Route path="/test/tooltip" component={Tooltip} />
    <Route path="/test/virtual" component={Virtual} />
    <Route path="/test/worker" component={Worker} />
  </Switch>
);

export default Routes;
