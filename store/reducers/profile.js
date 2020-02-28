import {
  PROFILE_LOAD,
  PROFILE_LOAD_SUCCESS,
  PROFILE_LOAD_ERROR,
  PROFILE_UPDATE,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_IMAGE_NOT_UPLOADED
} from '../../constants/actions';

const profile = (
  state = {
    loading: true,
    profile: {},
    error: null
  },
  { type, payload }
) => {
  switch (type) {
    case PROFILE_LOAD:
      return { ...state, loading: true };
    case PROFILE_UPDATE:
      return { ...state, loading: true };
    case PROFILE_LOAD_SUCCESS:
      return { ...state, loading: false, profile: payload };
    case PROFILE_LOAD_ERROR:
      return { ...state, loading: false, error: payload };
    case PROFILE_UPDATE_SUCCESS:
      return { ...state, profile: payload };
    case PROFILE_IMAGE_NOT_UPLOADED:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const selectProfile = state => state.profile.profile;
export const selectAuthToken = state => state.profile.authToken;
export const selectLoading = state => state.profile.loading;
export const selectIsSignedIn = state => {
  const profile = selectProfile(state);
  return profile ? profile.profileCreated : false;
};
export const selectActiveLanguage = state => selectProfile(state).language;

export default profile;
