import React from 'react';
import PropTypes from 'prop-types';
import _throttle from 'lodash/throttle';

// viewport = window {width, height}
const getViewport = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

class Viewport extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  state = {
    viewport: getViewport(),
  };

  getWindowSize = _throttle(
    () => {
      this.setState(() => ({viewport: getViewport()}));
    },
    50,
  );

  componentDidMount() {
    window.addEventListener('resize', this.getWindowSize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getWindowSize, false);
  }

  render() {
    return this.props.children(this.state.viewport);
  }
}

export default Viewport;
