import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import throttle from 'lodash/throttle';

// Import middleware
import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';

// Import root reducer
import rootReducer from './reducers/rootReducer';

// Import containers/components
import Home from './containers/home.jsx';

// Import utilities
import { loadTokenFromLocalStorage, saveTokenToLocalStorage } from './utils/localStorage';

// Setup redux dev tools
const composeEnhancer = process.env.NODE_ENV !== 'prod' && typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(
    ReduxPromise,
    thunk,
  ))
);

store.subscribe(throttle(() => {
  const authToken = _.get(store.getState().github, 'token', null);
  saveTokenToLocalStorage(authToken);
}, 1000));

const App = () => {

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ Home } />
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
