import pathToRegexp from 'path-to-regexp';

const urls = [
  ['/about', 'About'],
  ['/register', 'SignUp'],
  ['/signup', 'SignUp'],
  ['/me', 'Profile'],

  ['/reading-plans', 'PlanBrowser.Home'],
  ['/reading-plans/top', 'PlanBrowser.PopularPlans'],
  ['/reading-plans/new', 'PlanBrowser.NewPlans'],
  ['/reading-plans/categories/:categoryId', 'PlanBrowser.CategoryPlans'],
  ['/reading-plans/campaign/:campaignId', 'PlanBrowser.Campaign'],
  ['/reading-plans/:planId', 'PlanBrowser.PlanDetail'],

  ['/my-plans/:planId/:stepId', 'Read.Step'],

  [('/subscription', '')],
  ['/donation', 'Donation'],
  ['/checkout', '']
];

const patterns = urls.map(([pattern, screen]) => {
  let keys = []; // pathToRegexp will mutate this and add all keys from the pattern
  const re = pathToRegexp(pattern, keys);
  return [re, screen, keys];
});

export default path => {
  if (path.indexOf('/') !== 0) {
    path = '/' + path;
  }

  let params;
  const match = patterns.find(pattern => !!(params = pattern[0].exec(path)));

  if (match) {
    const props = match[2].reduce((mem, key, i) => {
      mem[key.name] = decodeURIComponent(params[i + 1]);
      return mem;
    }, {});

    return {
      path,
      props,
      screen: match[1]
    };
  }

  return null;
};
