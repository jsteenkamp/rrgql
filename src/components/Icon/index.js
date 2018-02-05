import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {numberToPixels} from 'Utils/components';

// Generate sprite sheet http://varun.ca/icon-component/ and https://webpack.js.org/guides/dependency-management/#require-context
const importAll = (r) => r.keys().forEach(r);

importAll(require.context('!svg-sprite-loader!../../../_assets/svg', false, /.*\.svg$/));

const Svg = styled.svg`
  display: inline-block;
  vertical-align: middle;
  width: ${props => numberToPixels(props.size)};
  height: ${props => numberToPixels(props.size)};
  fill: ${props => props.color};
`;

// default size = 24px = 1.5em based on default font size = 16px
const Icon = ({type, size = '1.5em', color = 'rgba(0,0,0,.54)'}) => (
  <Svg size={size} color={color}>
    <use xlinkHref={`#${type}`}></use>
  </Svg>
);

Icon.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string
};

export default Icon;