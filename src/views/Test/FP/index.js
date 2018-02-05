import React from 'react';
import _curry from 'lodash/fp/curry';
import _compose from 'lodash/fp/compose';

export default () => {
  const add = _curry((x, y, z) => x + y + z);
  const mult = _curry((x, y, z) => x * y * z);

  const am = _compose(mult, add);

  console.info('add', add(1, 2, 3));
  console.info('mult', mult(4, 5, 6));

  // compose - each composed function must recieve the require number of params
  console.info('addmult', am(1, 2, 3)(4, 5));

  return <h1>{am(1, 2, 3)(4, 5)}</h1>;
};
