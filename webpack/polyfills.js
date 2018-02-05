// polyfill - babel (for lame MSIE), without this get webpack invariant error
require('babel-polyfill');

// fetch() polyfill for making API calls.
require('whatwg-fetch');

// Polyfills from CRA
if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// TODO: Remove this! DO NOT lightly use events (custom or otherwise) outside the React synthetic event system, especially for reusable components
// custom events used for cross-component actions: hide tooltips on scrolling
require('custom-event-polyfill');
