import { toggleAdd, toggleEdit, toggleDelete, toggleView } from '../reduxAdmin/slices/actionsSlice';

export const handleAction = (action, dispatch, currentState) => {
  const { add, edit, del, view } = currentState;

  switch (action) {
    case 'add':
      dispatch(toggleAdd());
      break;
    case 'edit':
      dispatch(toggleEdit());
      break;
    case 'delete':
      dispatch(toggleDelete());
      break;
    case 'view':
      dispatch(toggleView());
      break;
    default:
      console.error('Hành động không hợp lệ:', action);
      break;
  }
};
