import React from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from 'styled-components';
import theme from '../../styles';
import addView from '../api/addView';

// import your renderer here and add them to the renderers object
import plugin from 'Components/PlugIn';

// simple renderers can just import the required component
import Table from 'Components/Table';

// renderer lookup object - add you renderer here (prefer key lowercase)
const renderers = {
  plugin,
  table: params => <Table {...params} />,
};



// elem = null renders inside React tree, otherwise portal outside app
const render = ({elem, type, ...rest}) => {
  // render to main app tree
  if (elem === 'view') {
    const {item, selection} = rest.data;
    const {view} = item.params;
    return addView({
      name: view.name,
      data: view.plugin,
      type: view.type,
      selection,
    });
  }

  // render to separate DOM node
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      {renderers[type](rest)}
    </ThemeProvider>,
    elem,
  );
};

export default render;
