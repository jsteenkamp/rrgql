import PropTypes from 'prop-types';
import styled from 'styled-components';
import {numberToPixels} from 'Utils/components';

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  overflow: hidden;
  height: ${props => numberToPixels(props.height)};
  background: ${props => props.theme.footer.backgroundColor};
  & > .spacer {
    flex-grow: 1;
    margin: 0;
  }
  & > div {
    margin: 0 10px;
  }
`;

Footer.defaultProps = {
  height: 30,
};

Footer.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Footer;
