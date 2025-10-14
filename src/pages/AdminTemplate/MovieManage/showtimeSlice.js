// src/pages/AdminTemplate/MovieManage/showtimeSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminApi } from "../../../services/apiService";

const initialState = {
  loading: false,
  theaterSystems: [],
  theaterClusters: [],
  theaters: [],
  error: null,
};

// Lấy danh sách hệ thống rạp
export const fetchTheaterSystems = createAsyncThunk(
  "showtime/fetchTheaterSystems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.get(
        "QuanLyRap/LayThongTinHeThongRap"
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

// Lấy danh sách cụm rạp theo hệ thống
export const fetchTheaterClusters = createAsyncThunk(
  "showtime/fetchTheaterClusters",
  async (maHeThongRap, { rejectWithValue }) => {
    try {
      const response = await adminApi.get(
        `QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`
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

export const createShowtime = createAsyncThunk(
  "showtime/createShowtime",
  async (showtimeData, { rejectWithValue }) => {
    try {
      // Đảm bảo data gửi lên đúng format
      const payload = {
        maPhim: showtimeData.maPhim,
        ngayChieuGioChieu: showtimeData.ngayChieuGioChieu,
        maRap: showtimeData.maRap, // Đã là string
        giaVe: showtimeData.giaVe,
      };

      console.log("Payload gửi lên API:", payload);

      const response = await adminApi.post(
        "QuanLyDatVe/TaoLichChieu",
        payload
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

const showtimeSlice = createSlice({
  name: "showtimeReducer",
  initialState,
  reducers: {
    clearTheaterClusters: (state) => {
      state.theaterClusters = [];
      state.theaters = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Theater Systems
      .addCase(fetchTheaterSystems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTheaterSystems.fulfilled, (state, action) => {
        state.loading = false;
        state.theaterSystems = action.payload;
      })
      .addCase(fetchTheaterSystems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Theater Clusters
      .addCase(fetchTheaterClusters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTheaterClusters.fulfilled, (state, action) => {
        state.loading = false;
        state.theaterClusters = action.payload;
        // Extract all theaters from clusters
        state.theaters = action.payload.flatMap((cluster) =>
          cluster.danhSachRap.map((theater) => ({
            ...theater,
            maCumRap: cluster.maCumRap,
            tenCumRap: cluster.tenCumRap,
            diaChi: cluster.diaChi,
          }))
        );
      })
      .addCase(fetchTheaterClusters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Showtime
      .addCase(createShowtime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShowtime.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createShowtime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTheaterClusters, clearError, resetLoading } =
  showtimeSlice.actions;
export default showtimeSlice.reducer;
