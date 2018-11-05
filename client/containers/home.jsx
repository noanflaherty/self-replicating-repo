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
      const bodyStyle = {
        minHeight: '300px',
        paddingBottom: '80px',
      };

      return (
        <div className="container">
          <div className="row" style={bodyStyle}>
            <CopyAppToRepo/>
          </div>
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              <button
                className="btn btn-link "
                onClick={this.props.logout}
                >Disconnect GitHub Account
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

    const containerStyle = {
      maxWidth: '550px',
      marginTop: '50px',
      marginBottom: '50px',
    };

    return (
      <main role="main" className="container" style={containerStyle}>
        <div style={{paddingBottom: '30px'}}>
          <WelcomeMessage
            isLoggedIn={this.props.isLoggedIn}
            userData={this.props.user}
            />
        </div>
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
