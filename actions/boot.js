import { createAction } from 'redux-actions';
import { RESET_STORE } from '../constants/actions';
import { loadProfile } from './profile';
import { loadPlansAndSteps, loadArchivedPlansAndSteps } from './myPlans';
import { loadNotifications } from './notifications';

export const resetStore = createAction(RESET_STORE);

export const init = () => dispatch => {
  const blocking = Promise.all([
    dispatch(loadProfile()),
    dispatch(loadPlansAndSteps()),
    dispatch(loadArchivedPlansAndSteps())
  ]);
  dispatch(loadNotifications());

  return blocking;
};
