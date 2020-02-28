import { createAction } from 'redux-actions';
import RNFetchBlob from 'rn-fetch-blob';

import {
  PROFILE_LOAD,
  PROFILE_LOAD_SUCCESS,
  PROFILE_LOAD_ERROR,
  PROFILE_UPDATE,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_ERROR,
  PROFILE_REQUEST_CODE,
  PROFILE_REQUEST_CODE_SUCCESS,
  PROFILE_REQUEST_CODE_ERROR,
  PROFILE_VERIFY_CODE,
  PROFILE_VERIFY_CODE_SUCCESS,
  PROFILE_VERIFY_CODE_ERROR,
  PROFILE_GET_SIGNED_REQUEST,
  PROFILE_GET_SIGNED_REQUEST_SUCCESS,
  PROFILE_GET_SIGNED_REQUEST_ERROR,
  PROFILE_UPLOAD_IMAGE_COMPLETED,
  PROFILE_UPLOAD_IMAGE_COMPLETED_SUCCESS,
  PROFILE_UPLOAD_IMAGE_COMPLETED_ERROR,
  PROFILE_IMAGE_NOT_UPLOADED
} from '../constants/actions';
import { createLoadAction } from '../lib/rest-helpers';
import {
  resetToken,
  getTokenFromFacebookToken,
  setToken
} from '../lib/auth-token';
import { login } from '../lib/facebook';

import { resetStore, init } from './boot';

export const loadProfile = createLoadAction({
  path: '/users/me',
  load: PROFILE_LOAD,
  success: PROFILE_LOAD_SUCCESS,
  error: PROFILE_LOAD_ERROR
});

const requestCode = createLoadAction({
  path: '/auth/tokens/request',
  load: PROFILE_REQUEST_CODE,
  success: PROFILE_REQUEST_CODE_SUCCESS,
  error: PROFILE_REQUEST_CODE_ERROR
});

const verifyCode = createLoadAction({
  path: '/auth/tokens/verify',
  load: PROFILE_VERIFY_CODE,
  success: PROFILE_VERIFY_CODE_SUCCESS,
  error: PROFILE_VERIFY_CODE_ERROR
});

export const signInWithFacebook = () => dispatch =>
  login(['public_profile', 'email'])
    .then(getTokenFromFacebookToken)
    .then(() => {
      dispatch(resetStore());
      dispatch(init());
    });

export const requestSignIn = ({ email }) => dispatch =>
  dispatch(requestCode({ body: { email } }));

export const completeSignIn = ({ email, code, token }) => dispatch =>
  dispatch(verifyCode({ body: { email, code, token } }))
    .then(({ authToken }) => setToken(authToken))
    .then(() => {
      dispatch(resetStore());
      dispatch(init());
    });

export const signOut = () => dispatch =>
  resetToken().then(() => {
    dispatch(resetStore());
    dispatch(init());
  });

export const setLanguage = language =>
  createLoadAction({
    load: PROFILE_UPDATE,
    success: PROFILE_UPDATE_SUCCESS,
    error: PROFILE_UPDATE_ERROR
  })({
    path: `/users/me`,
    method: 'put',
    body: { language }
  });

export const updateProfile = ({ firstName, lastName, email }) => dispatch =>
  dispatch(
    createLoadAction({
      load: PROFILE_UPDATE,
      success: PROFILE_UPDATE_SUCCESS,
      error: PROFILE_UPDATE_ERROR
    })({
      path: `/users/me`,
      method: 'put',
      body: { firstName, lastName, email }
    })
  );

const getSignedRequest = type =>
  createLoadAction({
    load: PROFILE_GET_SIGNED_REQUEST,
    success: PROFILE_GET_SIGNED_REQUEST_SUCCESS,
    error: PROFILE_GET_SIGNED_REQUEST_ERROR
  })({
    path: `/users/me/signed-image-upload`,
    method: 'post',
    body: { name: 'profile-picture', type }
  });

const uploadCompleted = id =>
  createLoadAction({
    load: PROFILE_UPLOAD_IMAGE_COMPLETED,
    success: PROFILE_UPLOAD_IMAGE_COMPLETED_SUCCESS,
    error: PROFILE_UPLOAD_IMAGE_COMPLETED_ERROR
  })({
    path: `/users/me/signed-image-upload-complete`,
    method: 'post',
    body: { id }
  });

const imageNotUploaded = () => ({
  type: PROFILE_IMAGE_NOT_UPLOADED
});

export const uploadImage = (image, shouldUpload) => dispatch => {
  if (!shouldUpload) return dispatch(imageNotUploaded());
  return dispatch(getSignedRequest(image.mime))
    .then(signedRequest => {
      const { id, url } = signedRequest;
      RNFetchBlob.fetch(
        'PUT',
        url,
        {
          'x-amz-acl': 'public-read',
          'content-type': `${image.mime};base64` // The ;base64 append is crucial
        },
        image.data
      )
        .then(res => {
          dispatch(uploadCompleted(id)).then(() => {
            dispatch(loadProfile());
          });
        })
        .catch(err => {
          // error handling ..
          console.log('ERROR', err);
        });
    })
    .catch(err => console.log('Dead', err));
};
