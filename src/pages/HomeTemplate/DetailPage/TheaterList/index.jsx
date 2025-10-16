import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { fetchMovieTheaters } from "./theaterSlice";

const TheaterList = ({ movieId }) => {
  const [selectedTheaterSystem, setSelectedTheaterSystem] =
    useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const {
    data: theaters,
    loading,
    error,
  } = useSelector((state) => state.theaterSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovieTheaters(movieId));
    }
  }, [movieId, dispatch]);

  // Lấy danh sách ngày chiếu duy nhất từ tất cả lịch chiếu (sử dụng YYYY-MM-DD)
  const getUniqueDates = () => {
    if (!theaters?.heThongRapChieu) return [];

    const allDates = theaters.heThongRapChieu.flatMap((system) =>
      system.cumRapChieu.flatMap((theater) =>
        theater.lichChieuPhim.map(
          (schedule) => schedule.ngayChieuGioChieu.split("T")[0] // Lấy YYYY-MM-DD
        )
      )
    );

    return [...new Set(allDates)].sort();
  };

  const uniqueDates = getUniqueDates();

  // Lọc lịch chiếu theo rạp và ngày (so sánh YYYY-MM-DD)
  const filteredSchedules =
    selectedTheater?.lichChieuPhim?.filter(
      (schedule) =>
        !selectedDate ||
        schedule.ngayChieuGioChieu.split("T")[0] === selectedDate
    ) || [];

  // Format thời gian
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format ngày đầy đủ từ datetime
  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format ngày ngắn cho tabs từ YYYY-MM-DD
  const formatShortDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return `${date.toLocaleDateString("vi-VN", {
      weekday: "short",
    })} ${day}/${month}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-red-600 text-center">
        Lỗi khi tải thông tin rạp chiếu: {error.message}
      </div>
    );
  }

  if (!theaters?.heThongRapChieu?.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-gray-500 text-center">
        Chưa có lịch chiếu cho phim này
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          Lịch Chiếu & Rạp
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Chọn rạp và suất chiếu phù hợp
        </p>
      </div>

      <div className="p-6">
        {/* Chọn hệ thống rạp */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Chọn hệ thống rạp
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {theaters.heThongRapChieu.map((system) => (
              <button
                key={system.maHeThongRap}
                onClick={() => {
                  setSelectedTheaterSystem(system);
                  setSelectedTheater(null);
                  setSelectedDate(null);
                }}
                className={`p-4 rounded-lg border transition-all ${
                  selectedTheaterSystem?.maHeThongRap ===
                  system.maHeThongRap
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:shadow"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={system.logo}
                    alt={system.tenHeThongRap}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="font-medium text-gray-900">
                    {system.tenHeThongRap}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chọn cụm rạp (nếu đã chọn hệ thống) */}
        {selectedTheaterSystem && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chọn cụm rạp - {selectedTheaterSystem.tenHeThongRap}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedTheaterSystem.cumRapChieu.map((theater) => (
                <button
                  key={theater.maCumRap}
                  onClick={() => {
                    setSelectedTheater(theater);
                    setSelectedDate(null);
                  }}
                  className={`p-4 rounded-lg border transition-all text-left ${
                    selectedTheater?.maCumRap === theater.maCumRap
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:shadow"
                  }`}
                >
                  <h4 className="font-medium text-gray-900 mb-1">
                    {theater.tenCumRap}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {theater.diaChi}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {theater.lichChieuPhim.length} suất chiếu
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lịch chiếu (nếu đã chọn cụm rạp) */}
        {selectedTheater && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Lịch chiếu - {selectedTheater.tenCumRap}
            </h3>

            {/* Tabs ngày chiếu */}
            {uniqueDates.length > 0 && (
              <div className="mb-6 overflow-x-auto">
                <div className="flex space-x-2 min-w-max">
                  {uniqueDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                        selectedDate === date
                          ? "bg-blue-500 text-white shadow"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {formatShortDate(date)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Danh sách suất chiếu */}
            {filteredSchedules.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredSchedules.map((schedule) => (
                  // Trong phần danh sách suất chiếu, sửa NavLink thành:
                  <NavLink
                    key={schedule.maLichChieu}
                    to={`/booking/${schedule.maLichChieu}`} // Đường dẫn tương đối
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center block"
                  >
                    <div className="text-lg font-bold text-gray-900">
                      {formatTime(schedule.ngayChieuGioChieu)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatFullDate(schedule.ngayChieuGioChieu)}
                    </div>
                    <div className="text-sm text-green-600 font-medium mt-2">
                      {schedule.giaVe.toLocaleString("vi-VN")} đ
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {schedule.tenRap} • {schedule.thoiLuong} phút
                    </div>
                  </NavLink>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                Không có suất chiếu cho ngày này
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TheaterList;
