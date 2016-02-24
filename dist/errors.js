'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var errorMap = [
// 4xx errors follow
['badRequest', 'Bad request', 400], ['unauthorized', 'Unauthorized', 401], ['paymentRequired', 'Payment required', 402], ['forbidden', 'Forbidden', 403], ['notFound', 'Not found', 404], ['notAllowed', 'Method not allowed', 405], ['notAcceptable', 'Not acceptable', 406], ['proxyAuthRequired', 'Proxy authentication required', 407], ['requestTimeout', 'Request timeout', 408], ['conflict', 'Conflict', 409], ['gone', 'Gone', 410], ['lengthRequired', 'Length required', 411], ['preconditionFailed', 'Precondition failed', 412], ['payloadTooLarge', 'Payload too large', 413], ['uriTooLong', 'URI too long', 414], ['unsupportedMedia', 'Unsupported media type', 415], ['rangeNotSatisfiable', 'Range not satisfiable', 416], ['expectationFailed', 'Expectation failed', 417], ['teapot', 'I\'m a teapot', 418], ['misdirectedRequest', 'Misdirected request', 421], ['unprocessableEntity', 'Unprocessable entity', 422], ['locked', 'Locked', 423], ['failedDependency', 'Failed dependency', 424], ['upgradeRequired', 'Upgrade required', 426], ['preconditionRequired', 'Precondition required', 428], ['tooManyRequests', 'Too many requests', 429], ['reqHeaderTooLarge', 'Request header fields too large', 431], ['legallyUnavailable', 'Unavailable for legal reasons', 451],

// 5xx errors follow
['internalError', 'Internal server error', 500], ['notImplemented', 'Not implemented', 501], ['badGateway', 'Bad gateway', 502], ['serviceUnavailable', 'Service unavailable', 503], ['gatewayTimeout', 'Gateway timeout', 504], ['httpVersionUnsupported', 'HTTP version not supported', 505], ['variantNegotiates', 'Variant also negotiates', 506], ['insufficientStorage', 'Insufficient storage', 507], ['loopDetected', 'Loop detected', 508], ['notExtended', 'Not extended', 510], ['networkAuthRequired', 'Network authentication required', 510]];

var Errors = errorMap.reduce(function (errors, _ref) {
  var _ref2 = _slicedToArray(_ref, 3);

  var name = _ref2[0];
  var msg = _ref2[1];
  var code = _ref2[2];

  errors[name] = function (message) {
    return {
      error: new Error(message || msg),
      code: code,
      _phrapiError: true
    };
  };

  return errors;
}, {});

exports['default'] = Errors;
module.exports = exports['default'];