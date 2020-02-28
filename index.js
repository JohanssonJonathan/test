/**
 * @format
 */

import React from 'react';
import {Navigation} from 'react-native-navigation';
import App from './App.js';
import store from './store';



const IntlWithRedux = ({children, ...props}) => (
    <Provider store={props.store}>
      {/* <IntlProvider locale={locale} messages={messages} textComponent={Text}> */}
      {children}
      {/* </IntlProvider> */}
    </Provider>
  );

Navigation.registerComponent('Home', () => App);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'Home',
      },
    },
  });
});
