import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import GitHubLogin from 'react-github-login';

// Import action creators
import { loginStarted, fetchAuthToken, loginFailure } from '../actions/index';

class LoginButton extends Component {

  render() {
    const AUTH_URI = 'https://github.com/login/oauth/authorize';
    const CLIENT_ID = 'a2095cdeb6ef908ffafb';
    const REDIRECT_URI = 'http://localhost:8000/';
    const SCOPE = 'user public_repo';

    return (
      <div>
        <GitHubLogin
          clientId={CLIENT_ID}
          onRequest={() => this.props.loginStarted()}
          onSuccess={(resp) => this.props.fetchAuthToken(resp)}
          onFailure={(error) => this.props.loginFailure(error)}
          redirectUri={REDIRECT_URI}
          scope={SCOPE}
          buttonText='Log In'
          />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginStarted, fetchAuthToken, loginFailure }, dispatch);
}

export default connect(null, mapDispatchToProps)(LoginButton);
