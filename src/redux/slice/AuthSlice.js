import { createSlice } from '@reduxjs/toolkit'
import Loading from '../../module/client-module/loading/Loading';



const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    login: false,
    role: null,
    loading: true,
    active: null,
    email: null,
    loginShipper: false
  },
  reducers: {
    LOGIN: (state, action) => {
      let { token, role, active } = action.payload
      localStorage.setItem("token", token)
      if (token) {
        state.login = true;
        state.role = role;
        state.active = active
      }
    },
    SET_LOGIN: (state, action) => {

      let token = localStorage.getItem("token")
      let { role, email } = action.payload
      if (token) {
        console.log("co token");
        state.role = role
        state.login = true;
        state.email = email
      }

    },
    LOGOUT: (state) => {
      let token = localStorage.getItem("token")
      if (token) {
        localStorage.removeItem("token")
        state.login = false;
      }
    },
    IN_LOADING: (state) => {
      state.loading = true;
    },
    OUT_LOADING: (state) => {
      console.log("out loading");
      state.loading = false;
    },
    LOGIN_SHIPPER: (state, action) => {
      let { token, role, active, email } = action.payload
      localStorage.setItem("token", token)
      if (token) {
        state.loginShipper = true;
        state.role = role;
        state.active = active
        state.email = email
      }
    },
  }
});

export const { LOGIN, LOGOUT, SET_LOGIN, IN_LOADING, OUT_LOADING, LOGIN_SHIPPER } = AuthSlice.actions

export default AuthSlice.reducer