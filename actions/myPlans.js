import {
  PLANS_ADD_PLAN,
  PLANS_ADD_PLAN_SUCCESS,
  PLANS_ADD_PLAN_ERROR,
  PLANS_ACCEPT_INVITE,
  PLANS_ACCEPT_INVITE_SUCCESS,
  PLANS_ACCEPT_INVITE_ERROR,
  PLANS_LOAD_PLANS,
  PLANS_LOAD_PLANS_SUCCESS,
  PLANS_LOAD_PLANS_ERROR,
  PLANS_LOAD_PLAN_CONTENT,
  PLANS_LOAD_PLAN_CONTENT_SUCCESS,
  PLANS_LOAD_PLAN_CONTENT_ERROR,
  PLANS_SET_READING_STEP,
  PLANS_ARCHIVE_PLAN,
  PLANS_ARCHIVE_PLAN_SUCCESS,
  PLANS_ARCHIVE_PLAN_ERROR,
  PLANS_MARK_AS_READ,
  PLANS_MARK_AS_READ_SUCCESS,
  PLANS_MARK_AS_READ_ERROR,
  COMMENTS_LOAD,
  COMMENTS_LOAD_SUCCESS,
  COMMENTS_LOAD_ERROR,
  COMMENTS_POST_COMMENT,
  COMMENTS_POST_COMMENT_SUCCESS,
  COMMENTS_POST_COMMENT_ERROR,
  SHOW_COMMENT_INPUT,
  HIDE_COMMENT_INPUT,
  PLANS_LOAD_ARCHIVED_PLANS,
  PLANS_LOAD_ARCHIVED_PLANS_SUCCESS,
  PLANS_LOAD_ARCHIVED_PLANS_ERROR,
  PLANS_REMOVE_ARCHIVED_PLAN,
  PLANS_REMOVE_ARCHIVED_PLAN_SUCCESS,
  PLANS_REMOVE_ARCHIVED_PLAN_ERROR
} from '../constants/actions';
import { createLoadAction } from '../lib/rest-helpers';
import {
  selectMyPlans,
  selectDisplaySteps,
  selectArchivedPlans,
  selectArchivedPlanById
} from '../store/reducers/myPlans';
import { getReminders } from '../lib/reminders';
import { scheduleNotifications, clearNotifications } from '../notifications';

export const scheduleReadingReminders = () => (dispatch, getState) => {
  const steps = selectDisplaySteps(getState());

  const reminders = steps
    .map(getReminders)
    .reduce((rem, cur) => (cur ? rem.concat(cur) : rem), []);

  clearNotifications();
  scheduleNotifications(reminders);
};

const createPlanInstance = createLoadAction({
  path: '/my-plans',
  load: PLANS_ADD_PLAN,
  success: PLANS_ADD_PLAN_SUCCESS,
  error: PLANS_ADD_PLAN_ERROR
});

export const addPlan = (plan, reminders, translation) => (dispatch, getState) =>
  dispatch(
    createPlanInstance({
      body: {
        plan: plan.id,
        reminders: reminders,
        translation: translation,
        archived: false
      }
    })
  ).then(plan => {
    dispatch(
      loadPlanContent({ path: `/my-plans/${plan.id}/download-json` })
    ).then(() => dispatch(scheduleReadingReminders()));
  });

export const acceptInvite = token => (dispatch, getState) =>
  dispatch(
    createLoadAction({
      path: `/invites/${token}/accept`,
      load: PLANS_ACCEPT_INVITE,
      success: PLANS_ACCEPT_INVITE_SUCCESS,
      error: PLANS_ACCEPT_INVITE_ERROR
    })({
      method: 'post'
    })
  ).then(plan => {
    dispatch(loadPlansAndSteps()).then(() =>
      dispatch(scheduleReadingReminders())
    );
  });

const loadMyPlans = createLoadAction({
  path: '/my-plans',
  load: PLANS_LOAD_PLANS,
  success: PLANS_LOAD_PLANS_SUCCESS,
  error: PLANS_LOAD_PLANS_ERROR
});
const loadPlanContent = createLoadAction({
  load: PLANS_LOAD_PLAN_CONTENT,
  success: PLANS_LOAD_PLAN_CONTENT_SUCCESS,
  error: PLANS_LOAD_PLAN_CONTENT_ERROR
});

