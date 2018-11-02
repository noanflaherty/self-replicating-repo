import { LOGIN_STARTED, LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions/index';

export const initialState = {
  token: null,
  loggingIn: false,
  error: null,
};

export const github = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_STARTED:
      return {
        token: null,
        loggingIn: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        token: action.payload.access_token,
        loggingIn: false,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        token: null,
        loggingIn: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
