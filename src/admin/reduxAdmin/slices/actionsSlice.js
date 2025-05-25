import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  add: false,
  edit: false,
  del: false,
  view: false,
};

const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
    toggleAdd(state) {
      state.add = !state.add;
    },
    toggleEdit(state) {
      state.edit = !state.edit;
    },
    toggleDelete(state) {
      state.del = !state.del;
    },
    toggleView(state) {
      state.view = !state.view;
    },
    resetState() {
      return initialState;
    },
  },
});

const { actions, reducer } = actionsSlice;
export const { toggleAdd, toggleEdit, toggleDelete, toggleView, resetState } = actions;
export default reducer;
