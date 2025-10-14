import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addMovie } from "./slice";

export default function AddMovie() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(
    (state) => state.movieManagementReducer
  );

  const [formData, setFormData] = useState({
    tenPhim: "",
    trailer: "",
    moTa: "",
    ngayKhoiChieu: "",
    sapChieu: true,
    dangChieu: true,
    hot: false,
    danhGia: 10,
    hinhAnh: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        hinhAnh: file,
      }));

      // Tạo preview cho ảnh
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.tenPhim.trim()) {
      alert("Vui lòng nhập tên phim");
      return false;
    }
    if (!formData.trailer.trim()) {
      alert("Vui lòng nhập link trailer");
      return false;
    }
    if (!formData.moTa.trim()) {
      alert("Vui lòng nhập mô tả phim");
      return false;
    }
    if (!formData.ngayKhoiChieu) {
      alert("Vui lòng chọn ngày khởi chiếu");
      return false;
    }
    if (!formData.hinhAnh) {
      alert("Vui lòng chọn hình ảnh phim");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!validateForm()) {
      return;
    }

    const movieData = {
      tenPhim: formData.tenPhim,
      trailer: formData.trailer,
      moTa: formData.moTa,
      ngayKhoiChieu: formData.ngayKhoiChieu,
      sapChieu: formData.sapChieu,
      dangChieu: formData.dangChieu,
      hot: formData.hot,
      danhGia: parseInt(formData.danhGia),
      hinhAnh: formData.hinhAnh,
    };

    console.log("Movie data trước khi gửi:", movieData);

    try {
      const result = await dispatch(addMovie(movieData)).unwrap();
      alert("Thêm phim thành công!");
      navigate("/admin/movie-management");
    } catch (error) {
      console.error("Chi tiết lỗi:", error);

      // Hiển thị chi tiết lỗi
      let errorMessage = "Có lỗi xảy ra khi thêm phim!";

      if (error?.data) {
        // Nếu có data lỗi từ server
        errorMessage = `Lỗi ${
          error.data.statusCode || error.status
        }: ${error.data.message || error.message}`;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  // Xử lý hủy
  const handleCancel = () => {
    navigate("/admin/movie-management");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Thêm Phim Mới
          </h1>
          <p className="text-gray-600 mt-2">
            Thêm thông tin phim mới vào hệ thống
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tên phim */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên phim *
                </label>
                <input
                  type="text"
                  name="tenPhim"
                  value={formData.tenPhim}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên phim"
                />
              </div>

              {/* Trailer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Trailer *
                </label>
                <input
                  type="url"
                  name="trailer"
                  value={formData.trailer}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://youtube.com/..."
                />
              </div>

              {/* Ngày khởi chiếu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày khởi chiếu *
                </label>
                <input
                  type="date"
                  name="ngayKhoiChieu"
                  value={formData.ngayKhoiChieu}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Đánh giá */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đánh giá (1-10) *
                </label>
                <select
                  name="danhGia"
                  value={formData.danhGia}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả phim *
              </label>
              <textarea
                name="moTa"
                value={formData.moTa}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mô tả về phim"
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="dangChieu"
                  checked={formData.dangChieu}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Đang chiếu
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="sapChieu"
                  checked={formData.sapChieu}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Sắp chiếu
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="hot"
                  checked={formData.hot}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Phim HOT
                </span>
              </label>
            </div>

            {/* Upload hình ảnh */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh phim *
              </label>
              <div className="flex items-center space-x-6">
                <div className="flex-1">
                  <input
                    type="file"
                    name="hinhAnh"
                    onChange={handleInputChange}
                    accept="image/*"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="w-32 h-48 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Chọn hình ảnh poster cho phim (tỷ lệ khuyến nghị: 2:3)
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Lỗi:</strong> {error.message}
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
                  <span>Thêm Phim</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
