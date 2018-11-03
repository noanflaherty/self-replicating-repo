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
      </div>
    );
  } else {
    return (
      <div>
        <h1>Welcome</h1>
        <p>Please authenticate using your GitHub credentials.</p>
        <LoginButton/>
      </div>
    );
  }
};
