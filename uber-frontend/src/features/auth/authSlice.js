import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  role: null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    //     setCredentials()
    // Runs after login/signup success.
    // Stores:
    // user data
    // token
    // role
    // Also saves token in localStorage.

    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.role = user?.role;
      state.isAuthenticated = true;

      localStorage.setItem("token", token);
    },

    //      logout()
    // Clears everything → removes token → user logged out.

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
