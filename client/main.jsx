import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import throttle from 'lodash/throttle';

// Import middleware
import thunk from 'redux-thunk';

// Import root reducer
import rootReducer from './reducers/rootReducer';

// Import containers/components
import LoginButton from './containers/loginButton.jsx';

// Import utilities
import { loadTokenFromLocalStorage, saveTokenToLocalStorage } from './utils/localStorage';

// Setup redux dev tools
const composeSetup = process.env.NODE_ENV !== 'prod' && typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const store = createStore(
  rootReducer,
  composeSetup(),
  applyMiddleware(
    thunk
  )
);

store.subscribe(throttle(() => {
  saveTokenToLocalStorage(_.get(store.getState().github, 'token', null));
}, 1000));

const App = () => {

  return (
    <div>
      <h1>Self-Replicating Repo</h1>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ LoginButton } />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
