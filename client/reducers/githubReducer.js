import {
  AUTH_TOKEN_LOADED_FROM_LOCAL_STORAGE,
  LOGIN_STARTED,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  FETCHED_USER_DATA,
  STARTED_COPY_APP_TO_REPO,
  COPY_APP_TO_REPO_SUCCESSFUL,
  RESULTS_FAILURE,
} from '../actions/index';

export const initialState = {
  token: null,
  loggingIn: false,
  loginError: null,
  user: {},
  loadingResults: false,
  results: {},
  resultsError: null,
};

export const github = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_TOKEN_LOADED_FROM_LOCAL_STORAGE:
      return {
        ...state,
        token: action.payload,
      };
    case LOGIN_STARTED:
      return {
        ...state,
        loggingIn: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.access_token,
        loggingIn: false,
        loginError: null,
      };
    case LOGIN_FAILURE:
      return {
        ...initialState,
        loginError: action.payload.response,
      };
    case LOGOUT:
      return initialState;
    case FETCHED_USER_DATA:
      return {
        ...state,
        user: action.payload,
      };
    case STARTED_COPY_APP_TO_REPO:
      return {
        ...state,
        loadingResults: true,
      };
    case COPY_APP_TO_REPO_SUCCESSFUL:
      return {
        ...state,
        results: action.payload,
        loadingResults: false,
        resultsError: null,
      };
    case RESULTS_FAILURE:
      return {
        ...state,
        loadingResults: false,
        results: {},
        resultsError: action.payload.response,
      };
    default:
      return state;
  }
};
