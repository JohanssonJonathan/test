import * as Keychain from 'react-native-keychain';
import { NativeModules } from 'react-native';

const recoverToken = () =>
  Keychain.getGenericPassword()
    .then(credentials => {
      if (credentials && credentials.password) {
        return credentials.password;
      } else {
        throw new Error('No token in keychain.');
      }
    })
    .then(NativeModules.DecryptToken.decrypt);

export default recoverToken;
