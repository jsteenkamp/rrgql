import React from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';
import Overlay from '../Overlay';
import {numberToPixels} from 'Utils/components';


const Panel = styled.div`
  position: absolute;
  ${props => (props.left !== null ? css`left: ${numberToPixels(props.left)};` : '')}
  ${props => (props.right !== null ? css`right: ${numberToPixels(props.right)};` : '')}
  ${props => (props.top !== null ? css`top: ${numberToPixels(props.top)}` : '')};
  ${props => (props.bottom !== null ? css`bottom: ${numberToPixels(props.bottom)}` : '')};
  width: ${props => props.width}px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${props => (props.bottom ? 'flex-end' : 'flex-start')};
  overflow: hidden;
  overflow-y: ${props => props.overflowY};
`;

const OverlayPanel = ({
  show = false,
  background = '',
  onClose = () => {},
  overflowY = 'auto',
  top = null,
  right = null,
  bottom = null,
  left = null,
  width = 0,
  height = 0,
  children,
}) => (
  <Overlay show={show} background={background} onClose={onClose} overflowY={overflowY}>
    <Panel
      top={top}
      bottom={bottom}
      left={left}
      right={right}
      height={height}
      width={width}
      onClick={event => {
        if (event.target === event.currentTarget) onClose(event);
      }}>
      {children}
    </Panel>
  </Overlay>
);

OverlayPanel.propTypes = {
  show: PropTypes.bool,
  background: PropTypes.string,
  onClose: PropTypes.func,
  top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  left: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  right: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  width: PropTypes.number,
  height: PropTypes.number,
  overflowY: PropTypes.string,
  children: PropTypes.element,
};

export default OverlayPanel;
