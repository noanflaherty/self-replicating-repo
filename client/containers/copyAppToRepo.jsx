import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import GitHubLogin from 'react-github-login';

// Import components
import CopyAppToRepoForm from './copyAppToRepoForm.jsx';

// Import action creators
import { copyAppToNewRepo } from '../actions/index';

// Import selectors
import {
  isLoadingCopyAppToRepoResultsSelector,
  resultsAreLoadedSelector,
  successfullyAddedFilesSelector,
  unsuccessfullyAddedFilesSelector,
  repoNameInResultsSelector,
  copyAppToRepoResultsErrorDataSelector,
  attemptedRepoNameSelector,
} from '../selectors/index';

class CopyAppToRepo extends Component {

  renderResults = () => {

    const allFilesAddedSuccessfully = (this.props.successfullyAddedFiles.length > 0 && this.props.unsuccessfullyAddedFiles.length == 0);
    const allFilesAddedFailed = (this.props.successfullyAddedFiles.length == 0 && this.props.unsuccessfullyAddedFiles.length > 0);
    const newRepoName = this.props.repoNameInResults;

    if (allFilesAddedSuccessfully) {
      return (
        <div>
          <h3>Repo Created and App Files Added Successfully</h3>
          <h4>Repo Created: {newRepoName}</h4>
          <h4>Files Added:</h4>
          <ul>
            {_.map(this.props.successfullyAddedFiles, file => <li key={file}>{file}</li>)}
          </ul>
        </div>
      );
    } else if (allFilesAddedFailed) {
      return (
        <div>
          <h3>Repo Created But Failed To Add Files</h3>
          <h4>Repo Created: {newRepoName}</h4>
          <h4>Files Failed:</h4>
          <ul>
            {_.map(this.props.unsuccessfullyAddedFiles, file => <li key={file}>{file}</li>)}
          </ul>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Repo Created and Some App Files Added Successfully</h3>
          <h4>Repo Created: {newRepoName}</h4>
          <h4>Files Added:</h4>
          <ul>
            {_.map(this.props.successfullyAddedFiles, file => <li key={file}>{file}</li>)}
          </ul>
          <h4>Files Failed:</h4>
          <ul>
            {_.map(this.props.unsuccessfullyAddedFiles, file => <li key={file}>{file}</li>)}
          </ul>
        </div>
      );
    }
  };

  render() {

    if (this.props.resultsAreLoading) {
      return (
        <div>Loading...</div>
      );
    } else {
      if (this.props.resultsError != null) {
        const errorMessage = this.props.resultsError.message;
        const attemptedRepoName = this.props.attemptedRepoName;
        return (
          <div>
            <h2>Error Creating Repo</h2>
            <p>{`Failed to create a new repository with the name "${attemptedRepoName}". Please try a different repo name.`}</p>
            <CopyAppToRepoForm/>
          </div>
        );
      } else if (this.props.resultsAreLoaded) {
        return (
          <div>
            <div>{this.renderResults()}</div>
            <CopyAppToRepoForm/>
          </div>
        );
      } else {
        return (
          <CopyAppToRepoForm/>
        );
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    resultsAreLoading: isLoadingCopyAppToRepoResultsSelector(state),
    resultsAreLoaded: resultsAreLoadedSelector(state),
    successfullyAddedFiles: successfullyAddedFilesSelector(state),
    unsuccessfullyAddedFiles: unsuccessfullyAddedFilesSelector(state),
    repoNameInResults: repoNameInResultsSelector(state),
    resultsError: copyAppToRepoResultsErrorDataSelector(state),
    attemptedRepoName: attemptedRepoNameSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ copyAppToNewRepo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyAppToRepo);
