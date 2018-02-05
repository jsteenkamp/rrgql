import uuid from 'uuid';
import {getStore} from 'Store/store';
import views from 'Store/views';

// default = minimum data to create empty tab must be passed in action
const addView = ({
  id = uuid.v4(),
  display = 'tab',
  type = 'table',
  items = [],
  ...rest
}) =>
  getStore().dispatch(
    views.actions.dataLoadRequest({id, display, type, items, ...rest}),
  );

export default addView;