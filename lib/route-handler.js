import store from '../store';
import match from './router';

import { setReadingStep } from '../actions/myPlans';
import { selectDisplaySteps } from '../store/reducers/myPlans';

const handleDeepLink = (navigator, link, formatMessage) => {
  const matchingRoute = match(link);
  let navStyle = {};

  if (!matchingRoute || !matchingRoute.screen) {
    return;
  }

  switch (matchingRoute.screen) {
    case 'About': {
      return navigator.push({
        screen: matchingRoute.screen,
        passProps: matchingRoute.props,
        navigatorStyle: navStyle,
        title: formatMessage({ id: 'title.about' })
      });
    }
    case 'SignUp': {
      return navigator.showModal({
        screen: matchingRoute.screen,
        passProps: matchingRoute.props,
        navigatorStyle: navStyle,
        title: formatMessage({ id: 'profile.form.create' })
      });
    }
    case 'Profile': {
      return navigator.push({
        screen: matchingRoute.screen,
        passProps: matchingRoute.props,
        navigatorStyle: navStyle,
        title: formatMessage({ id: 'title.me' })
      });
    }
    case 'PlanBrowser.Home': {
      return navigator.showModal({
        screen: matchingRoute.screen,
        passProps: matchingRoute.props,
        navigatorStyle: navStyle,
        title: formatMessage({ id: 'title.planBrowser' })
      });
    }
    case 'PlanBrowser.PopularPlans': {
      return navigator.push({
        screen: matchingRoute.screen,
        passProps: matchingRoute.props,
        navigatorStyle: navStyle,
        title: formatMessage({ id: 'title.planBrowser.popular' })
      });
    }
    case 'PlanBrowser.NewPlans': {
      return navigator.push({
        screen: matchingRoute.screen,
        passProps: matchingRoute.props,
        navigatorStyle: navStyle,
        title: formatMessage({ id: 'title.planBrowser.new' })
      });
    }
    case 'PlanBrowser.CategoryPlans': {
      // Title is set using lifecycle hook
      return navigator.push({
        screen: matchingRoute.screen,
        passProps: { id: matchingRoute.props.categoryId },
        navigatorStyle: navStyle
      });
    }
    case 'PlanBrowser.Campaign': {
      // Title is set using lifecycle hook
      return navigator.push({
        screen: matchingRoute.screen,
        passProps: { id: parseInt(matchingRoute.props.campaignId) },
        navigatorStyle: navStyle
      });
    }
    case 'PlanBrowser.PlanDetail': {
      // Title is set using lifecycle hook
      return navigator.push({
        screen: matchingRoute.screen,
        passProps: { planId: matchingRoute.props.planId },
        navigatorStyle: navStyle
      });
    }
    case 'Read.Step': {
      const urlParts = link.split('/');
      const planId = matchingRoute.props.planId;
      const [stepId, commentId] = urlParts[2].split('?c=');

      const state = store.getState();
      const items = selectDisplaySteps(state);

      if (items.find(item => item.plan.data.id === parseInt(planId))) {
        // Navigate to plan if you are still following the plan
        navStyle = { ...navStyle, navBarHidden: true };
        store.dispatch(setReadingStep(planId, stepId));

        navigator.push({
          screen: matchingRoute.screen,
          passProps: { ...matchingRoute.props, commentId },
          navigatorStyle: navStyle
        });
        return navigator.dismissModal();
      }
      break;
    }
    case 'Donation': {
      return navigator.push({
        screen: matchingRoute.screen,
        passProps: matchingRoute.props,
        title: formatMessage({ id: 'title.subscriptionDonate' }),
        navigatorStyle: navStyle
      });
    }
    default:
      return navigator.push({
        screen: 'Home.MyPlans',
        passProps: {},
        navigatorStyle: navStyle,
        title: formatMessage({ id: 'title.myplans' })
      });
  }
};

export default handleDeepLink;