export const loadPlansAndSteps = () => (dispatch, getState) => {
  return dispatch(loadMyPlans())
    .then(() => {
      const plans = selectMyPlans(getState());

      plans.forEach(plan => {
        if (plan.isStale || !plan.data) {
          dispatch(
            loadPlanContent({ path: `/my-plans/${plan.data.id}/download-json` })
          );
        }
      });
    })
    .then(() => dispatch(scheduleReadingReminders()));
};

export const reloadPlan = planId => dispatch =>
  dispatch(loadMyPlans())
    .then(
      dispatch(loadPlanContent({ path: `/my-plans/${planId}/download-json` }))
    )
    .then(() => dispatch(scheduleReadingReminders()));

const markStepAsRead = (plan, step) =>
  createLoadAction({
    load: PLANS_MARK_AS_READ,
    success: PLANS_MARK_AS_READ_SUCCESS,
    error: PLANS_MARK_AS_READ_ERROR
  })({
    path: `/my-plans/${plan}/steps/${step}`,
    method: 'patch',
    body: { readAt: new Date().toISOString() },
    plan,
    step
  });

const loadComments = (plan, step) =>
  createLoadAction({
    load: COMMENTS_LOAD,
    success: COMMENTS_LOAD_SUCCESS,
    error: COMMENTS_LOAD_ERROR
  })({
    path: `/my-plans/${plan}/steps/${step}/comments`
  });

export const showCommentInput = () => ({
  type: SHOW_COMMENT_INPUT
});

export const hideCommentInput = () => ({
  type: HIDE_COMMENT_INPUT
});

let readTimer;
export const setReadingStep = (plan, step) => dispatch => {
  cancelStepReadStatusTimer();

  readTimer = setTimeout(() => {
    dispatch(markStepAsRead(plan, step)).then(() =>
      dispatch(scheduleReadingReminders())
    );
  }, 5000);

  dispatch({
    type: PLANS_SET_READING_STEP,
    payload: {
      plan,
      step
    }
  });
  return dispatch(loadComments(plan, step));
};

export const cancelStepReadStatusTimer = () => clearTimeout(readTimer);

export const archivePlan = plan =>
  createLoadAction({
    load: PLANS_ARCHIVE_PLAN,
    success: PLANS_ARCHIVE_PLAN_SUCCESS,
    error: PLANS_ARCHIVE_PLAN_ERROR
  })({
    path: `/my-plans/${plan.data.id}`,
    method: 'patch',
    body: { archived: true },
    plan
  });

const loadArchivedPlans = createLoadAction({
  path: '/archived-plans',
  load: PLANS_LOAD_ARCHIVED_PLANS,
  success: PLANS_LOAD_ARCHIVED_PLANS_SUCCESS,
  error: PLANS_LOAD_ARCHIVED_PLANS_ERROR
});

const needsContent = plan => {
  return Object.values(plan.steps)[0].title === undefined;
};

export const loadArchivedPlanSteps = planId => (dispatch, getState) => {
  const plan = selectArchivedPlanById(getState(), planId);
  if (needsContent(plan.data) || plan.isStale || !plan.data) {
    return dispatch(
      loadPlanContent({
        path: `/archived-plans/${plan.data.id}/download-json`
      })
    );
  }
};

export const loadArchivedPlansAndSteps = () => (dispatch, getState) => {
  return dispatch(loadArchivedPlans()).catch(err => {
    console.log(err);
  });
};

export const removeArchivedPlan = plan => {
  return createLoadAction({
    load: PLANS_REMOVE_ARCHIVED_PLAN,
    success: PLANS_REMOVE_ARCHIVED_PLAN_SUCCESS,
    error: PLANS_REMOVE_ARCHIVED_PLAN_ERROR
  })({
    path: `/archived-plans/${plan.id}`,
    method: 'delete'
  });
};

export const postComment = (plan, step, comment) =>
  createLoadAction({
    load: COMMENTS_POST_COMMENT,
    success: COMMENTS_POST_COMMENT_SUCCESS,
    error: COMMENTS_POST_COMMENT_ERROR
  })({
    path: `/my-plans/${plan}/steps/${step}/comments`,
    body: comment
  });
