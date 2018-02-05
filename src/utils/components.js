import _isNumber from 'lodash/isNumber';
import _isString from 'lodash/isString';

// if value is number add 'px'
export const numberToPixels = value => _isNumber(value) ? `${value}px` : value;

// convert string to number
export const valueToNumber = (value) => _isString(value) ? parseFloat(value) : value;

// dynamically set overflow CSS
export const setOverflow = overflow => {
  switch (overflow) {
    case 'x':
      return 'overflow: hidden; overflow-x: auto';
    case 'y':
      return 'overflow:hidden; overflow-y: auto';
    case 'hidden':
      return 'overflow: hidden';
    default:
      return 'overflow: auto';
  }
};