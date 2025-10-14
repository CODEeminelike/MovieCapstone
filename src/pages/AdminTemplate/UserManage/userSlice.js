// src/pages/AdminTemplate/UserManage/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "../../../services/apiService";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

// Lấy danh sách user
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (maNhom = "GP01", { rejectWithValue }) => {
    try {
      const response = await adminApi.get(
        `QuanLyNguoiDung/TimKiemNguoiDung?MaNhom=${maNhom}`
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

// Xóa user
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (taiKhoan, { rejectWithValue }) => {
    try {
      const response = await adminApi.delete(
        `QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`
      );
      return { taiKhoan, data: response.data.content };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data || error.message,
        status: error.response?.status,
      });
    }
  }
);

// Cập nhật user
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await adminApi.post(
        `QuanLyNguoiDung/CapNhatThongTinNguoiDung`,
        userData
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

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        // Xóa user khỏi danh sách
        state.data = state.data.filter(
          (user) => user.taiKhoan !== action.payload.taiKhoan
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật user trong danh sách
        const updatedUser = action.payload;
        const index = state.data.findIndex(
          (user) => user.taiKhoan === updatedUser.taiKhoan
        );
        if (index !== -1) {
          state.data[index] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
