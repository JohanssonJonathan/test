import { createLoadAction } from '../lib/rest-helpers';
import {
  SUBSCRIPTION_LOAD,
  SUBSCRIPTION_LOAD_SUCCESS,
  SUBSCRIPTION_LOAD_ERROR,
  SUBSCRIPTION_RENEW,
  SUBSCRIPTION_RENEW_SUCCESS,
  SUBSCRIPTION_RENEW_ERROR,
  SUBSCRIPTION_LOAD_PLANS,
  SUBSCRIPTION_LOAD_PLANS_SUCCESS,
  SUBSCRIPTION_LOAD_PLANS_ERROR
} from '../constants/actions';

export const loadSubscription = createLoadAction({
  path: '/subscriptions/subscription',
  load: SUBSCRIPTION_LOAD,
  success: SUBSCRIPTION_LOAD_SUCCESS,
  error: SUBSCRIPTION_LOAD_ERROR
});

export const renewSubscription = subscription => dispatch =>
  dispatch(
    createLoadAction({
      path: '/subscriptions/subscription',
      load: SUBSCRIPTION_RENEW,
      success: SUBSCRIPTION_RENEW_SUCCESS,
      error: SUBSCRIPTION_RENEW_ERROR
    })({
      method: 'put',
      body: { ...subscription, autoRenew: true }
    })
  );

export const loadPlans = createLoadAction({
  path: '/subscriptions/plans',
  load: SUBSCRIPTION_LOAD_PLANS,
  success: SUBSCRIPTION_LOAD_PLANS_SUCCESS,
  error: SUBSCRIPTION_LOAD_PLANS_ERROR
});
