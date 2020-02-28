/**
 * @format
 */

import React from 'react';
import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import App from './App.js';
import {Text, Linking} from 'react-native';
import {IntlProvider} from 'react-intl';
// import {locale, messages} from './intl';
// import {iconsLoadPromise} from './components/UI/icons';
// import { handleUrl } from './actions/links';

import store from './store';

function ReduxProvider(Component) {
  return props => (
    <Provider store={store.store}>
      {/* <IntlProvider locale={locale} messages={messages} textComponent={Text}> */}
        <Component {...props} />
      {/* </IntlProvider> */}
    </Provider>
  );
}

Linking.addEventListener('url', event => {
  // Setup regex based on type of link
  const regex = event.url.startsWith('https')
    ? /^https*:\/\/[\w.]+\//
    : /^(\w+:\/*)/;
  console.log('Parsing url:', event.url);
  const parsedUrl = event.url.replace(regex, '');
  console.log('Clean url:', parsedUrl);

  // Dispatch url based actions
  store.dispatch(handleUrl(parsedUrl));

  // Allow other windows to respond
  Navigation.handleDeepLink({
    link: parsedUrl,
  });
});
const IntlWithRedux = ({children, store, ...props}) => {
  console.log('props :', JSON.stringify(store));
  return (
    <Provider store={store}>
      <IntlProvider locale={locale} messages={messages} textComponent={Text}>
        {children}
      </IntlProvider>
    </Provider>
  );
};

Navigation.registerComponent(
  'Home',
  () => ReduxProvider(App),
  () => App,
);

// const addScreen = (key, Component) => {
//   Navigation.registerComponentWithRedux(key, () => Component, IntlWithRedux, store);
// };
// const addScreens = (ns, screens) => {
//   Object.keys(screens).forEach(key => addScreen(`${ns}.${key}`, screens[key]));
// };

// addScreens('Home', App);
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'Home',
      },
    },
  });
});
