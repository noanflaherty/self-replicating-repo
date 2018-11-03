import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { github } from './githubReducer';

const rootReducer = combineReducers({
  github,
  form: formReducer,
});

export default rootReducer;
