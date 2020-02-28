import {
  COMMENTS_LOAD,
  COMMENTS_LOAD_SUCCESS,
  COMMENTS_LOAD_ERROR,
  COMMENTS_POST_COMMENT_SUCCESS,
  SHOW_COMMENT_INPUT,
  HIDE_COMMENT_INPUT
} from '../../constants/actions';

const comments = (
  state = {
    loading: true,
    comments: [],
    error: null,
    writingComment: false
  },
  { type, payload }
) => {
  switch (type) {
    case COMMENTS_LOAD:
      return { ...state, loading: true };
    case COMMENTS_LOAD_SUCCESS:
      return { ...state, loading: false, comments: payload };
    case COMMENTS_LOAD_ERROR:
      return { ...state, loading: false, error: payload };
    case COMMENTS_POST_COMMENT_SUCCESS: {
      const newComments = [payload, ...state.comments];
      return { ...state, comments: newComments };
    }
    case SHOW_COMMENT_INPUT: {
      return { ...state, writingComment: true };
    }
    case HIDE_COMMENT_INPUT: {
      return { ...state, writingComment: false };
    }
    default:
      return state;
  }
};

export const selectComments = state => state.comments.comments;
export const selectWritingComment = state => state.comments.writingComment;

export default comments;
