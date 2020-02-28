import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import { AsyncStorage } from "react-native";

import thunk from 'redux-thunk';
import rootReducer from './reducers';
const composeEnhancers =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  );

  persistStore(store, { storage: AsyncStorage, blacklist: ['notifications'] }); //.purge();

  return store;
}

export default configureStore();
