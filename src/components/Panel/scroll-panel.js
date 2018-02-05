import React from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';
import {AutoSizer} from 'react-virtualized';
import {numberToPixels} from 'Utils/components';

const Wrapper = styled.div.attrs({
  style: ({width, height}) => ({
    width: numberToPixels(width),
    height: numberToPixels(height),
  }),
})`
  position: relative;
  display: ${props => (props.show ? 'block' : 'none')};
  background: ${props => props.background};
  overflow: ${props => (props.overflow ? props.overflow : 'hidden')};
  ${props => props.overflow === 'hidden' && css`
    overflow-x: ${props => (props.overflowX ? props.overflowX : 'hidden')};
    overflow-y: ${props => (props.overflowY ? props.overflowY : 'hidden')};
  `}
`;

Wrapper.propTypes = {
  background: PropTypes.string,
  height: PropTypes.number,
  overflow: PropTypes.string,
  overflowX: PropTypes.string,
  overflowY: PropTypes.string,
  width: PropTypes.number,
};

Wrapper.defaultProps = {
  background: 'transparent',
  overflow: 'auto',
  overflowX: 'hidden',
  overflowY: 'hidden',
};

const Panel = props => {
  return (
    <AutoSizer>
      {({width, height}) => (
        <Wrapper {...props} width={width} height={height}>
          {props.children({width, height})}
        </Wrapper>
      )}
    </AutoSizer>
  );
};

Panel.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.func,
};

Panel.defaultProps = {
  show: true,
  children: () => {},
};

export default Panel;
