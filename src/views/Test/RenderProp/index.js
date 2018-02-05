import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  button {
    background: lightgreen;
    margin: 10px;
    padding: 5px;
  }
`;


class Foo extends React.Component {
  render() {
    // the variable name must be capitalized
    const Wrapper = this.props.wrapper;
    return <Wrapper><button>This works!</button></Wrapper>;
  }
}

const HelloWorld = () => (
  <div>
    <Foo wrapper={Wrapper} />
    <Foo wrapper="h5" />
  </div>
);

export default HelloWorld;