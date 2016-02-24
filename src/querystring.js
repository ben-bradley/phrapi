'use strict';

export default function(url) {
  let query = url.split('?')[1];
  
  if (!query)
    return {};

  return query
    .split('&')
    .reduce((qs, pair) => {
      let [ key, value ] = pair.split('=');

      if (qs[key] && Array.isArray(qs[key]))
        qs[key].push(value);
      else if (qs[key])
        qs[key] = [ qs[key], value ];
      else
        qs[key] = value;

      return qs;
    }, {});
}
