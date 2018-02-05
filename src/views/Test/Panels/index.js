import React from 'react';
import _times from 'lodash/fp/times';
import uuid from 'uuid';
import Panel, {PanelGroup} from 'Components/Panel';
import Header from 'Components/Header';

const Items = ({total = 100}) => {
  const id = uuid.v4();
  return (
    <ul>
      {_times(idx => <li key={`${id}-${idx}`}>{idx}</li>, total)}
    </ul>
  );
};

class View extends React.Component {
  state = {
    showPanel: [true, true],
  };

  panels = [];

  togglePanel = panel => {
    this.setState(state => ({
      showPanel: state.showPanel.map((p, idx) => (idx === panel ? !p : p)),
    }));
  };

  setPanelSizes = panels => {
    const panelSizes = panels.map(panel => {
      const {width, height} = panel.getBoundingClientRect();
      return `${width} x ${height}`;
    });
    console.info(panelSizes);
  };

  componentDidMount() {}

  render() {
    return (
      <Panel>
        <Header>
          <button onClick={() => this.togglePanel(0)}>Right</button>
          <button onClick={() => this.togglePanel(1)}>Bottom</button>
        </Header>
        <PanelGroup direction={'column'}>
          <PanelGroup>
            <Panel>
              <Items />
            </Panel>
            <Panel show={this.state.showPanel[0]}>
              <PanelGroup direction={'column'} onResize={panels => this.setPanelSizes(panels)}>
                <Panel height={'50%'} />
                <Panel />
                <Panel />
              </PanelGroup>
            </Panel>
          </PanelGroup>
          <Panel height={150} show={this.state.showPanel[1]} background={'#f2f2f2'}>
            <Items />
          </Panel>
        </PanelGroup>
      </Panel>
    );
  }
}

export default View;
