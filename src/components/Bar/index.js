import PropTypes from 'prop-types';
import styled from 'styled-components';
import pure from 'recompose/pure';
import {numberToPixels} from 'Utils/components';

const Bar = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-shrink: 0;
  justify-content: space-around;
  align-items: center;
  overflow: hidden;
  height: ${props => numberToPixels(props.height)};
  background: ${props => props.background || props.theme.colors.theme3};
`;

Bar.defaultProps = {
  height: 40,
  background: '',
};

Bar.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  background: PropTypes.string,
};

export default pure(Bar);
