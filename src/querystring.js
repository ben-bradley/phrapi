'use strict';

export default function(url) {
  return url
    .substr(url.indexOf('?') + 1)
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
