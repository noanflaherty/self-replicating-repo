import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import config from 'config'; // Import config to get default repo name.

// Import components
import { Button } from 'react-bootstrap';

// Import action creators
import { copyAppToNewRepo } from '../actions/index';

class CopyAppToRepoForm extends Component {

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit}>
        <div>
          <Field name="repoName" component="input" type="text" />
        </div>
        <Button
          bsStyle="primary"
          type='submit'
          >Copy App To New Repo
        </Button>
        </form>
      </div>
    );
  };
}

// When the form is submitted, dispatch our external action creator and pass it our form values.
function submitForm(values, dispatch) {
  return dispatch(copyAppToNewRepo(values));
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ copyAppToNewRepo }, dispatch);
}

CopyAppToRepoForm = reduxForm({
  form: 'copyAppToRepo',
  onSubmit: submitForm, // Associates the form submit event with our external actionc reator.
  initialValues: {
    repoName: config.APP.default_repo_name, // Set this as the default repo name
  },
})(CopyAppToRepoForm);

export default connect(null, mapDispatchToProps)(CopyAppToRepoForm);
