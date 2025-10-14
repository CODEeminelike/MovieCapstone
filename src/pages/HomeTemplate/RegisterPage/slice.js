import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { storage } from "../../../helpers/localStorageHelper";
import { userApi } from "../../../services/apiService";

const initialState = {
  loading: false,
  data: storage.get("USER_INFO"),
  error: null,
};

export const authUserRegister = createAsyncThunk(
  "authUserRegister",
  async (user, { rejectWithValue }) => {
    try {
      const response = await userApi.post(
        "QuanLyNguoiDung/DangKy",
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

const authUserRegisterReducer = createSlice({
  name: "authUserRegisterReducer",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authUserRegister.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(authUserRegister.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });

    builder.addCase(authUserRegister.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default authUserRegisterReducer.reducer;
