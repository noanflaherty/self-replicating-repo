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
  latestCopyAppToRepoStatusUpdateSelector,
  copyAppToRepoResultsErrorSelector,
  copyAppToRepoResultsErrorStatusSelector,
  copyAppToRepoResultsErrorMessageSelector,
  attemptedRepoNameSelector,
  userGitHubLoginSelector,
} from '../selectors/index';

class CopyAppToRepo extends Component {

  renderResults = () => {

    const allFilesAddedSuccessfully = (this.props.successfullyAddedFiles.length > 0 && this.props.unsuccessfullyAddedFiles.length == 0);
    const allFilesAddedFailed = (this.props.successfullyAddedFiles.length == 0 && this.props.unsuccessfullyAddedFiles.length > 0);
    const newRepoName = this.props.repoNameInResults;
    const userLogin = this.props.userLogin;

    const success = 'text-success';
    const failure = 'text-danger';
    const warning = 'text-warning';

    const linkToRepo = () => {
      return <a className="text-info" href={`https://github.com/${userLogin}/${newRepoName}`} target="_blank">{newRepoName}</a>;
    };

    if (allFilesAddedSuccessfully) {
      return (
        <div>
          <h3 className={success}>Repo created and app files added successfully!</h3>
          <br/>
          <h4><span className={success}>Repo created:</span> <em>{linkToRepo()}</em></h4>
          <h4 className={success}>Files added:</h4>
          <ul>
            {_.map(this.props.successfullyAddedFiles, file => <li key={file}>{file}</li>)}
          </ul>
        </div>
      );
    } else if (allFilesAddedFailed) {
      return (
        <div>
          <h3 className={warning}>Repo created, but failed to add files</h3>
          <br/>
          <h4><span className={success}>Repo created:</span> <em>{linkToRepo()}</em></h4>
          <h4 className={failure}>Files failed:</h4>
          <ul>
            {_.map(this.props.unsuccessfullyAddedFiles, file => <li className={failure} key={file}>{file}</li>)}
          </ul>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Repo created and some app files added successfully</h3>
          <br/>
          <h4><span className={success}>Repo created:</span> <em>{linkToRepo()}</em></h4>
          <h4 className={success}>Files added:</h4>
          <ul>
            {_.map(this.props.successfullyAddedFiles, file => <li key={file}>{file}</li>)}
          </ul>
          <h4 className={failure}>Files failed:</h4>
          <ul>
            {_.map(this.props.unsuccessfullyAddedFiles, file => <li className={failure} key={file}>{file}</li>)}
          </ul>
        </div>
      );
    }
  };

  render() {

    if (this.props.resultsAreLoading) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h3>Loading...</h3>
              <p>{this.props.latestCopyAppToRepoStatusUpdate}</p>
            </div>
          </div>
        </div>
      );
    } else {
      if (this.props.resultsError != null) {
        const errorStatusCode = this.props.resultsErrorStatus;

        if (errorStatusCode == 503) {
          return (
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <h3 className="text-danger">Error Finishing Request</h3>
                  <p className="text-danger">{`The request timed out while in the process of committing all files. A repo with the name "${attemptedRepoName}" has been created and some files have been added. Please try again using a new repo name.`}</p>
                  <CopyAppToRepoForm/>
                </div>
              </div>
            </div>
          );
        } else if (errorStatusCode == 422) {
          const errorMessage = this.props.resultsErrorMessage;
          const attemptedRepoName = this.props.attemptedRepoName;
          return (
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <h3 className="text-danger">Error Creating Repo</h3>
                  <p className="text-danger">{`Failed to create a new repository with the name "${attemptedRepoName}". Please try a different repo name.`}</p>
                  <CopyAppToRepoForm/>
                </div>
              </div>
            </div>
          );
        } else {
           const errorStatusCode = this.props.resultsError.status;
           const errorStatusMessage = this.props.resultsErrorMessage;
           return (
             <div className="container">
               <div className="row">
                 <div className="col-12">
                   <h3 className="text-danger">Error Processing Request</h3>
                   <p className="text-danger">{`Received ${errorStatusCode} error: ${errorStatusMessage} Please try again.`}</p>
                   <CopyAppToRepoForm/>
                 </div>
               </div>
             </div>
           );
        }
      } else if (this.props.resultsAreLoaded) {
        return (
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div>{this.renderResults()}</div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <CopyAppToRepoForm/>
              </div>
            </div>
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
    latestCopyAppToRepoStatusUpdate: latestCopyAppToRepoStatusUpdateSelector(state),
    resultsError: copyAppToRepoResultsErrorSelector(state),
    resultsErrorStatus: copyAppToRepoResultsErrorStatusSelector(state),
    resultsErrorMessage: copyAppToRepoResultsErrorMessageSelector(state),
    attemptedRepoName: attemptedRepoNameSelector(state),
    userLogin: userGitHubLoginSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ copyAppToNewRepo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyAppToRepo);
