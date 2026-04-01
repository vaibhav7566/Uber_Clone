import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../services/api";

export const createRide = createAsyncThunk(
  "currentRide/createRide",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post("/journey/create", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  },
);

const initialState = {
  currentRide: null,
  createStatus: "idle",
  error: null,
};

const currentRideSlice = createSlice({
  name: "currentRide",
  initialState,
  reducers: {
    clearCurrentRide(state) {
      state.currentRide = null;
      state.createStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRide.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createRide.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.currentRide = action.payload?.data || null;
      })
      .addCase(createRide.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload || { message: "Failed to create ride" };
      });
  },
});

export const { clearCurrentRide } = currentRideSlice.actions;

export default currentRideSlice.reducer;
