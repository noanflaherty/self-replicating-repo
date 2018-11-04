import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import GitHubLogin from 'react-github-login';
import { clientConfig } from '../clientConfig';

// Import action creators
import { loginStarted, fetchAuthToken, loginFailure } from '../actions/index';

class LoginButton extends Component {

  render() {
    const AUTH_URI = 'https://github.com/login/oauth/authorize';
    const CLIENT_ID = clientConfig.github.clientId;
    const REDIRECT_URI = clientConfig.github.redirectUri;
    const SCOPE = clientConfig.github.defaultScope;

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
          className="btn btn-primary"
          />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginStarted, fetchAuthToken, loginFailure }, dispatch);
}

export default connect(null, mapDispatchToProps)(LoginButton);
