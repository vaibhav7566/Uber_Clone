// Redux store = global state container.

import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import rideReducer from "../features/ride/rideSlice";
import currentRideReducer from "../features/ride/currentRideSlice";
import socketReducer from "../features/socket/socketSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    ride: rideReducer, // state.ride will be managed by rideReducer
    currentRide: currentRideReducer,
    socket: socketReducer,
  },
});

