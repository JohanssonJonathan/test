import { createLoadAction } from '../lib/rest-helpers';
import {
  DONATION_LOAD_PRODUCTS,
  DONATION_LOAD_PRODUCTS_SUCCESS,
  DONATION_LOAD_PRODUCTS_ERROR,
  DONATION_GET_SIGNED_LINK,
  DONATION_GET_SIGNED_LINK_SUCCESS,
  DONATION_GET_SIGNED_LINK_ERROR
} from '../constants/actions';

export const loadDonationProducts = createLoadAction({
  path: '/subscriptions/products',
  load: DONATION_LOAD_PRODUCTS,
  success: DONATION_LOAD_PRODUCTS_SUCCESS,
  error: DONATION_LOAD_PRODUCTS_ERROR
});

export const getSignedLink = url =>
  createLoadAction({
    path: '/users/me/signed-link',
    load: DONATION_GET_SIGNED_LINK,
    success: DONATION_GET_SIGNED_LINK_SUCCESS,
    error: DONATION_GET_SIGNED_LINK_ERROR
  })({
    body: { path: url }
  });
