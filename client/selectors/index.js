import _ from 'lodash';
import { createSelector } from 'reselect';

const getRouterLocation = state => state.router.location;
const getCopyAppToRepoResults = state => state.github.results;
const copyAppToRepoFormValuesSelector = state => state.form.copyAppToRepo;

export const copyAppToRepoResultsErrorSelector = state => state.github.resultsError;
export const githubAuthTokenSelector = state => state.github.token;
export const githubUserDataSelector = state => state.github.user;
export const isLoadingCopyAppToRepoResultsSelector = state => state.github.loadingResults;
export const latestCopyAppToRepoStatusUpdateSelector = state => state.github.latestStatusUpdateMessage;
export const loginErrorSelector = state => state.github.loginError;

export const isLoggedInSelector = createSelector(
  [githubAuthTokenSelector],
  (authToken) => {
    return (authToken != null);
  }
);

export const userGitHubLoginSelector = createSelector(
  [githubUserDataSelector],
  (userData) => {
    return _.get(userData, 'login');
  }
);

export const successfullyAddedFilesSelector = createSelector(
  [getCopyAppToRepoResults],
  (results) => {
    return _.get(results, 'successfullyAdded', []);
  }
);

export const unsuccessfullyAddedFilesSelector = createSelector(
  [getCopyAppToRepoResults],
  (results) => {
    return _.get(results, 'failed', []);
  }
);

export const resultsAreLoadedSelector = createSelector(
  [successfullyAddedFilesSelector, unsuccessfullyAddedFilesSelector],
  (successes, failures) => {
    return (successes.length > 0 || failures.length > 0);
  }
);

export const repoNameInResultsSelector = createSelector(
  [getCopyAppToRepoResults],
  (results) => {
    return _.get(results, 'repoName', []);
  }
);

export const attemptedRepoNameSelector = createSelector(
  [copyAppToRepoResultsErrorSelector],
  (copyAppToRepoResultsError) => {
    return _.get(copyAppToRepoResultsError, ['data', 'repoName'], '');
  }
);

export const copyAppToRepoResultsErrorStatusSelector = createSelector(
  [copyAppToRepoResultsErrorSelector],
  (copyAppToRepoResultsError) => {
    return _.get(copyAppToRepoResultsError, ['status'], 500);
  }
);

export const copyAppToRepoResultsErrorMessageSelector = createSelector(
  [copyAppToRepoResultsErrorSelector],
  (copyAppToRepoResultsError) => {
    return _.get(copyAppToRepoResultsError, ['data', 'message'], 'Unknown error.');
  }
);
