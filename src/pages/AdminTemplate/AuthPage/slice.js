import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_CONFIG } from "../../../constants/constant";
import { storage } from "../../../helpers/localStorageHelper";
import { adminApi } from "../../../services/apiService";

const initialState = {
  loading: false,
  data: storage.get("ADMIN_INFO"),
  error: null,
};

export const authLogin = createAsyncThunk(
  "authLogin",
  async (user, { rejectWithValue }) => {
    try {
      const response = await adminApi.post(
        "QuanLyNguoiDung/DangNhap",
        user
      );

      const userExits = response.data.content;

      const userType = userExits.maLoaiNguoiDung?.toLowerCase();
      if (userType === "khachhang") {
        return rejectWithValue({
          response: {
            data: {
              content:
                "Bạn không có quyền truy cập hệ thống quản trị!",
            },
          },
        });
      }
      storage.save("ADMIN_INFO", userExits);
      return userExits;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data || error.message,
        status: error.response?.status,
      });
    }
  }
);

const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.error = null;
      storage.remove("ADMIN_INFO");
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(authLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });

    builder.addCase(authLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default authReducer.reducer;
