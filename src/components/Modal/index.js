import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import _isString from 'lodash/isString';
import Overlay from '../Overlay';
import {numberToPixels} from 'Utils/components';

const centerModal = value =>
  _isString(value) ? `${value} / 2` : numberToPixels(value / 2);

const DragWrapper = styled.div`
  position: absolute;
  width: ${props => numberToPixels(props.width)};
  height: ${props => numberToPixels(props.height)};
  top: ${props => `calc(50% - ${centerModal(props.height)})`};
  left: ${props => `calc(50% - ${centerModal(props.width)})`};
  background: ${props => props.theme.modal.background};
  box-shadow: ${props => props.theme.modal.shadow};
  &:hover {
    cursor: default;
  }
`;

class Modal extends React.Component {
  state = {
    show: false,
  };

  toggle = ({show = null}) => {
    this.setState(state => ({
      show: show === null ? !state.show : show,
    }));
  };

  openModal = (event) => {
    event.stopPropagation();
    this.toggle({show: true});
  };

  closeModal = () => {
    this.toggle({show: false});
    this.props.onClose();
  };

  render() {
    const {clickOutside, width, height, children, render} = this.props;
    // const Render = render;
    // <Render closeModal={this.closeModal} />
    // {render({closeModal: this.closeModal})}
    return (
      <div onClick={this.openModal}>
        {children}
        <Overlay
          show={this.state.show}
          onClose={this.closeModal}
          clickOutside={clickOutside}>
          <Draggable handle=".handle" bounds="#root">
            <DragWrapper className="handle" width={width} height={height}>
              {render({closeModal: this.closeModal})}
            </DragWrapper>
          </Draggable>
        </Overlay>
      </div>
    );
  }
}

Modal.propTypes = {
  clickOutside: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  onClose: PropTypes.func,
  render: PropTypes.func,
  children: PropTypes.node,
};

Modal.defaultProps = {
  clickOutside: true,
  width: 300,
  height: 300,
  onClose: () => {},
  children: null,
};

export default Modal;
