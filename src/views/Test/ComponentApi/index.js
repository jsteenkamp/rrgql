import React from 'react';

const style = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  margin: '50px',
  width: '200px',
  height: '200px',
};

const TestPure = () => {
  const onClick = () => console.info('Pure clicked');

  return (
    <div
      style={{
        ...style,
        background: 'lightyellow',
      }}>
      <div>Test Component</div>
      <button onClick={onClick}>Click Me</button>
    </div>
  );
};

class Test extends React.Component {
  state = {
    clicked: false,
  };

  onClick = ({message = 'Clicked handled in component'}) => {
    this.setState(({clicked}) => ({clicked: !clicked}));
    this.logDetails({message});
  };

  logDetails = ({message}) => console.info(message);

  render() {
    return (
      <div
        style={{
          ...style,
          background: 'lightgreen',
        }}>
        <div>Test Component = {this.state.clicked ? 'ON' : 'OFF'}</div>
        <button onClick={this.onClick}>Click Me</button>
      </div>
    );
  }
}

class ComponentAPI extends React.Component {
  onClick = () => {
    this.myComponentRef.onClick({message: 'Clicked handled in parent component'});
    this.myComponentRef.logDetails({message: 'Message logged from parent component'});
  };

  render() {
    return (
      <div>
        <Test ref={ref => (this.myComponentRef = ref)} />
        <button onClick={this.onClick}>Click (Class)</button>

        <TestPure ref={ref => (this.myPureComponentRef = ref)} />
        <button onClick={() => this.myPureComponentRef.onClick()}>Click (Pure) will fail</button>
      </div>
    );
  }
}

export default ComponentAPI;
