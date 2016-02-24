'use strict';

const params = (url, route) => {
  let matches = url.split('?')[0].match(route.regex);
  
  return route.params.reduce((params, name, i) => {
    params[name] = matches[i + 1];
    return params;
  }, {});
};

export default params;
