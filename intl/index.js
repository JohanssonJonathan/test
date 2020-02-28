import UserLanguages from 'react-native-languages';
import { addLocaleData } from 'react-intl';


import da from './da';
import en from './en';
import sv from './sv';

let settings;


for (let i = 0, lang; (lang = UserLanguages.languages[i]); i++) {
  console.log('""""""""""""""""""""""""->', lang);
  if (settings) {
    break;
  }

  if (lang.indexOf('sv') === 0) {
    // addLocaleData(require('react-intl/locale-data/sv'));
    settings = {
      locale: 'sv',
      messages: {
        ...en,
        ...sv
      }
    };
  } else if (lang.indexOf('da') === 0) {
    // addLocaleData(require('react-intl/locale-data/da'));
    settings = {
      locale: 'da',
      messages: {
        ...en,
        ...sv,
        ...da
      }
    };
  }
}

if (!settings) {
  settings = {
    locale: 'en',
    messages: {
      ...sv,
      ...en
    }
  };
}

export const locale = settings.locale;
export const messages = settings.messages;
