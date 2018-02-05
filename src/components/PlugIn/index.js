import React from 'react';
import PropTypes from 'prop-types';
import IFrame from '../IFrame';
import {getUrlPath} from 'Utils/url';

const PlugIn = ({src, data = {}}) => {
  return (
    <IFrame
      src={getUrlPath(src)}
      onLoad={iFrameElem => iFrameElem.contentWindow.onAction(data)}
    />
  );
};

PlugIn.propTypes = {
  src: PropTypes.string.isRequired,
  data: PropTypes.object,
};

export default PlugIn;
