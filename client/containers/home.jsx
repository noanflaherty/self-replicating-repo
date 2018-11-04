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
            <CopyAppToRepo/>
          </div>
          <div className="row justify-content-center"  style={{paddingTop: '80px'}}>
            <div className="col-12 text-center">
              <button
                className="btn btn-link "
                onClick={this.props.logout}
                >Log Out
              </button>
            </div>
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
      <main role="main" className="container">
        <WelcomeMessage
          isLoggedIn={this.props.isLoggedIn}
          userData={this.props.user}
          />
        {this.renderBody(isLoggedIn, logout)}
      </main>
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
