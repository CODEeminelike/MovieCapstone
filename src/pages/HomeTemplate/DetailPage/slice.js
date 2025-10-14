import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { guestApi, userApi } from "../../../services/apiService";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const fetchDetailMovie = createAsyncThunk(
  "fetchDetailMovie",
  async (id, { rejectWithValue }) => {
    try {
      const reponse = await guestApi.get(
        `QuanLyPhim/LayThongTinPhim?MaPhim=${id}`
      );
      return reponse.data.content;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data || error.message,
        status: error.response?.status,
      });
    }
  }
);

const detailReducer = createSlice({
  name: "detailReducer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDetailMovie.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchDetailMovie.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });

    builder.addCase(fetchDetailMovie.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default detailReducer.reducer;
