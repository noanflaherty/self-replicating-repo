import axios from 'axios';
import _ from 'lodash';

import { loadTokenFromLocalStorage } from '../utils/localStorage';
import { githubAuthTokenSelector, isLoggedInSelector } from '../selectors/index';

export const AUTH_TOKEN_LOADED_FROM_LOCAL_STORAGE = 'AUTH_TOKEN_LOADED_FROM_LOCAL_STORAGE';
export const LOGIN_STARTED = 'LOGIN_STARTED';
export const RETRIEVED_CODE = 'LOGIN_SUCCESS';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const FETCHED_USER_DATA = 'FETCHED_USER_DATA';
export const STARTED_COPY_APP_TO_REPO = 'STARTED_COPY_APP_TO_REPO';
export const COPY_APP_TO_REPO_SUCCESSFUL = 'COPY_APP_TO_REPO_SUCCESSFUL';
export const RESULTS_FAILURE = 'RESULTS_FAILURE';

const getAuthTokenFromLocalStorage = () => {
  const token = loadTokenFromLocalStorage();
  return {
    type: AUTH_TOKEN_LOADED_FROM_LOCAL_STORAGE,
    payload: token,
  };
};

export const loginStarted = () => {
  return {
    type: LOGIN_STARTED,
  };
};

export const fetchAuthToken = (data) => {

  return (dispatch, getState) => {
    const code = _.get(data, 'code', null);
    const url = `/api/github/authenticate`;

    const params = {
      code: code,
    };

    const request = axios({
      method: 'post',
      url: url,
      params: params,
      config: { headers: { 'Content-Type': 'application/json' } },
    }).then(resp => {
      dispatch(loginSuccess(resp.data));
    }).catch(error => {
      dispatch(loginFailure(error));
    }).then(() => {
      const token = githubAuthTokenSelector(getState());
      dispatch(fetchUserData(token));
    });
  };
};

const loginSuccess = (response) => {
  return {
    type: LOGIN_SUCCESS,
    payload: response,
  };
};

export const loginFailure = error => (
  {
    type: LOGIN_FAILURE,
    payload: error,
  }
);

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const loadTokenAndGetUser = () => {
  return (dispatch, getState) => {
    dispatch(getAuthTokenFromLocalStorage());

    const token = githubAuthTokenSelector(getState());
    const isLoggedIn = isLoggedInSelector(getState());

    if (isLoggedIn) {
      dispatch(fetchUserData(token));
    }
  };
};

const fetchUserData = (authToken) => {

  return (dispatch) => {
    const url = 'https://api.github.com/user';

    const headers = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${authToken}`,
    };

    const request = axios({
      method: 'get',
      url: url,
      headers: headers,
    }).then(resp => {
      dispatch(fetchedUserData(resp));
    }).catch(error => {
      dispatch(logout());
    });
  };
};

export const fetchedUserData = (resp) => {
  return {
    type: FETCHED_USER_DATA,
    payload: resp.data,
  };
};

export const copyAppToNewRepo = (values) => {

  const repoName = values.repoName;

  return (dispatch, getState) => {

    dispatch(startedCopyingAppToRepo());

    const token = githubAuthTokenSelector(getState());
    const url = `/api/github/copy-app-to-repo`;

    const params = {
      repoName: repoName,
      token: token,
    };

    const request = axios({
      method: 'post',
      url: url,
      data: params,
      config: { headers: { 'Content-Type': 'application/json' } },
    }).then(resp => {
      dispatch(copyAppToRepoSuccessful(resp.data));
    }).catch(error => {
      dispatch(resultsFailure(error));
    })
  };
};


export const startedCopyingAppToRepo = () => {
  return {
    type: STARTED_COPY_APP_TO_REPO,
  };
};

export const copyAppToRepoSuccessful = (resp) => {
  return {
    type: COPY_APP_TO_REPO_SUCCESSFUL,
    payload: resp,
  };
};

const resultsFailure = error => (
  {
    type: RESULTS_FAILURE,
    payload: error,
  }
);
