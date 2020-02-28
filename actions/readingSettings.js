import { SET_FONT_SIZE, SET_LINE_HEIGHT } from '../constants/actions';

export const setFontSize = fontSize => ({
  type: SET_FONT_SIZE,
  payload: fontSize
});

export const setLineHeight = lineHeight => ({
  type: SET_LINE_HEIGHT,
  payload: lineHeight
});
