import { configureStore } from '@reduxjs/toolkit'
import authReduce from './slice/AuthSlice'
import orderReduce from './slice/OrderSlice'
import forgotReduce from './slice/ForgotPasswordSlice'
import chatReduce from "./slice/ChatSlice"
import voucherReducer from './slice/voucherSlice';
export const store = configureStore({
  reducer: {
    voucher: voucherReducer,
    auth : authReduce,
    order: orderReduce,
    forgot: forgotReduce,
    chat: chatReduce
  },
})