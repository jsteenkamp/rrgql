import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Redirect} from 'react-router-dom';
import user from 'Store/user';
import SignIn from 'Components/SignIn';
import authUser from '../../app/modules/authUser';

class SignInView extends React.Component {
  static propTypes = {
    userSet: PropTypes.func.isRequired,
    userClear: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  };

  state = {
    isSubmitting: false,
    errors: [],
  };

  // credentials = {username, password}
  handleSubmit = credentials => {
    this.setState({isSubmitting: true});
    authUser({
      credentials,
      callback: result => {
        if (result.authenticated) {
          this.setState({isSubmitting: false});
          this.props.userSet(result);
        } else {
          this.props.userClear();
          this.setState({isSubmitting: false, errors: result.errors});
        }
      },
    });
  };

  render() {
    const {from} = this.props.location.state || {from: {pathname: '/'}};

    // valid route if initial URL was '/signin' - otherwise redirects here
    if (from.pathname === '/signin') {
      from.pathname = '/';
    }

    return this.props.isAuthenticated
      ? <Redirect to={from} />
      : <SignIn
          isSubmitting={this.state.isSubmitting}
          handleSubmit={this.handleSubmit}
        />;
  }
}

export default connect(
  state => ({
    isAuthenticated: state.user.authenticated,
  }),
  dispatch =>
    bindActionCreators(
      {
        userSet: user.actions.userSet,
        userClear: user.actions.userClear,
      },
      dispatch,
    ),
)(SignInView);
