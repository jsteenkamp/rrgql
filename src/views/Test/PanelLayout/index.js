import React from 'react';
import Panel from 'Components/Panel';

class Layout extends React.PureComponent {
  state = {
    direction: 'column',
  };

  onToggle = () =>
    this.setState(({direction}) => ({direction: direction === 'column' ? 'row' : 'column'}));

  render() {
    //const width = this.state.direction === 'column' ? '100%' : 800;
    //const height = this.state.direction === 'column' ? 800 : '100%';

    const panels = [
      {color: 'lightgreen', size: 500},
      {color: 'lightyellow', size: 250},
      {color: 'lightcyan', size: 380},
      {color: 'lightblue', size: 230},
    ].map(({color, size}, idx) => (
      <Panel key={idx} background={color} size={size} flex={'none'}>
        Panel {idx} ({this.state.direction})
      </Panel>
    ));

    return (
      <Panel
        direction={this.state.direction}
        onClick={this.onToggle}
        overflowY={'auto'}
        overflowX={'auto'}>
        {panels}
      </Panel>
    );
  }
}

export default Layout;
