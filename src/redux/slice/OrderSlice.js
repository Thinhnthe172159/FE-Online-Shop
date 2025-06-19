import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: [],
  },
  reducers: {
    ADD_ORDER: (state, action) => {
      state.order = action.payload;
    },
    REMOVE_ORDER: (state) => {
      state.order = [];
    },
    UPDATE_ORDER: (state, action) => {
      state.order = action.payload; // Cập nhật toàn bộ order
    },
  },
});

export const { ADD_ORDER, REMOVE_ORDER, UPDATE_ORDER } = orderSlice.actions;

export default orderSlice.reducer;