import React from 'react';
import { Link } from 'react-router-dom';

// Import components
import LoginButton from '../containers/loginButton.jsx';

export const WelcomeMessage = (props) => {
  const { isLoggedIn, loginError, userData } = props;

  const renderLoginError = (hasLoginError) => {
    if (hasLoginError) {
      return (
        <div className="row" style={{paddingBottom: '25px'}}>
          <div className="col-12">
            <p className="lead text-danger">Sorry, there was an error while connecting your GitHub account.</p>
          </div>
        </div>
      );
    } else {
      return (
        <div></div>
      )
    }

  };

  if (isLoggedIn) {
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <h1>Welcome{userData.name ? `, ${userData.name}` : ''}</h1>
            <p className="lead">Enter a repo name and click the button to create a new repo in your GitHub account with all of this app's files!</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <h1>Welcome</h1>
            <p className="lead">Use this app to create a new repo in your GitHub account with this app's files.</p>
            <p>Connect your GitHub account to get started.</p>
          </div>
        </div>
        {renderLoginError(loginError)}
        <div className="row">
          <div className="col-12">
            <LoginButton/>
          </div>
        </div>
      </div>
    );
  }
};
