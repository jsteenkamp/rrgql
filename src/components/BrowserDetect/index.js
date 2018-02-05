import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import bowser from 'bowser';

const Overlay = styled.div`
 position: absolute;
 display: flex;
 top: 0;
 left: 0;
 bottom: 0;
 right: 0;
 background: rgba(0,0,0,0.1);
 justify-content: center;
 align-items: center;
`;

const Wrapper = styled.div`
  width: 50%;
  height: 50%;
  border-radius: 10px;
  padding: 2em;
  background: ${props => props.theme.browserDetect.background};
  box-shadow: ${props => props.theme.browserDetect.shadow}
`;

const Browser = ({children}) => {
  const isUnsupported = bowser.isUnsupportedBrowser(
    {
      chrome: '58.0',
      safari: '10.1',
      firefox: '53.0',
      msie: '11.0',
      msedge: '40.0',
    },
    true,
  );
  // log some info for debugging
  if (isUnsupported) console.info('Browser', bowser);
  return isUnsupported
    ? <Overlay>
        <Wrapper>
          <h1>Unsupported Browser</h1>
          <p>{bowser.name} {bowser.version}</p>
          <p>Details of supported browsers (minimum versions) here...</p>
        </Wrapper>
      </Overlay>
    : children;
};

Browser.propTypes = {
  children: PropTypes.element,
};

export default Browser;
