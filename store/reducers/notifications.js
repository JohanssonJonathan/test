import {
  NOTIFICATIONS_LOAD,
  NOTIFICATIONS_LOAD_SUCCESS,
  NOTIFICATIONS_LOAD_ERROR,
  NOTIFICATIONS_BANNER_HIDE,
  NOTIFICATIONS_MARK_AS_READ_SUCCESS
} from '../../constants/actions';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

const notifications = (
  state = {
    isLoading: true,
    byType: {
      banner: [],
      comment: [],
      other: []
    }
  },
  { type, payload }
) => {
  switch (type) {
    case NOTIFICATIONS_LOAD: {
      return { ...state, isLoading: true };
    }

    case NOTIFICATIONS_LOAD_SUCCESS: {
      const byType = payload
        .map(notification => {
          notification.timestamp = -new Date(notification.createdAt).getTime();
          return notification;
        })
        .sort((a, b) => a.timestamp - b.timestamp)
        .reduce(
          (mem, item) => {
            if (!item) {
              return mem;
            }

            // Group notifications by type
            const kind = item.kind || 'other';

            mem[kind] = mem[kind] || [];
            mem[kind].push(item);

            return mem;
          },
          {
            banner: [],
            comment: [],
            other: []
          }
        );

      return {
        ...state,
        isLoading: false,
        byType
      };
    }

    case NOTIFICATIONS_LOAD_ERROR: {
      return { ...state, isLoading: false, error: payload };
    }

    case NOTIFICATIONS_MARK_AS_READ_SUCCESS: {
      const updatedNotifications = state.byType[payload.kind].reduce(
        (array, notification) => {
          if (notification.id === payload.id) {
            array.push(payload);
            return array;
          } else {
            array.push(notification);
            return array;
          }
        },
        []
      );
      return {
        ...state,
        byType: { ...state.byType, [payload.kind]: updatedNotifications }
      };
    }

    default:
      return state;
  }
};

export const selectNotifications = state => state.notifications.notifications;

export const selectComments = createSelector(
  selectNotifications,
  notifications => notifications.byType.comment
);

export const selectUnreadCount = createSelector(selectComments, comments =>
  comments.reduce(
    (count, notification) => count + (notification.readAt ? 0 : 1),
    0
  )
);

const banner = (
  state = {
    visible: true,
    displaySignUpBanner: false,
    displaySubscriptionBanner: false
  },
  { type }
) => {
  switch (type) {
    case NOTIFICATIONS_BANNER_HIDE: {
      return { ...state, visible: false };
    }
    default:
      return state;
  }
};

const selectBannerVisible = state => state.notifications.banner.visible;

export const selectBanner = createSelector(
  selectBannerVisible,
  selectNotifications,
  (visible, notifications) => {
    if (!visible) return null;

    const banners = notifications.byType.banner || [];
    const filteredBanners = banners.filter(banner => !banner.readAt);

    return filteredBanners[0] || null;
  }
);

export default combineReducers({
  notifications,
  banner
});
