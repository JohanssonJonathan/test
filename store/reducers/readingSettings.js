import { SET_FONT_SIZE, SET_LINE_HEIGHT } from '../../constants/actions';

const settings = (
  state = {
    fontSize: 3,
    lineHeight: 2
  },
  { type, payload }
) => {
  switch (type) {
    case SET_FONT_SIZE:
      return { ...state, fontSize: payload };
    case SET_LINE_HEIGHT:
      return { ...state, lineHeight: payload };
    default:
      return state;
  }
};

export const selectReadingSettings = state => state.readingSettings;

export default settings;
