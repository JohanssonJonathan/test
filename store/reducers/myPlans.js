import {
  PLANS_ADD_PLAN_SUCCESS,
  PLANS_LOAD_PLANS_SUCCESS,
  PLANS_LOAD_PLAN_CONTENT_SUCCESS,
  PLANS_SET_READING_STEP,
  PLANS_ARCHIVE_PLAN_SUCCESS,
  PLANS_MARK_AS_READ,
  PLANS_LOAD_ARCHIVED_PLANS,
  PLANS_LOAD_ARCHIVED_PLANS_SUCCESS,
  PLANS_LOAD_ARCHIVED_PLANS_ERROR
} from '../../constants/actions';
import { combineReducers } from 'redux';

const home = (
  state = {
    isLoading: true,
    isLoadingArchive: true
  },
  { type }
) => {
  switch (type) {
    case PLANS_LOAD_PLANS_SUCCESS:
      return { ...state, isLoading: false };
    case PLANS_LOAD_ARCHIVED_PLANS: {
      return { ...state, isLoadingArchive: true };
    }
    case PLANS_LOAD_ARCHIVED_PLANS_SUCCESS:
    case PLANS_LOAD_ARCHIVED_PLANS_ERROR: {
      return { ...state, isLoadingArchive: false };
    }
    default:
      return state;
  }
};

const plans = (
  state = {
    // [planId]: { ...plan }
  },
  { type, payload, meta }
) => {
  switch (type) {
    case PLANS_ADD_PLAN_SUCCESS: {
      return {
        ...state,
        [payload.id]: innerPlan(undefined, { type, payload })
      };
    }

    case PLANS_LOAD_PLANS_SUCCESS: {
      return payload.reduce((map, plan) => {
        map[plan.id] = innerPlan(state[plan.id], { type, payload: plan });
        return map;
      }, {});
    }

    case PLANS_LOAD_PLAN_CONTENT_SUCCESS: {
      if (state[payload.id]) {
        const nextPlan = innerPlan(state[payload.id], { type, payload });
        return { ...state, [nextPlan.data.id]: nextPlan };
      }
      return state;
    }

    case PLANS_MARK_AS_READ: {
      if (state[payload.plan]) {
        const nextPlan = innerPlan(state[payload.plan], { type, payload });
        return { ...state, [nextPlan.data.id]: nextPlan };
      }
      return state;
    }

    case PLANS_ARCHIVE_PLAN_SUCCESS: {
      return Object.values(state).reduce((map, plan) => {
        if (plan.data.id !== meta.props.plan.data.id) map[plan.data.id] = plan;
        return map;
      }, {});
    }

    default:
      return state;
  }
};

const archivedPlans = (
  state = {
    // [planId]: { ...plan }
  },
  { type, payload, meta }
) => {
  switch (type) {
    case PLANS_LOAD_ARCHIVED_PLANS: {
      return state;
    }
    case PLANS_LOAD_ARCHIVED_PLANS_SUCCESS: {
      return payload.reduce((map, plan) => {
        map[plan.id] = innerPlan(state[plan.id], { type, payload: plan });
        return map;
      }, {});
    }

    case PLANS_LOAD_PLAN_CONTENT_SUCCESS: {
      if (state[payload.id]) {
        const nextPlan = innerPlan(state[payload.id], { type, payload });
        return { ...state, [nextPlan.data.id]: nextPlan };
      }
      return state;
    }

    case PLANS_MARK_AS_READ: {
      if (state[payload.plan]) {
        const nextPlan = innerPlan(state[payload.plan], { type, payload });
        return { ...state, [nextPlan.data.id]: nextPlan };
      }
      return state;
    }

    case PLANS_ARCHIVE_PLAN_SUCCESS: {
      const arcPayload = {
        ...meta.props.plan.data,
        steps: Object.values(meta.props.plan.data.steps)
      };
      return {
        ...state,
        [payload.id]: innerPlan(undefined, {
          type,
          payload: arcPayload
        })
      };
    }

    default:
      return state;
  }
};

