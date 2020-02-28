import { getToken } from './auth-token';

export function encodeQueryString(obj) {
  const queryString =
    typeof obj === 'object' &&
    !!obj &&
    Object.keys(obj)
      .filter(k => obj[k])
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
      .join('&');

  return queryString ? '?' + queryString : '';
}

const sendRequest = (url, options) => {
  console.debug(options.method, url, options);
  return fetch(url, options);
};

const sendRequestWithAuth = (url, options) =>
  getToken().then(token => {
    options.headers = {
      Authorization: 'Token ' + token,
      ...options.headers
    };

    return sendRequest(url, options);
  });

const createClient = (conf = {}) => {
  let baseUrl = conf.baseUrl || '/api';
  let { defaultHeaders } = conf;

  const doFetch = (uri, options) => {
    let url = baseUrl + uri;

    // Set default headers
    options.headers = {
      Accept: 'application/json',
      ...defaultHeaders,
      ...options.headers
    };

    // Build query string if needed
    if (options.query) {
      url = url + encodeQueryString(options.query);
    }

    // Add body data
    if (options.body) {
      options.headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      if (typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);
      }
    }

    options.method = options.method || (options.body ? 'post' : 'get');

    const req = options.auth === false ? sendRequest : sendRequestWithAuth;

    return req(url, options)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          if (response.status === 204) {
            return;
          }
          return response.json();
        }
        throw response;
      })
      .then(data => console.log(data) || data)
      .catch(errorResponse => {
        const errorMessage = new Promise((resolve, reject) => {
          if (!errorResponse.json) {
            reject(errorResponse);
          }

          errorResponse.json().then(json => {
            if (json) {
              errorResponse.parsedJSON = json;
              if (json.error) {
                return resolve(json.error.message);
              }
              if (json.message) {
                return resolve(json.message);
              }
              if (json.nonFieldErrors) {
                // sign in form validation error
                return resolve(json.nonFieldErrors[0]);
              }
            }
            reject(Error('No error message in JSON response'));
          });
        });

        return errorMessage
          .catch(() => {
            if (errorResponse.statusText) {
              return errorResponse.statusText;
            } else if (errorResponse.status) {
              return 'Server returned status code ' + errorResponse.status;
            }
            return 'Request failed';
          })
          .then(message => {
            const err = new Error(message);
            err.response = errorResponse;
            throw err;
          });
      });
  };

  const configure = conf => {
    baseUrl = 'baseUrl' in conf ? conf.baseUrl : baseUrl;
    defaultHeaders =
      'defaultHeaders' in conf ? conf.defaultHeaders : defaultHeaders;
  };

  return { fetch: doFetch, configure };
};

const client = createClient();
export default client;
