import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Route, BrowserRouter, Redirect, Switch} from 'react-router-dom';
import SignIn from '../../views/SignIn';

const AuthorizedRoutes = props => {
  const authorizedViews = routerProps => {
    const {location} = routerProps;
    if (props.isAuthenticated) {
      if (/.htm?/.test(location.pathname)) {
        return <Redirect to={{pathname: '/'}} />;
      } else {
        return (
          <Switch>
            {props.children}
          </Switch>
        );
      }
    } else {
      return <Redirect to={{pathname: '/signin', state: {from: location}}} />;
    }
  };

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/signin" component={SignIn} />
        <Route render={routerProps => authorizedViews(routerProps)} />
      </Switch>
    </BrowserRouter>
  );
};

AuthorizedRoutes.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  children: PropTypes.array,
};

export default connect(state => ({
  isAuthenticated: state.user.authenticated,
}))(AuthorizedRoutes);
