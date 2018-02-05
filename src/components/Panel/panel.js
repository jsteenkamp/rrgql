import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _isFunction from 'lodash/isFunction';
import Measure from 'react-measure';
import {numberToPixels} from 'Utils/components';

const expandFlexShortHand = (flex, size = 'auto') => {
  return {
    initial: `flex-grow: 0; flex-shrink: 1; flex-basis: ${numberToPixels(size)};`,
    auto: `flex-grow: 1; flex-shrink: 1; flex-basis: ${numberToPixels(size)};`,
    none: `flex-grow: 0; flex-shrink: 0; flex-basis: ${numberToPixels(size)};`,
  }[flex];
};

const autoSize = (size, value) => (size === 'auto' ? numberToPixels(value) : 'auto');

const Wrapper = styled.div`
  position: relative;
  display: ${props => (props.show ? 'flex' : 'none')};
  flex-direction: ${props => props.direction};
  ${props => expandFlexShortHand(props.flex, props.size)};
  height: ${props => autoSize(props.size, props.height)};
  width: ${props => autoSize(props.size, props.width)};
  background: ${props => props.background};
  overflow: ${props => (props.overflow ? props.overflow : 'hidden')};
  overflow-x: ${props => (props.overflowX ? props.overflowX : 'hidden')};
  overflow-y: ${props => (props.overflow ? props.overflowY : 'hidden')};
`;

Wrapper.propTypes = {
  background: PropTypes.string,
  direction: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  overflow: PropTypes.string,
  show: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  flex: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Wrapper.defaultProps = {
  direction: 'column',
  flex: 'auto', // initial | auto | none
  size: 'auto',
  height: '100%',
  width: '100%',
  background: 'transparent',
  overflow: 'hidden',
  overflowX: 'hidden',
  overflowY: 'hidden',
  show: true,
};

const Panel = props => {
  if (props.show && _isFunction(props.onShow)) props.onShow();
  return _isFunction(props.onResize)
    ? <Measure bounds onResize={contentRect => props.onResize(contentRect.bounds)}>
        {({measureRef}) => <Wrapper innerRef={measureRef} {...props}>{props.children}</Wrapper>}
      </Measure>
    : <Wrapper {...props}>{props.children}</Wrapper>;
};

Panel.propTypes = {
  show: PropTypes.bool,
  onShow: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  onResize: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  children: PropTypes.node,
};

Panel.defaultProps = {
  show: true,
  onShow: null,
  onResize: null,
  children: null,
};

export default Panel;
