import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'Components/ErrorBoundary';

const Aux = props => props.children;

const MyMessageComponent = ({message = ''}) => {
  // deliberate JS error - getTimes()
  return [
    <p key={1}>I am correct: {message}</p>,
    <p key={2}>I throw an error: {message} @{new Date().getTime()}</p>,
    <Aux key={3}>
      <p>I am correct: {message}</p>
      <p>I throw an error: {message} @{new Date().getTimes()}</p>
    </Aux>,
  ];
};

MyMessageComponent.propTypes = {
  message: PropTypes.string,
};

const MyComponent = () => {
  return (
    <ErrorBoundary>
      <MyMessageComponent message={'Hello World'} />
    </ErrorBoundary>
  );
};

export default MyComponent;
