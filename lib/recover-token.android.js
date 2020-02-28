import { NativeModules } from 'react-native';

const recoverToken = () => NativeModules.RecoverToken.getToken();

export default recoverToken;
