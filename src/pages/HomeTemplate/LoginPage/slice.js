import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storage } from "../../../helpers/localStorageHelper";
import { userApi } from "../../../services/apiService";

const initialState = {
  loading: false,
  data: storage.get("USER_INFO"),
  error: null,
};

export const authUserLogin = createAsyncThunk(
  "authUserLogin",
  async (user, { rejectWithValue }) => {
    try {
      const response = await userApi.post(
        "QuanLyNguoiDung/DangNhap",
        user
      );

      const userExits = response.data.content;

      storage.save("USER_INFO", userExits);
      return userExits;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data || error.message,
        status: error.response?.status,
      });
    }
  }
);

const authUserReducer = createSlice({
  name: "authUserReducer",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.error = null;
      storage.remove("USER_INFO");
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authUserLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(authUserLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });

    builder.addCase(authUserLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});
export const { logout } = authUserReducer.actions;
export default authUserReducer.reducer;
