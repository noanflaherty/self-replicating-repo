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
import { Button } from 'react-bootstrap';
import CopyAppToRepo from './copyAppToRepo.jsx';

class Home extends Component {
  componentDidMount() {
    this.props.loadTokenAndGetUser();
  }

  renderBody = () => {
    if (this.props.isLoggedIn) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-12 center-block">
              <CopyAppToRepo/>
            </div>
          </div>
          <div className="row">
            <Button
              bsStyle='link'
              onClick={this.props.logout}
              >Log Out
            </Button>
          </div>
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
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <WelcomeMessage
              isLoggedIn={this.props.isLoggedIn}
              userData={this.props.user}
              />
            {this.renderBody(isLoggedIn, logout)}
          </div>
        </div>
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
