import React from 'react';
import PropTypes from 'prop-types';

const NotFound = ({ location }) => (
  <div>View <code>{location.pathname}</code> not found</div>
);

NotFound.propTypes = {
  location: PropTypes.object.isRequired,
};

export default NotFound;
