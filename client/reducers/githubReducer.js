import {
  AUTH_TOKEN_LOADED_FROM_LOCAL_STORAGE,
  LOGIN_STARTED,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  FETCHED_USER_DATA,
  STARTED_COPY_APP_TO_REPO,
  COPY_APP_TO_REPO_STATUS_UPDATE,
  COPY_APP_TO_REPO_SUCCESSFUL,
  RESULTS_FAILURE,
} from '../actions/index';

export const initialState = {
  token: null,
  loggingIn: false,
  loginError: false,
  user: {},
  loadingResults: false,
  latestStatusUpdateMessage: '',
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
        loginError: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.access_token,
        loggingIn: false,
        loginError: false,
      };
    case LOGIN_FAILURE:
      return {
        ...initialState,
        loginError: true,
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
        latestStatusUpdateMessage: initialState.latestStatusUpdateMessage,
      };
    case COPY_APP_TO_REPO_STATUS_UPDATE:
      return {
        ...state,
        loadingResults: true,
        latestStatusUpdateMessage: _.get(action.payload, 'message', ''),
      };
    case COPY_APP_TO_REPO_SUCCESSFUL:
      return {
        ...state,
        results: action.payload,
        loadingResults: initialState.loadingResults,
        resultsError: initialState.resultsError,
        latestStatusUpdateMessage: initialState.latestStatusUpdateMessage,
      };
    case RESULTS_FAILURE:
      return {
        ...state,
        loadingResults: initialState.loadingResults,
        results: initialState.results,
        resultsError: action.payload,
        latestStatusUpdateMessage: initialState.latestStatusUpdateMessage,
      };
    default:
      return state;
  }
};
