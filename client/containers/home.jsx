import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

// Import action creators
import { loadTokenAndGetUser, logout } from '../actions/index';

// Import selectors
import { githubAuthTokenSelector, isLoggedInSelector, githubUserDataSelector } from '../selectors/index';

// Import components
import { WelcomeMessage } from '../components/welcomeMessage.jsx';
import { Button } from '../components/genericButton.jsx';
import CopyAppToRepo from './copyAppToRepo.jsx';

class Home extends Component {
  componentDidMount() {
    this.props.loadTokenAndGetUser();
  }

  renderBody = () => {
    if (this.props.isLoggedIn) {
      return (
        <div>
          <CopyAppToRepo/>
          <Button
            handleClick={this.props.logout}
            buttonText='Log Out'
            />
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  };

  render() {
    const { isLoggedIn, user, logout } = this.props;
    return (
      <div>
        <WelcomeMessage
          isLoggedIn={isLoggedIn}
          userData={user}
          />
        {this.renderBody(isLoggedIn, logout)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: githubAuthTokenSelector(state),
    isLoggedIn: isLoggedInSelector(state),
    user: githubUserDataSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadTokenAndGetUser, logout }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
