import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    shop: null
}

const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    SET_SHOP: (state, payload) =>{
        state.shop = payload.payload.shop
    }
  }
});

export const {SET_SHOP} = ChatSlice.actions

export default ChatSlice.reducer