const mergeSteps = (existing, next) =>
  next.reduce((steps, step) => {
    const old = existing[step.id] || {};
    steps[step.id] = { ...old, ...step };
    return steps;
  }, {});

const mergeData = (existing, next) => {
  const steps = mergeSteps(
    (existing && existing.steps) || {},
    next.steps || []
  );
  return { ...existing, ...next, steps };
};

const innerPlan = (
  state = {
    isLoading: true,
    isStale: false,
    data: null
  },
  { type, payload }
) => {
  switch (type) {
    case PLANS_ARCHIVE_PLAN_SUCCESS:
    case PLANS_ADD_PLAN_SUCCESS: {
      const data = mergeData(state.data, payload);
      return { ...state, data };
    }

    case PLANS_LOAD_PLANS_SUCCESS: {
      const isStale =
        state.isStale ||
        state.data == null ||
        state.data.version !== payload.version;
      const data = mergeData(state.data, payload);

      return { ...state, isStale, data };
    }

    case PLANS_LOAD_PLAN_CONTENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isStale: false,
        data: mergeData(state.data, payload)
      };
    }

    case PLANS_LOAD_ARCHIVED_PLANS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isStale: false,
        data: mergeData(state.data, payload)
      };
    }

    case PLANS_MARK_AS_READ: {
      if (
        state.data &&
        state.data.id === payload.plan &&
        payload.step in (state.data.steps || {})
      ) {
        return {
          ...state,
          data: {
            ...state.data,
            steps: {
              ...state.data.steps,
              [payload.step]: {
                ...state.data.steps[payload.step],
                ...payload.body
              }
            }
          }
        };
      }

      return state;
    }

    default:
      return state;
  }
};

// ========== GENERAL PLANS SELECTORS ==========
const selectPlans = state => state.myPlans;
export const selectMyPlans = state => Object.values(selectPlans(state).plans);
export const selectIsLoading = state => selectPlans(state).home.isLoading;
export const selectIsLoadingArchive = state =>
  selectPlans(state).home.isLoadingArchive;
export const selectPlanById = (state, id) => selectPlans(state).plans[id];
export const selectStepById = (state, planId, stepId) => {
  return selectPlans(state).plans[planId].data.steps[stepId];
};
export const selectArchivedPlanById = (state, id) =>
  selectPlans(state).archivedPlans[id];
export const selectArchivedStepById = (state, planId, stepId) => {
  return selectPlans(state).archivedPlans[planId].data.steps[stepId];
};

export const selectArchivedPlans = state =>
  Object.values(state.myPlans.archivedPlans);

export const selectNextUnreadStep = (state, planId) => {
  const plan = selectPlanById(state, planId);

  const stepsInOrder = Object.values(plan.data.steps).sort(
    (a, b) => a.order - b.order
  );
  const stepsByReadAt = stepsInOrder
    .map((step, index) => ({
      id: step.id,
      index,
      timestamp: new Date(step.readAt).valueOf()
    }))
    .sort((a, b) => {
      if (a.timestamp !== b.timestamp) {
        // Higher timestamp first
        return b.timestamp - a.timestamp;
      } else {
        return a.index - b.index;
      }
    });

  const lastReadIndex = stepsByReadAt[0].index;
  const step = stepsInOrder.slice(lastReadIndex).find(step => !step.readAt);

  return { plan, step };
};

