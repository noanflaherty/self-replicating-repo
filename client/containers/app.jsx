import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

// Import components
import Home from './home.jsx';
import { LoadingPage } from '../components/loadingPage.jsx';

class App extends Component {

  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Switch>
              <Route exact path="/" component={Home} />
            </Switch>
            <Switch>
              <Route path="/login" component={LoadingPage} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect()(App);
