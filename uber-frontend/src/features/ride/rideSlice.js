import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// Thunk: fetch fare, distance, duration for all vehicles
export const fetchFareData = createAsyncThunk(
    // ye string keval debugging ke liye hai, action type ko uniquely identify karta hai
  "ride/fetchFareData",
  async ({ origin, destination }, { rejectWithValue }) => {
    try {
      const res = await API.post(
        "/maps/calculate-fare/distance/time",
        {},
        {
          params: { origin, destination },
        }
      );

      return {
        fareData: res.data?.data ?? res.data,
        routeKey: `${origin}|${destination}`,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  origin: "",
  destination: "",
  originCoordinates: null,
  destinationCoordinates: null,
  fareData: null, // {distance, duration, fares[]}
  selectedVehicle: null,
  fareStatus: "idle", // idle | loading | succeeded | failed
  fareError: null,
  lastRouteKey: "",
};

const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    setRideOrigin(state, action) {
      state.origin = action.payload;
    },
    setRideDestination(state, action) {
      state.destination = action.payload;
    },
    setRideOriginCoordinates(state, action) {
      state.originCoordinates = action.payload;
    },
    setRideDestinationCoordinates(state, action) {
      state.destinationCoordinates = action.payload;
    },
    setSelectedVehicle(state, action) {
      state.selectedVehicle = action.payload;
    },
    resetFare(state) {
      state.fareData = null;
      state.fareStatus = "idle";
      state.fareError = null;
      state.selectedVehicle = null;
      state.lastRouteKey = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFareData.pending, (state) => {
        state.fareStatus = "loading";
        state.fareError = null;
      })
      .addCase(fetchFareData.fulfilled, (state, action) => {
        state.fareStatus = "succeeded";
        state.fareData = action.payload.fareData;
        state.lastRouteKey = action.payload.routeKey;
      })
      .addCase(fetchFareData.rejected, (state, action) => {
        state.fareStatus = "failed";
        state.fareError = action.payload;
      });
  },
});

export const {
  setRideOrigin,
  setRideDestination,
  setRideOriginCoordinates,
  setRideDestinationCoordinates,
  setSelectedVehicle,
  resetFare,
} = rideSlice.actions;
export default rideSlice.reducer;
