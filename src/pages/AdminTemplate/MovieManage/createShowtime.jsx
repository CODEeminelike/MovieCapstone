import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchTheaterSystems,
  fetchTheaterClusters,
  createShowtime,
  clearTheaterClusters,
  clearError,
} from "./showtimeSlice";

export default function CreateShowtime() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { maPhim } = useParams();

  const {
    theaterSystems,
    theaterClusters,
    theaters,
    loading,
    error,
  } = useSelector((state) => state.showtimeReducer);

  const movies = useSelector(
    (state) => state.movieManagementReducer?.data || []
  );

  const [formData, setFormData] = useState({
    maPhim: parseInt(maPhim),
    maHeThongRap: "",
    maCumRap: "",
    maRap: "",
    ngayChieuGioChieu: "",
    giaVe: 75000,
  });

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [hasFetchedMovie, setHasFetchedMovie] = useState(false);
  const [availableTheaters, setAvailableTheaters] = useState([]);

  // Hàm chuyển đổi định dạng ngày giờ
  const formatDateTimeForAPI = (datetimeString) => {
    if (!datetimeString) return "";

    const date = new Date(datetimeString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Fetch movie info và hệ thống rạp khi component mount
  useEffect(() => {
    dispatch(fetchTheaterSystems());
    dispatch(clearError());
  }, [dispatch]);

  // Tách useEffect riêng để xử lý tìm phim
  useEffect(() => {
    if (
      movies &&
      Array.isArray(movies) &&
      movies.length > 0 &&
      !hasFetchedMovie
    ) {
      const movie = movies.find((m) => m.maPhim === parseInt(maPhim));
      setSelectedMovie(movie);
      setHasFetchedMovie(true);
    }
  }, [movies, maPhim, hasFetchedMovie]);

  // Khi cụm rạp thay đổi, lọc danh sách rạp khả dụng
  useEffect(() => {
    if (formData.maCumRap) {
      const filteredTheaters = theaters.filter(
        (theater) => theater.maCumRap === formData.maCumRap
      );
      setAvailableTheaters(filteredTheaters);

      // Reset maRap nếu cụm rạp thay đổi
      setFormData((prev) => ({
        ...prev,
        maRap: "",
      }));
    } else {
      setAvailableTheaters([]);
    }
  }, [formData.maCumRap, theaters]);

  // Xử lý chọn hệ thống rạp
  const handleTheaterSystemChange = (e) => {
    const maHeThongRap = e.target.value;
    setFormData((prev) => ({
      ...prev,
      maHeThongRap,
      maCumRap: "",
      maRap: "",
    }));

    if (maHeThongRap) {
      dispatch(fetchTheaterClusters(maHeThongRap));
    } else {
      dispatch(clearTheaterClusters());
      setAvailableTheaters([]);
    }
  };

  // Xử lý chọn cụm rạp
  const handleTheaterClusterChange = (e) => {
    const maCumRap = e.target.value;
    setFormData((prev) => ({
      ...prev,
      maCumRap,
      maRap: "",
    }));
  };

  // Xử lý thay đổi form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation form
  const validateForm = () => {
    if (!formData.maHeThongRap) {
      alert("Vui lòng chọn hệ thống rạp");
      return false;
    }
    if (!formData.maCumRap) {
      alert("Vui lòng chọn cụm rạp");
      return false;
    }
    if (!formData.maRap) {
      alert("Vui lòng chọn rạp");
      return false;
    }

    if (!formData.ngayChieuGioChieu) {
      alert("Vui lòng chọn ngày và giờ chiếu");
      return false;
    }

    // Validate ngày không được trong quá khứ
    const selectedDate = new Date(formData.ngayChieuGioChieu);
    const now = new Date();
    if (selectedDate <= now) {
      alert("Ngày và giờ chiếu phải lớn hơn thời điểm hiện tại");
      return false;
    }

    if (!formData.giaVe || formData.giaVe < 0) {
      alert("Vui lòng nhập giá vé hợp lệ");
      return false;
    }
    return true;
  };

  // Xử lý submit form - SỬA LẠI: maRap thành string
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Format ngày giờ trước khi gửi API
    const formattedDateTime = formatDateTimeForAPI(
      formData.ngayChieuGioChieu
    );

    const showtimeData = {
      maPhim: formData.maPhim,
      ngayChieuGioChieu: formattedDateTime,
      maRap: formData.maRap.toString(), // QUAN TRỌNG: Chuyển thành string
      giaVe: parseInt(formData.giaVe),
    };

    console.log("Data gửi lên API:", showtimeData);

    try {
      const result = await dispatch(
        createShowtime(showtimeData)
      ).unwrap();
      alert("Tạo lịch chiếu thành công!");
      navigate("/admin/manage-movie");
    } catch (error) {
      console.error("Lỗi khi tạo lịch chiếu:", error);
      const errorMessage =
        error.message?.content ||
        error.message?.message ||
        "Lỗi không xác định";
      alert(`Có lỗi xảy ra: ${errorMessage}`);
    }
  };

  // Xử lý hủy
  const handleCancel = () => {
    navigate("/admin/manage-movie");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tạo Lịch Chiếu
          </h1>
          {selectedMovie ? (
            <p className="text-gray-600 mt-2">
              Tạo lịch chiếu cho phim:{" "}
              <strong>{selectedMovie.tenPhim}</strong>
            </p>
          ) : (
            <p className="text-gray-600 mt-2">
              Tạo lịch chiếu cho phim với mã:{" "}
              <strong>{maPhim}</strong>
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Mã phim: {maPhim}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hệ thống rạp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hệ thống rạp *
              </label>
              <select
                name="maHeThongRap"
                value={formData.maHeThongRap}
                onChange={handleTheaterSystemChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn hệ thống rạp</option>
                {theaterSystems.map((system) => (
                  <option
                    key={system.maHeThongRap}
                    value={system.maHeThongRap}
                  >
                    {system.tenHeThongRap}
                  </option>
                ))}
              </select>
            </div>

            {/* Cụm rạp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cụm rạp *
              </label>
              <select
                name="maCumRap"
                value={formData.maCumRap}
                onChange={handleTheaterClusterChange}
                required
                disabled={
                  !formData.maHeThongRap ||
                  theaterClusters.length === 0
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Chọn cụm rạp</option>
                {theaterClusters.map((cluster) => (
                  <option
                    key={cluster.maCumRap}
                    value={cluster.maCumRap}
                  >
                    {cluster.tenCumRap} - {cluster.diaChi}
                  </option>
                ))}
              </select>
              {formData.maHeThongRap &&
                theaterClusters.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    Không có cụm rạp nào cho hệ thống này
                  </p>
                )}
            </div>

            {/* Rạp chiếu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rạp chiếu *
              </label>
              <select
                name="maRap"
                value={formData.maRap}
                onChange={handleInputChange}
                required
                disabled={
                  !formData.maCumRap || availableTheaters.length === 0
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Chọn rạp chiếu</option>
                {availableTheaters.map((theater) => (
                  <option key={theater.maRap} value={theater.maRap}>
                    {theater.tenRap} (Mã: {theater.maRap})
                  </option>
                ))}
              </select>
              {formData.maCumRap &&
                availableTheaters.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    Không có rạp nào trong cụm rạp này
                  </p>
                )}
            </div>

            {/* Ngày và giờ chiếu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày và giờ chiếu *
              </label>
              <input
                type="datetime-local"
                name="ngayChieuGioChieu"
                value={formData.ngayChieuGioChieu}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Định dạng: DD/MM/YYYY HH:mm:ss (sẽ được chuyển đổi tự
                động)
              </p>
            </div>

            {/* Giá vé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá vé (VND) *
              </label>
              <input
                type="number"
                name="giaVe"
                value={formData.giaVe}
                onChange={handleInputChange}
                required
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập giá vé"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Lỗi:</strong>{" "}
                {error.message?.content ||
                  error.message?.message ||
                  error.message}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Tạo Lịch Chiếu</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
