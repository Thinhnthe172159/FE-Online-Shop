import { createSlice } from '@reduxjs/toolkit'
const ForgotPasswordSlice = createSlice({
  name: "forgot",
  initialState: {
        email:null
  },
  reducers: {
    SAVE_EMAIL: (state, action) => {
      console.log(action);
      
      state.email = action.payload;
    },
    DELETE_EMAIL: (state, action) => {
      state.email = null;
    }
  }
});

export const {SAVE_EMAIL, DELETE_EMAIL} = ForgotPasswordSlice.actions

export default ForgotPasswordSlice.reducer