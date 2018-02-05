import React from 'react';
import styled from 'styled-components';
import Workspace from 'Components/Workspace';

const Box = styled.div`
  width: 120px;
  height: 120px;
  margin: 15px;
  border: 2px solid lightcoral;
  background: papayawhip;
`;

class View extends React.Component {
  state = {
    direction: 'horizontal',
  };

  toggleDirection = () =>
    this.setState(({direction}) => ({
      direction: direction === 'horizontal' ? 'vertical' : 'horizontal',
    }));

  render() {
    // panel defines the panel content, background color, initial visibility, use null for no panel
    const panels = [
      {
        panel: <Box>1. Top</Box>,
        size: '10%',
        background: 'lightgreen',
        show: true,
        overflow: 'hidden',
      },
      {
        panel: <Box>2. Right</Box>,
        size: '10%',
        background: 'lightblue',
        show: true,
        overflow: 'x',
      },
      {
        panel: <Box>3. Bottom</Box>,
        size: '10%',
        background: 'lightblue',
        show: true,
        overflow: 'y',
        resize: true,
      },
      {panel: <Box>4. Left</Box>, background: 'lightgreen', show: true, resize: true},
    ];

    return (
      <Workspace
        direction={this.state.direction}
        panels={panels}
        background={'lightyellow'}
        overflow={'auto'}>
        {({togglePanel, showPanels, getWorkspaceRef, getPanelRefs}) => {
          return (
            <ul>
              <li>
                <button onClick={this.toggleDirection}>Layout: {this.state.direction}</button>
              </li>
              <li><button onClick={() => togglePanel(0)}>Top</button></li>
              <li><button onClick={() => togglePanel(1)}>Right</button></li>
              <li><button onClick={() => togglePanel(2)}>Bottom</button></li>
              <li><button onClick={() => togglePanel(3)}>Left</button></li>
              <li>
                <button onClick={() => showPanels([true, true, true, null])}>All (1, 2, 3)</button>
              </li>
              <li>
                <button onClick={() => showPanels([false, false, false, null])}>
                  None (1, 2, 3)
                </button>
              </li>
              <li>
                <button onClick={() => console.info('getWorkspace', getWorkspaceRef())}>
                  getWorkspaceRef
                </button>
              </li>
              <li>
                <button onClick={() => console.info('getPanelRefs', getPanelRefs())}>
                  getPanelRefs
                </button>
              </li>
            </ul>
          );
        }}
      </Workspace>
    );
  }
}

export default View;
