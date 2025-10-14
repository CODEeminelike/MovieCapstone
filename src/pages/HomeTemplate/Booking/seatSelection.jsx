// components/SeatSelection.js
import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRoomData,
  toggleSeatSelection,
  bookTickets,
} from "./seatSlice";
import AlertError from "../../../components/alertError";

const SeatSelection = () => {
  const { maLichChieu } = useParams();
  const dispatch = useDispatch();
  const {
    data: roomData,
    loading,
    selectedSeats,
  } = useSelector((state) => state.seatSlice);
  const [email, setEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const isLogin = useSelector((state) => state.authUserReducer.data);

  // Thêm vào sau khai báo isLogin
  if (!isLogin) {
    return <Navigate to="/login" />;
  }

  // Fetch room data khi component mount
  useEffect(() => {
    if (maLichChieu) {
      dispatch(fetchRoomData(maLichChieu));
    }
  }, [maLichChieu, dispatch]);

  // Xử lý chọn ghế
  const handleSeatSelect = (seat) => {
    if (seat.daDat) return;
    dispatch(toggleSeatSelection(seat));
  };

  // Tính tổng tiền
  const totalPrice = selectedSeats.reduce(
    (total, seat) => total + seat.giaVe,
    0
  );

  // Xử lý đặt vé
  const handleBookTickets = () => {
    if (selectedSeats.length === 0) return;

    if (!showEmailForm) {
      setShowEmailForm(true);
      return;
    }

    if (!email) {
      alert("Vui lòng nhập email!");
      return;
    }

    const bookingData = {
      maLichChieu: parseInt(maLichChieu),
      danhSachVe: selectedSeats.map((seat) => ({
        maGhe: seat.maGhe,
        giaVe: seat.giaVe,
      })),
      taiKhoanNguoiDung: email, // Lưu email vào tài khoản người đặt
    };

    dispatch(bookTickets(bookingData));
  };

  // Render ghế theo loại
  const renderSeat = (seat) => {
    const isSelected = selectedSeats.some(
      (selected) => selected.maGhe === seat.maGhe
    );
    const isVip = seat.loaiGhe === "Vip";

    let seatClass =
      "w-8 h-8 rounded text-xs font-medium flex items-center justify-center ";

    if (seat.daDat) {
      seatClass += "bg-red-500 text-white cursor-not-allowed ";
    } else if (isSelected) {
      seatClass += "bg-green-500 text-white hover:bg-green-600 ";
    } else if (isVip) {
      seatClass += "bg-yellow-500 text-white hover:bg-yellow-600 ";
    } else {
      seatClass += "bg-gray-200 text-gray-700 hover:bg-gray-300 ";
    }

    return (
      <button
        key={seat.maGhe}
        className={seatClass}
        onClick={() => handleSeatSelect(seat)}
        disabled={seat.daDat}
        title={`Ghế ${seat.tenGhe} - ${seat.giaVe.toLocaleString()}đ`}
      >
        {seat.tenGhe}
      </button>
    );
  };

  // Tạo layout ghế (giả sử mỗi hàng 10 ghế)
  const renderSeatLayout = () => {
    if (!roomData?.danhSachGhe) return null;

    const seatsPerRow = 10;
    const rows = [];

    for (
      let i = 0;
      i < roomData.danhSachGhe.length;
      i += seatsPerRow
    ) {
      const rowSeats = roomData.danhSachGhe.slice(i, i + seatsPerRow);
      const rowNumber = Math.floor(i / seatsPerRow) + 1;

      rows.push(
        <div
          key={rowNumber}
          className="flex items-center justify-center space-x-2 mb-2"
        >
          <span className="w-6 text-sm font-medium text-gray-600">
            {rowNumber}
          </span>
          {rowSeats.map(renderSeat)}
        </div>
      );
    }

    return rows;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Đang tải thông tin phòng vé...
          </p>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Không thể tải thông tin phòng vé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header thông tin phim */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start space-x-4">
            <img
              src={roomData.thongTinPhim.hinhAnh}
              alt={roomData.thongTinPhim.tenPhim}
              className="w-20 h-28 object-cover rounded"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {roomData.thongTinPhim.tenPhim}
              </h1>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Rạp:</span>{" "}
                  {roomData.thongTinPhim.tenCumRap}
                </div>
                <div>
                  <span className="font-semibold">Phòng chiếu:</span>{" "}
                  {roomData.thongTinPhim.tenRap}
                </div>
                <div>
                  <span className="font-semibold">Ngày:</span>{" "}
                  {roomData.thongTinPhim.ngayChieu}
                </div>
                <div>
                  <span className="font-semibold">Giờ:</span>{" "}
                  {roomData.thongTinPhim.gioChieu}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">Địa chỉ:</span>{" "}
                  {roomData.thongTinPhim.diaChi}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Phần chọn ghế */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-8">
                <div className="h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-800">
                  MÀN HÌNH
                </h2>
              </div>

              {/* Layout ghế */}
              <div className="flex justify-center">
                <div className="max-w-2xl">{renderSeatLayout()}</div>
              </div>

              {/* Chú thích */}
              <div className="mt-8 flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span>Ghế thường</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Ghế VIP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Đang chọn</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Đã đặt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Phần thông tin đặt vé */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin đặt vé
              </h3>

              {/* Danh sách ghế đã chọn */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  Ghế đã chọn:
                </h4>
                {selectedSeats.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Chưa chọn ghế nào
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedSeats.map((seat) => (
                      <div
                        key={seat.maGhe}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          Ghế {seat.tenGhe} (
                          {seat.loaiGhe === "Vip" ? "VIP" : "Thường"})
                        </span>
                        <span>{seat.giaVe.toLocaleString()}đ</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tổng tiền */}
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">
                    {totalPrice.toLocaleString()}đ
                  </span>
                </div>
              </div>

              {/* Form nhập email */}
              {showEmailForm && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email nhận hóa đơn *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Hóa đơn sẽ được gửi đến email này
                  </p>
                </div>
              )}

              {/* Nút đặt vé */}
              <button
                onClick={handleBookTickets}
                disabled={selectedSeats.length === 0}
                className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
                  selectedSeats.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {showEmailForm
                  ? "XÁC NHẬN ĐẶT VÉ"
                  : "TIẾP TỤC ĐẶT VÉ"}
              </button>

              {/* Thông báo số ghế đã chọn */}
              {selectedSeats.length > 0 && !showEmailForm && (
                <p className="text-sm text-gray-600 mt-3 text-center">
                  Đã chọn {selectedSeats.length} ghế
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
