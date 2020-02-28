import { LoginManager, AccessToken } from 'react-native-fbsdk';

export const login = permissions =>
  LoginManager.logInWithReadPermissions(permissions).then(result => {
    if (
      result.grantedPermissions &&
      result.grantedPermissions.length === permissions.length
    ) {
      return AccessToken.getCurrentAccessToken().then(data =>
        data.accessToken.toString()
      );
    } else {
      throw new Error('Did not grant necessary permissions.');
    }
  });
