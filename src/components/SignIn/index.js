import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SignInWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const SignInForm = styled.div`
  width: 250px;
  padding: 10px;
  background: #fff;
  box-shadow: ${props => props.theme.shadows.shadow2dp};
  label: {
    margin: 10px;
  }
`;


class SignIn extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
  };

  state = {
    fields: {
      username: '',
      password: ''
    },
    errors: {},
    type: 'password'
  };


  validate = (credentials) => {
    const errors = {};
    if (!credentials.username) errors.username = 'Username is required';
    if (!credentials.password) errors.password = 'Password is required';
    return errors;
  };


  togglePassword = (event) => {
    this.setState({type: event.target.checked ? 'text' : 'password'});
  };

  onChange = (event) => {
    const fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    this.setState({fields});
  };

  onSubmit = (event) => {
    event.preventDefault();
    const errors = this.validate(this.state.fields);
    this.setState({errors});
    // errors then return early
    if (Object.keys(errors).length) return;
    // no errors then submit
    this.props.handleSubmit(this.state.fields);
  };

  render() {
    return (
      <SignInWrapper>
        <SignInForm>
          <form onSubmit={this.onSubmit}>
            <input type="text"
                   name="username"
                   placeholder="Username"
                   value={this.state.fields.username}
                   onChange={this.onChange}/>
            <span>{this.state.errors.username}</span>
            <br/>
            <input type={this.state.type}
                   name="password"
                   placeholder="Password"
                   value={this.state.fields.password}
                   onChange={this.onChange}/>
            <span>{this.state.errors.password}</span>
            <br/>
            <label form="showPassword"><input type="checkbox" id="showPassword" onClick={this.togglePassword}/> Show Password</label>
            <br/>
            <button type="submit" disabled={this.props.isSubmitting}>Sign In</button>
          </form>
        </SignInForm>
      </SignInWrapper>
    );
  }
}

export default SignIn;
