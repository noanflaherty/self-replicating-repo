import React from 'react';
import { Link } from 'react-router-dom';

// Import components
import LoginButton from '../containers/loginButton.jsx';

export const WelcomeMessage = (props) => {
  const { isLoggedIn, userData } = props;

  if (isLoggedIn) {
    return (
      <div>
        <h1>Welcome{userData.name ? `, ${userData.name}` : ''}</h1>
        <p className="lead">Enter a repo name and click the button to create a new repo in your GitHub account with all of this app's files!</p>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <h1>Welcome</h1>
        </div>
        <div>
          <p className="lead">Use this app to create a new repo in your GitHub account with this app's files.</p>
          <p>Connect your GitHub account to get started.</p>
        </div>
        <LoginButton/>
      </div>
    );
  }
};