export const selectDisplaySteps = state => {
  const plans = selectMyPlans(state);

  return plans.map(plan => {
    let steps = plan.data && plan.data.steps;
    if (!steps || Object.keys(steps).length < 1) {
      return null;
    }

    // Sort the steps
    steps = Object.values(steps).sort((a, b) => a.order - b.order);

    startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    stepsByReadAt = steps
      .map((s, i) => {
        return {
          id: s.id,
          index: i,
          timestamp: new Date(s.readAt).valueOf()
        };
      })
      .sort((a, b) => {
        const t1 = a.timestamp;
        const t2 = b.timestamp;

        if (t1 !== t2) {
          return t2 - t1;
        }

        return a.index - b.index;
      });

    let displayStep = null;
    const mostRecentlyReadStep = stepsByReadAt[0];
    const lastReadTime = new Date(mostRecentlyReadStep.timestamp);

    // Return the current step if we read it today
    if (lastReadTime > startOfToday) {
      displayStepIndex = mostRecentlyReadStep.index;
      displayStep = steps[displayStepIndex];
    } else {
      // Try to find the next unread step, starting at the last read step
      displayStep = steps
        .slice(mostRecentlyReadStep.index)
        .find(s => !s.readAt);

      // If there are no unread steps, pick the last one
      if (displayStep == null) {
        displayStep = steps[steps.length - 1];
      }
    }

    // Count the total number of recently read steps in the plan
    // const minTimestamp = startOfToday - RECENTLY_READ_TIMEDELTA;
    // let recentlyReadStepCount = 0;
    // let totalSteps = stepsByReadAt.length;
    // while (
    //   recentlyReadStepCount < totalSteps &&
    //   stepsByReadAt.get(recentlyReadStepCount).timestamp > minTimestamp
    // ) {
    //   recentlyReadStepCount++;
    // }

    // return displayStep
    //   .set('index', steps.indexOf(displayStep))
    //   .set('recentlyReadStepCount', recentlyReadStepCount);

    return { plan, displayStep };
  });
};
// =============================================

const selected = (
  state = {
    plan: null,
    step: null
  },
  { type, payload }
) => {
  switch (type) {
    case PLANS_SET_READING_STEP:
      return { ...payload };
    case PLANS_ARCHIVE_PLAN_SUCCESS:
      return { ...state, plan: null, step: null };
    default:
      return state;
  }
};

// ========== SELECTED PLAN/STEP SELECTORS ==========

export const selectSelectedPlan = state => {
  if (state.myPlans.selected.plan)
    return selectPlanById(state, state.myPlans.selected.plan);
  return null;
};
export const selectSelectedStep = state => {
  if (state.myPlans.selected.plan && state.myPlans.selected.step)
    return selectStepById(
      state,
      state.myPlans.selected.plan,
      state.myPlans.selected.step
    );
  return null;
};

export const selectSelectedArchivedPlan = state => {
  if (state.myPlans.selected.plan)
    return selectArchivedPlanById(state, state.myPlans.selected.plan);
  return null;
};

export const selectSelectedArchivedStep = state => {
  if (state.myPlans.selected.plan && state.myPlans.selected.step)
    return selectArchivedStepById(
      state,
      state.myPlans.selected.plan,
      state.myPlans.selected.step
    );
  return null;
};

export const selectPreviewSteps = state => {
  if (state.myPlans.selected.plan && state.myPlans.selected.plan) {
    const stepIds = Object.keys(
      selectSelectedPlan(state, state.myPlans.selected.plan).data.steps
    );

    let activeIndex = stepIds.indexOf(state.myPlans.selected.step.toString());
    // If active step is the first step, render 1st, 2nd, 3rd
    if (activeIndex === 0) {
      return stepIds.slice(0, 3).map(id => {
        return selectSelectedPlan(state, state.myPlans.selected.plan).data
          .steps[parseInt(id)];
      }); // [0,1,2]
    } else if (activeIndex === stepIds.length - 1) {
      // If active step is the last one, render index -2, -1, and last
      return stepIds.slice(stepIds.length - 3, stepIds.length).map(id => {
        return selectSelectedPlan(state, state.myPlans.selected.plan).data
          .steps[parseInt(id)];
      });
    } else if (activeIndex === -1) {
      // If active step is not found, do something I guess?
      return [];
    } else {
      // Base case. Render ActiveIndex -1, ActiveIndex, ActiveIndex +1
      return stepIds.slice(activeIndex - 1, activeIndex + 2).map(id => {
        return selectSelectedPlan(state, state.myPlans.selected.plan).data
          .steps[parseInt(id)];
      });
    }
  }
  return [];
};

export default combineReducers({
  plans,
  home,
  selected,
  archivedPlans
});
