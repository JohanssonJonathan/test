import { createAction } from 'redux-actions';
import client from './api-client';

// const createAction = (type, payload = i => i, meta = i => i) => {
//   return (...args) => {
//     return {
//       type,
//       payload: payload.apply(args),
//       meta: meta.apply(args),
//       error: payload.apply(args) instanceof Error
//     };
//   };
// };

export const createLoadAction = ({ load, success, error, path }) => {
  // Create internal actions
  const loadStart = createAction(load);
  const loadSuccess = createAction(
    success,
    ({ response }) => response,
    payload => payload
  );
  const loadError = createAction(
    error,
    ({ response }) => response,
    payload => payload
  );

  // Create final thunk action
  return (payload = {}) => (dispatch, getState) => {
    const props = { ...payload }; // avoid mutating original object to prevent nasty side effects
    props.path = props.path || path;
    dispatch(loadStart({ ...props }));

    const { query, body, method } = props;
    return client
      .fetch(props.path, { query, body, method })
      .then(response => {
        dispatch(loadSuccess({ props, response }));
        return response;
      })
      .catch(error => {
        console.warn(load, error.message, error);
        dispatch(loadError({ props, response: error }));
        throw error;
      });
  };
};
