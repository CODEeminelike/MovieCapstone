import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { guestApi } from "@/services/apiService";
import { userApi } from "../../../services/apiService";

const initialState = {
  loading: false,
  data: null,
  error: null,
  selectedSeats: [], //  state cho ghế đã chọn
};

export const fetchRoomData = createAsyncThunk(
  "seats/fetchBySchedule",
  async (maLichChieu, { rejectWithValue }) => {
    try {
      const response = await userApi.get(
        `QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`
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

export const bookTickets = createAsyncThunk(
  "seats/bookTickets",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await userApi.post(
        "QuanLyDatVe/DatVe",
        bookingData
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

const seatSlice = createSlice({
  name: "seatReducer",
  initialState,
  reducers: {
    // Action để chọn/bỏ chọn ghế
    toggleSeatSelection: (state, action) => {
      const seat = action.payload;
      const isSelected = state.selectedSeats.some(
        (selected) => selected.maGhe === seat.maGhe
      );

      if (isSelected) {
        state.selectedSeats = state.selectedSeats.filter(
          (selected) => selected.maGhe !== seat.maGhe
        );
      } else {
        state.selectedSeats.push(seat);
      }
    },
    // Action để xóa tất cả ghế đã chọn
    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
    },
    // Action để xóa lỗi
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch room data
      .addCase(fetchRoomData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRoomData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Book tickets
      .addCase(bookTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookTickets.fulfilled, (state, action) => {
        state.loading = false;
        // Reset selected seats after successful booking
        state.selectedSeats = [];
      })
      .addCase(bookTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleSeatSelection, clearSelectedSeats, clearError } =
  seatSlice.actions;
export default seatSlice.reducer;
