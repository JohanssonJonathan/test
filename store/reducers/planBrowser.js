import { combineReducers } from 'redux';

import {
  // Home
  PB_LOAD_HOME,
  PB_LOAD_HOME_SUCCESS,
  PB_LOAD_HOME_ERROR,

  // Categories
  PB_LOAD_CATEGORY,
  PB_LOAD_CATEGORY_SUCCESS,
  PB_LOAD_CATEGORY_ERROR,

  // Campaigns
  PB_LOAD_CAMPAIGNS,
  PB_LOAD_CAMPAIGNS_SUCCESS,
  PB_LOAD_CAMPAIGNS_ERROR,
  PB_LOAD_CAMPAIGN,
  PB_LOAD_CAMPAIGN_SUCCESS,
  PB_LOAD_CAMPAIGN_ERROR,

  // Single plans
  PB_LOAD_PLAN,
  PB_LOAD_PLAN_SUCCESS,
  PB_LOAD_PLAN_ERROR,

  // Translations
  PB_LOAD_TRANSLATIONS,
  PB_LOAD_TRANSLATIONS_SUCCESS,
  PB_LOAD_TRANSLATIONS_ERROR,

  // Translations
  PB_LOAD_LANGUAGES,
  PB_LOAD_LANGUAGES_SUCCESS,
  PB_LOAD_LANGUAGES_ERROR
} from '../../constants/actions';

import { listToMap, listToKeys } from '../../lib/collection-utils';

const home = (
  state = {
    newPlans: [],
    topPlans: [],
    loading: true,
    error: null
  },
  { type, payload }
) => {
  switch (type) {
    case PB_LOAD_HOME:
      return { ...state, loading: true };
    case PB_LOAD_HOME_SUCCESS:
      const { newPlans, topPlans } = payload;
      return { ...state, loading: false, newPlans, topPlans };
    case PB_LOAD_HOME_ERROR:
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};

const campaigns = (
  state = {
    items: {},
    loading: true,
    error: null,
    plans: [],
    loadingCampaign: true,
    loadingCampaignError: null
  },
  { type, payload }
) => {
  switch (type) {
    case PB_LOAD_CAMPAIGNS:
      return { ...state, loading: true };
    case PB_LOAD_CAMPAIGNS_SUCCESS:
      return { ...state, loading: false, items: payload };
    case PB_LOAD_CAMPAIGNS_ERROR:
      return { ...state, loading: false, error: payload };

    case PB_LOAD_CAMPAIGN:
      return {
        ...state,
        loadingCampaign: true,
        campaign:
          Object.values(state.items).find(c => c.id === payload.id) || null,
        plans: []
      };
    case PB_LOAD_CAMPAIGN_SUCCESS:
      return {
        ...state,
        loadingCampaign: false,
        campaign: payload.campaign,
        plans: listToKeys(payload.plans)
      };
    case PB_LOAD_CAMPAIGN_ERROR:
      return {
        ...state,
        loadingCampaign: false,
        loadingCampaignError: payload
      };
    default:
      return state;
  }
};

const categories = (
  state = {
    items: [],
    loading: true,
    error: null,
    loadingCategory: true,
    loadingCategoryError: null,
    category: null,
    plans: []
  },
  { type, payload }
) => {
  switch (type) {
    case PB_LOAD_HOME:
      return { ...state, loading: true };
    case PB_LOAD_HOME_SUCCESS:
      return { ...state, loading: false, items: payload.categories };
    case PB_LOAD_HOME_ERROR:
      return { ...state, loading: false, error: payload };

    case PB_LOAD_CATEGORY:
      return {
        ...state,
        loadingCategory: true,
        category: state.items[payload.id] || null,
        plans: []
      };
    case PB_LOAD_CATEGORY_SUCCESS:
      return {
        ...state,
        loadingCategory: false,
        category: payload.category,
        plans: listToKeys(payload.plans)
      };
    case PB_LOAD_CATEGORY_ERROR:
      return {
        ...state,
        loadingCategory: false,
        loadingCategoryError: payload
      };
    default:
      return state;
  }
};

const plans = (
  state = {
    /* id: plan */
  },
  { type, payload }
) => {
  switch (type) {
    case PB_LOAD_HOME_SUCCESS:
      return { ...state, ...listToMap(payload.plans) };
    case PB_LOAD_CAMPAIGN_SUCCESS:
      return { ...state, ...listToMap(payload.plans) };
    case PB_LOAD_CATEGORY_SUCCESS:
      return { ...state, ...listToMap(payload.plans) };
    case PB_LOAD_PLAN_SUCCESS:
      return { ...state, [payload.id]: payload };
    default:
      return state;
  }
};

const plan = (
  state = {
    planId: null,
    loading: true,
    error: null
  },
  { type, payload }
) => {
  switch (type) {
    case PB_LOAD_PLAN:
      return { ...state, loading: true };
    case PB_LOAD_PLAN_SUCCESS:
      return { ...state, loading: false, planId: payload.id };
    case PB_LOAD_PLAN_ERROR:
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};

const translations = (
  state = {
    loading: false,
    error: null,
    items: []
  },
  { type, payload }
) => {
  switch (type) {
    case PB_LOAD_TRANSLATIONS:
      return { ...state, loading: true };
    case PB_LOAD_TRANSLATIONS_SUCCESS:
      return { ...state, loading: false, items: payload };
    case PB_LOAD_TRANSLATIONS_ERROR:
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};

const languages = (
  state = {
    loading: false,
    error: null,
    items: []
  },
  { type, payload }
) => {
  switch (type) {
    case PB_LOAD_LANGUAGES:
      return { ...state, loading: true };
    case PB_LOAD_LANGUAGES_SUCCESS:
      return { ...state, loading: false, items: payload };
    case PB_LOAD_LANGUAGES_ERROR:
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};

const search = (
  state = {
    loading: false,
    error: null,
    config: {}
  },
  { type, payload }
) => {
  switch (type) {
    case PB_LOAD_HOME:
      return { ...state, loading: true };
    case PB_LOAD_HOME_SUCCESS:
      return { ...state, config: payload.search, loading: false };
    case PB_LOAD_HOME_ERROR:
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};

export default combineReducers({
  home,
  campaigns,
  categories,
  plans,
  plan,
  languages,
  translations,
  search
});

const selectPlanBrowser = state => state.planBrowser;
export const selectIsLoading = state => selectPlanBrowser(state).isLoading;

export const selectCategories = state => selectPlanBrowser(state).categories;
export const selectCampaigns = state => selectPlanBrowser(state).campaigns;
export const selectPlanById = (state, id) => selectPlanBrowser(state).plans[id];

export const selectTopPlans = (state, limit = Number.POSITIVE_INFINITY) => {
  const plans = selectPlanBrowser(state).plans;
  const ids = selectPlanBrowser(state).home.topPlans.slice(0, limit);
  return ids.map(id => plans[id]);
};
export const selectNewPlans = (state, limit = Number.POSITIVE_INFINITY) => {
  const plans = selectPlanBrowser(state).plans;
  const ids = selectPlanBrowser(state).home.newPlans.slice(0, limit);
  return ids.map(id => plans[id]);
};

export const selectTranslations = state =>
  selectPlanBrowser(state).translations.items;

export const selectLanguages = state =>
  selectPlanBrowser(state).languages.items;

export const selectSearchConfig = state =>
  selectPlanBrowser(state).search.config;
