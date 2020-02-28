import * as Keychain from 'react-native-keychain';
import recoverToken from './recover-token';
import client from './api-client';

let token = null;

const getTokenFromKeychain = () =>
  Keychain.getGenericPassword('bibletime').then(credentials => {
    if (credentials && credentials.password) {
      return credentials.password;
    } else {
      throw new Error('No token in keychain.');
    }
  });

// Get new token from API
const requestNewToken = () =>
  client
    .fetch('/users', { method: 'POST', auth: false })
    .then(result => result.authToken);

export const setToken = newToken =>
  Keychain.setGenericPassword('token', newToken, 'bibletime').then(() => {
    token = newToken;
    return token;
  });

export const getToken = () => {
  token =
    token ||
    getTokenFromKeychain()
      .then(token => {
        console.log('Retrieved token from keychain:', token);
        return token;
      })
      .catch(() => {
        console.log('Keychain failed. Trying legacy token.');
        return recoverToken().then(token => {
          console.log('Retrieved token from legacy keychain:', token);
          return setToken(token);
        });
      })
      .catch(() => {
        console.log('Legacy token failed. Trying to request new token');
        return requestNewToken().then(token => {
          console.log('Retrieved token from server:', token);
          return setToken(token);
        });
      });
  return Promise.resolve(token);
};

export const resetToken = () =>
  Keychain.resetGenericPassword('bibletime')
    .then(requestNewToken)
    .then(setToken);

export const getTokenFromFacebookToken = accessToken =>
  client
    .fetch('/auth/tokens/from-facebook', {
      method: 'POST',
      body: {
        accessToken
      }
    })
    .then(({ key }) => {
      console.log('Got token from facebook token:', key);
      return setToken(key);
    })
    .catch(err => {
      console.log('Failed to retrieve token from facebook token:', err);
      throw new Error(err);
    });
