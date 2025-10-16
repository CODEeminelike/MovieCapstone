import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { guestApi } from "@/services/apiService";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const fetchMovieTheaters = createAsyncThunk(
  "theaters/fetchByMovie",
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await guestApi.get(
        `QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${movieId}`
      );
      return response.data.content;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data || error.message,
        status: error.response?.status,
      });
    }
  }
);

const theaterSlice = createSlice({
  name: "theaterReducer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovieTheaters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieTheaters.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMovieTheaters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default theaterSlice.reducer;
