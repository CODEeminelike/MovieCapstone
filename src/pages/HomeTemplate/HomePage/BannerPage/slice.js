import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { guestApi } from "../../../../services/apiService";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const fetchData = createAsyncThunk(
  "fetchData",
  async (__, { rejectWithValue }) => {
    try {
      const response = await guestApi.get(
        "QuanLyPhim/LayDanhSachBanner"
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

const listBannerReducer = createSlice({
  name: "listBannerReducer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });

    builder.addCase(fetchData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default listBannerReducer.reducer;
