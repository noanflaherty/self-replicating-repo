import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import GitHubLogin from 'react-github-login';

// Import components
import { Button } from '../components/genericButton.jsx';

// Import action creators
import { copyAppToNewRepo } from '../actions/index';

// Import selectors
import {
  isLoadingCopyAppToRepoResultsSelector,
  resultsAreLoadedSelector,
  successfullyAddedFilesSelector,
  unsuccessfullyAddedFilesSelector,
  repoNameInResultsSelector,
  copyAppToRepoResultsErrorSelector,
} from '../selectors/index';

class CopyAppToRepo extends Component {

  renderResults = () => {

    const allFilesAddedSuccessfully = (this.props.successfullyAddedFiles.length > 0 && this.props.unsuccessfullyAddedFiles.length == 0);
    const allFilesAddedFailed = (this.props.successfullyAddedFiles.length == 0 && this.props.unsuccessfullyAddedFiles.length > 0);

    if (allFilesAddedSuccessfully) {
      return (
        <div>
          <h3>Repo Created and App Files Added Successfully</h3>
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
        const firstError = this.props.resultsError.errors[0];
        const errorDetail = `${firstError.resource} ${firstError.message}.`
        return (
          <div>
            <h2>{errorMessage}</h2>
            <p>{errorDetail}</p>
          </div>
        );
      } else if (this.props.resultsAreLoaded) {
        return (
          <div>
            <div>{this.renderResults()}</div>
            <Button
              handleClick={() => this.props.copyAppToNewRepo('test118')}
              buttonText='Create New Repo and Copy App'
              />
          </div>
        );
      } else {
        return (
          <Button
            handleClick={() => this.props.copyAppToNewRepo('test118')}
            buttonText='Create New Repo and Copy App'
            />
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
    resultsError: copyAppToRepoResultsErrorSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ copyAppToNewRepo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyAppToRepo);
