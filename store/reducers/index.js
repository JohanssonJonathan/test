import { combineReducers } from 'redux';
import { RESET_STORE } from '../../constants/actions';

import myPlans from './myPlans';
import planBrowser from './planBrowser';
import profile from './profile';
import settings from './settings';
import comments from './comments';
import notifications from './notifications';
import readingSettings from './readingSettings';
import donations from './donations';
import subscriptions from './subscriptions';

const combined = combineReducers({
  myPlans,
  planBrowser,
  profile,
  settings,
  comments,
  notifications,
  readingSettings,
  donations,
  subscriptions
});

export default (state, action) => {
  if (action.type === RESET_STORE) {
    // Return initial state for all reducers
    return combined(undefined, action);
  }
  return combined(state, action);
};
