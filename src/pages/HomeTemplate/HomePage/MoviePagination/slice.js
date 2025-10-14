import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { guestApi } from "@/services/apiService.js";
const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const fetchMoviesWithPagination = createAsyncThunk(
  "fetchMoviesWithPagination",
  async (soTrang, { rejectWithValue }) => {
    try {
      const response = await guestApi.get(
        `QuanLyPhim/LayDanhSachPhimPhanTrang?maNhom=GP01&soTrang=${soTrang}&soPhanTuTrenTrang=10`
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

const moviesWithPaginationReducer = createSlice({
  name: "moviesWithPaginationReducer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMoviesWithPagination.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchMoviesWithPagination.fulfilled,
      (state, action) => {
        state.loading = false;
        state.data = action.payload;
      }
    );

    builder.addCase(
      fetchMoviesWithPagination.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export {};
export default moviesWithPaginationReducer.reducer;
