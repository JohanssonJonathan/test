import { createAction } from 'redux-actions';
import {
  SETTINGS_LOAD,
  SETTINGS_LOAD_SUCCESS,
  SETTINGS_LOAD_ERROR,
  UPDATE_SETTINGS,
  UPDATE_SETTINGS_SUCCESS,
  UPDATE_SETTINGS_ERROR
} from '../constants/actions';
import { createLoadAction } from '../lib/rest-helpers';

export const loadSettings = planId =>
  createLoadAction({
    path: `/my-plans/${planId}/settings`,
    load: SETTINGS_LOAD,
    success: SETTINGS_LOAD_SUCCESS,
    error: SETTINGS_LOAD_ERROR
  })();

export const updateSettings = ({ planId, reminders, translation }) =>
  createLoadAction({
    load: UPDATE_SETTINGS,
    success: UPDATE_SETTINGS_SUCCESS,
    error: UPDATE_SETTINGS_ERROR
  })({
    path: `/my-plans/${planId}/settings`,
    method: 'put',
    body: { reminders, translation }
  });
