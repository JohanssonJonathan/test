import {
  DONATION_LOAD_PRODUCTS,
  DONATION_LOAD_PRODUCTS_SUCCESS,
  DONATION_LOAD_PRODUCTS_ERROR
} from '../../constants/actions';

const donations = (
  state = {
    loading: true,
    products: []
  },
  { type, payload }
) => {
  switch (type) {
    case DONATION_LOAD_PRODUCTS: {
      return state;
    }
    case DONATION_LOAD_PRODUCTS_SUCCESS: {
      return { ...state, products: payload.products };
    }
    case DONATION_LOAD_PRODUCTS_ERROR: {
      return { ...state, error: payload };
    }
    default:
      return state;
  }
};

export const selectDonationProducts = state => state.donations.products;

export default donations;
