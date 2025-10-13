import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { storage } from "../../../helpers/localStorageHelper";
import { adminApi } from "../../../services/apiService";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const addUserService = createAsyncThunk(
  "addUserService",
  async (user, { rejectWithValue }) => {
    try {
      const response = await adminApi.post(
        `QuanLyNguoiDung/ThemNguoiDung`,
        user
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
const addUserReducer = createSlice({
  name: "addUserReducer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addUserService.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addUserService.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(addUserService.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default addUserReducer.reducer;
