import {
  PB_LOAD_HOME,
  PB_LOAD_HOME_SUCCESS,
  PB_LOAD_HOME_ERROR,
  PB_LOAD_CATEGORY,
  PB_LOAD_CATEGORY_SUCCESS,
  PB_LOAD_CATEGORY_ERROR,
  PB_LOAD_CAMPAIGNS,
  PB_LOAD_CAMPAIGNS_SUCCESS,
  PB_LOAD_CAMPAIGNS_ERROR,
  PB_LOAD_CAMPAIGN,
  PB_LOAD_CAMPAIGN_SUCCESS,
  PB_LOAD_CAMPAIGN_ERROR,
  PB_LOAD_TRANSLATIONS,
  PB_LOAD_TRANSLATIONS_SUCCESS,
  PB_LOAD_TRANSLATIONS_ERROR,
  PB_LOAD_LANGUAGES,
  PB_LOAD_LANGUAGES_SUCCESS,
  PB_LOAD_LANGUAGES_ERROR
} from '../constants/actions';
import { createLoadAction } from '../lib/rest-helpers';

export const loadHome = createLoadAction({
  path: '/plans/home',
  load: PB_LOAD_HOME,
  success: PB_LOAD_HOME_SUCCESS,
  error: PB_LOAD_HOME_ERROR
});

export const loadCategory = id =>
  createLoadAction({
    path: `/categories/${id}`,
    load: PB_LOAD_CATEGORY,
    success: PB_LOAD_CATEGORY_SUCCESS,
    error: PB_LOAD_CATEGORY_ERROR
  })({ id });

export const loadCampaigns = createLoadAction({
  path: '/campaigns',
  load: PB_LOAD_CAMPAIGNS,
  success: PB_LOAD_CAMPAIGNS_SUCCESS,
  error: PB_LOAD_CAMPAIGNS_ERROR
});

export const loadCampaign = id =>
  createLoadAction({
    path: `/campaigns/${id}`,
    load: PB_LOAD_CAMPAIGN,
    success: PB_LOAD_CAMPAIGN_SUCCESS,
    error: PB_LOAD_CAMPAIGN_ERROR
  })({ id });

export const loadTranslations = createLoadAction({
  path: '/bible-translations',
  load: PB_LOAD_TRANSLATIONS,
  success: PB_LOAD_TRANSLATIONS_SUCCESS,
  error: PB_LOAD_TRANSLATIONS_ERROR
});

export const loadLanguages = createLoadAction({
  path: '/languages',
  load: PB_LOAD_LANGUAGES,
  success: PB_LOAD_LANGUAGES_SUCCESS,
  error: PB_LOAD_LANGUAGES_ERROR
});
