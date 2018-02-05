import React from 'react';
import PropTypes from 'prop-types';

// self-eradicating component wrapper (no keys required)
const Aux = props => props.children;

// Prefer FaaC/RenderProp over HOC
const RenderProp = props => {
  const message = 'Hello World message via render prop';
  return <code>{props.children({message})}</code>;
};

RenderProp.propTypes = {
  children: PropTypes.func,
};

// React 16 adjacent JSX can be passed as array, no wrapping element
const Test = () => {
  return [
    <h1 key={1}>These nodes are just array entries and will be inlined:</h1>,
    'I am a string, and the next node is a number: ',
    123,
    <h1 key={2}>These nodes are rendered using an Self-Eradicating component:</h1>,
    <Aux key={3}>
      <p>Paragraph 1</p>
      <p>Paragraph 2</p>
      <p>Paragraph 3</p>
    </Aux>,
    <h1 key={4}>This is a render props (FaC)</h1>,
    <RenderProp key={5}>
      {({message}) => message}
    </RenderProp>
  ];
};

export default Test;