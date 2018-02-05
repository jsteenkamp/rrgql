import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import _isFunction from 'lodash/isFunction';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.iFrame.backgroundColor};
  border-top: 1px solid ${props => props.theme.iFrame.borderColor};
  border-bottom: 1px solid ${props => props.theme.iFrame.borderColor};
`;

class IFrame extends React.Component {
  elem = null;

  // return element to access iframe via this.elem.contentWindow
  onFrameLoad = () => {
    const {onLoad} = this.props;
    if (_isFunction(onLoad)) onLoad(this.elem);
  };

  componentDidMount() {
    this.elem.addEventListener('load', this.onFrameLoad, false);
  }

  componentWillUnmount() {
    this.elem.removeEventListener('load', this.onFrameLoad, false);
  }

  render() {
    const {src} = this.props;
    return (
      <Wrapper>
        <iframe
          ref={ref => (this.elem = ref)}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          src={src}
        />
      </Wrapper>
    );
  }
}

IFrame.propTypes = {
  src: PropTypes.string,
  onLoad: PropTypes.func,
  params: PropTypes.object,
};

export default IFrame;
