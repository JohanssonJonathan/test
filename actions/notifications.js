import {
  NOTIFICATIONS_LOAD,
  NOTIFICATIONS_LOAD_SUCCESS,
  NOTIFICATIONS_LOAD_ERROR,
  NOTIFICATIONS_BANNER_HIDE,
  NOTIFICATIONS_MARK_AS_READ,
  NOTIFICATIONS_MARK_AS_READ_SUCCESS,
  NOTIFICATIONS_MARK_AS_READ_ERROR
} from '../constants/actions';
import { createLoadAction } from '../lib/rest-helpers';

export const loadNotifications = createLoadAction({
  path: '/notifications',
  load: NOTIFICATIONS_LOAD,
  success: NOTIFICATIONS_LOAD_SUCCESS,
  error: NOTIFICATIONS_LOAD_ERROR
});

export const markNotificationAsRead = notification =>
  createLoadAction({
    load: NOTIFICATIONS_MARK_AS_READ,
    success: NOTIFICATIONS_MARK_AS_READ_SUCCESS,
    error: NOTIFICATIONS_MARK_AS_READ_ERROR
  })({
    path: `/notifications/${notification.id}`,
    method: 'patch',
    body: { readAt: new Date().toISOString() },
    notification: { ...notification, readAt: new Date().toISOString() }
  });

export const hideBanner = id => ({
  type: NOTIFICATIONS_BANNER_HIDE,
  payload: id
});
