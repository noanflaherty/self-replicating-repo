import axios from 'axios';
import _ from 'lodash';

const ROOT_URL = `/api/github`;

import { saveTokenToLocalStorage } from '../utils/localStorage';

export const LOGIN_STARTED = 'LOGIN_STARTED';
export const RETRIEVED_CODE = 'LOGIN_SUCCESS';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const loginStarted = () => {
  return {
    type: LOGIN_STARTED,
  };
};


export const fetchAuthToken = (data) => {

  return (dispatch) => {
    const code = _.get(data, 'code', null);

    console.log('Inside of fetch token: ', code);

    const url = `${ROOT_URL}/authenticate`;

    const params = {
      code: code,
    };

    const request = axios({
      method: 'post',
      url: url,
      params: params,
      config: { headers: { 'Content-Type': 'application/json' } },
    }).then(resp => {
      console.log('Success: ', resp);
      dispatch(loginSuccess(resp.data));
    }).catch(error => {
      dispatch(loginFailure(error));
    });
  };
};

export const loginSuccess = (response) => {

  console.log('Inside of login success: ', response);

  return {
    type: LOGIN_SUCCESS,
    payload: response,
  };
};

export const loginFailure = error => (
  {
    type: LOGIN_FAILURE,
    error,
  }
);
