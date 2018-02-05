import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: ${props => (props.background !== '' ? props.background : props.theme.overlay.backgroundColor)};
  z-index: 1000;
  & > .react-draggable {
    cursor: grab;
  }
  & > .react-draggable-dragging {
    cursor: grabbing;
  }
`;

class Overlay extends React.Component {
  close = event => {
    // Note: key value not consistent across browsers so use keyCode
    if (this.props.show) {
      if (this.props.anyKey || (this.props.escKey && event.keyCode === 27)) {
        event.stopPropagation();
        this.props.onClose();
      }
    }
  };

  onClickOutside = event => {
    if (this.props.clickOutside) {
      event.stopPropagation();
      if (event.target === event.currentTarget) this.props.onClose();
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.close);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.close);
  }

  render() {
    const {show, background} = this.props;
    return show
      ? ReactDOM.createPortal(
          <Wrapper onClick={this.onClickOutside} background={background}>
            {this.props.children}
          </Wrapper>,
          document.getElementById('portal')
        )
      : null;
  }
}

Overlay.propTypes = {
  show: PropTypes.bool,
  anyKey: PropTypes.bool,
  escKey: PropTypes.bool,
  clickOutside: PropTypes.bool,
  onClose: PropTypes.func,
  background: PropTypes.string,
  children: PropTypes.element,
};

Overlay.defaultProps = {
  show: false,
  anyKey: false,
  escKey: true,
  clickOutside: true,
  onClose: () => {},
  background: '',
  children: null,
};

export default Overlay;
