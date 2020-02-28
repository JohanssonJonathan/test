import {
  SUBSCRIPTION_LOAD,
  SUBSCRIPTION_LOAD_SUCCESS,
  SUBSCRIPTION_LOAD_ERROR,
  SUBSCRIPTION_LOAD_PLANS_SUCCESS
} from '../../constants/actions';

const subscriptions = (
  state = {
    loading: false,
    subscription: null,
    error: null,
    plans: null
  },
  { type, payload }
) => {
  switch (type) {
    case SUBSCRIPTION_LOAD: {
      return { ...state, loading: true };
    }
    case SUBSCRIPTION_LOAD_SUCCESS: {
      return { ...state, subscription: payload, loading: false };
    }
    case SUBSCRIPTION_LOAD_ERROR: {
      return { ...state, error: payload, loading: false };
    }
    case SUBSCRIPTION_LOAD_PLANS_SUCCESS: {
      return { ...state, plans: payload.plans };
    }
    default:
      return state;
  }
};

export const loadingSubscriptions = state => state.subscriptions.loading;
export const selectSubscription = state => state.subscriptions.subscription;
export const selectPlans = state => state.subscriptions.plans;

export default subscriptions;
