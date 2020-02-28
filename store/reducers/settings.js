import {
  SETTINGS_LOAD,
  SETTINGS_LOAD_SUCCESS,
  SETTINGS_LOAD_ERROR,
  UPDATE_SETTINGS_SUCCESS
} from '../../constants/actions';

const settings = (
  state = {
    loading: true,
    settings: null,
    error: null
  },
  { type, payload }
) => {
  switch (type) {
    case SETTINGS_LOAD:
      return { ...state, loading: true };
    case SETTINGS_LOAD_SUCCESS:
      return { ...state, loading: false, settings: payload };
    case SETTINGS_LOAD_ERROR:
      return { ...state, loading: false, error: payload };
    case UPDATE_SETTINGS_SUCCESS:
      return { ...state, settings: { ...state.settings, ...payload } };
    default:
      return state;
  }
};

export const selectSettings = state => state.settings.settings;

export default settings;
