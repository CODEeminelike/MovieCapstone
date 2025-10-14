// slice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminApi } from "../../../services/apiService";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const fetchMovies = createAsyncThunk(
  "movieManagement/fetchMovies",
  async (__, { rejectWithValue }) => {
    try {
      const response = await adminApi.get(
        "QuanLyPhim/LayDanhSachPhim?maNhom=GP01"
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

export const addMovie = createAsyncThunk(
  "movieManagement/addMovie",
  async (movieData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("tenPhim", movieData.tenPhim);
      formData.append("trailer", movieData.trailer);
      formData.append("moTa", movieData.moTa);
      formData.append("maNhom", "GP01");

      const ngayKhoiChieu = new Date(movieData.ngayKhoiChieu);
      const formattedDate = `${ngayKhoiChieu
        .getDate()
        .toString()
        .padStart(2, "0")}/${(ngayKhoiChieu.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${ngayKhoiChieu.getFullYear()}`;
      formData.append("ngayKhoiChieu", formattedDate);

      formData.append("sapChieu", movieData.sapChieu.toString());
      formData.append("dangChieu", movieData.dangChieu.toString());
      formData.append("hot", movieData.hot.toString());
      formData.append("danhGia", movieData.danhGia.toString());

      // File upload
      if (movieData.hinhAnh) {
        formData.append("hinhAnh", movieData.hinhAnh);
      }

      console.log("FormData gửi đi:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await adminApi.post(
        "QuanLyPhim/ThemPhimUploadHinh",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.content;
    } catch (error) {
      console.error("API Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const serverError = error.response?.data;
      let errorMessage = "Lỗi không xác định từ server";

      if (serverError) {
        errorMessage =
          serverError.message ||
          `Server error: ${serverError.statusCode} - ${JSON.stringify(
            serverError
          )}`;
      }

      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const updateMovie = createAsyncThunk(
  "movieManagement/updateMovie",
  async (movieData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("maPhim", movieData.maPhim.toString());
      formData.append("tenPhim", movieData.tenPhim);
      formData.append("trailer", movieData.trailer);
      formData.append("moTa", movieData.moTa);
      formData.append("maNhom", "GP01");

      const ngayKhoiChieu = new Date(movieData.ngayKhoiChieu);
      const formattedDate = `${ngayKhoiChieu
        .getDate()
        .toString()
        .padStart(2, "0")}/${(ngayKhoiChieu.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${ngayKhoiChieu.getFullYear()}`;
      formData.append("ngayKhoiChieu", formattedDate);

      formData.append("SapChieu", movieData.sapChieu.toString());
      formData.append("DangChieu", movieData.dangChieu.toString());
      formData.append("Hot", movieData.hot.toString());
      formData.append("danhGia", movieData.danhGia.toString());

      if (movieData.hinhAnh) {
        formData.append("hinhAnh", movieData.hinhAnh);
      }

      console.log("FormData cập nhật phim:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await adminApi.post(
        "QuanLyPhim/CapNhatPhimUpload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.content;
    } catch (error) {
      console.error("API Update Error:", error.response?.data);

      const serverError = error.response?.data;
      let errorMessage = "Lỗi không xác định từ server";

      if (serverError) {
        errorMessage =
          serverError.message ||
          `Server error: ${serverError.statusCode} - ${JSON.stringify(
            serverError
          )}`;
      }

      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const deleteMovie = createAsyncThunk(
  "movieManagement/deleteMovie",
  async (maPhim, { rejectWithValue }) => {
    try {
      const response = await adminApi.delete(
        `QuanLyPhim/XoaPhim?MaPhim=${maPhim}`
      );

      console.log("Delete API Response:", response.data);

      // Kiểm tra format response
      if (response.data.content) {
        return {
          maPhim,
          message: response.data.message,
          data: response.data.content,
        };
      } else {
        return {
          maPhim,
          message: response.data.message || "Xóa thành công",
        };
      }
    } catch (error) {
      console.error("API Delete Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });

      const serverError = error.response?.data;
      let errorMessage = "Lỗi không xác định từ server";

      if (serverError) {
        errorMessage =
          serverError.message ||
          `Lỗi ${serverError.statusCode}: ${JSON.stringify(
            serverError
          )}`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return rejectWithValue({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

const movieManagementReducer = createSlice({
  name: "movieManagementReducer",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Movie
      .addCase(addMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data && Array.isArray(state.data)) {
          state.data.push(action.payload);
        }
      })
      .addCase(addMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Movie
      .addCase(updateMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data && Array.isArray(state.data)) {
          const updatedMovie = action.payload;
          const index = state.data.findIndex(
            (movie) => movie.maPhim === updatedMovie.maPhim
          );
          if (index !== -1) {
            state.data[index] = updatedMovie;
          }
        }
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Movie
      .addCase(deleteMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data && Array.isArray(state.data)) {
          state.data = state.data.filter(
            (movie) => movie.maPhim !== action.payload.maPhim
          );
        }
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetLoading } =
  movieManagementReducer.actions;
export default movieManagementReducer.reducer;
