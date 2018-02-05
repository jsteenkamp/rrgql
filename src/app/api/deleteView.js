import {getStore} from 'Store/store';
import views from 'Store/views';

// default = minimum data to create empty tab must be passed in action
const deleteView = ({id}) => getStore().dispatch(views.actions.dataDelete({id}));

export default deleteView;
