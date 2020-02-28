import { completeSignIn } from './profile';
import { acceptInvite } from './myPlans';
import { loadSubscription } from './subscriptions';

export const handleUrl = url => (dispatch, getState) => {
  if (url.match(/^invite\/[\w]+$/)) {
    dispatch(acceptInvite(url.split('/')[1]));
  } else if (url.match(/^login\/[\w]+$/)) {
    dispatch(completeSignIn({ token: url.split('/')[1] }));
  } else if (url === 'checkout/success') {
    console.log('subscriptionActions.reloadSubscriptionStatus()');
    dispatch(loadSubscription());
  } else {
    console.log('actions.openInApp(url)');
  }
};
