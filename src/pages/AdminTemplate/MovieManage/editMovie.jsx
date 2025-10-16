import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMovies, updateMovie } from "./slice";

export default function EditMovie() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { maPhim } = useParams();
  const {
    data: movies,
    loading,
    error,
  } = useSelector((state) => state.movieManagementReducer);

  const [formData, setFormData] = useState({
    maPhim: "",
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
  const [currentImage, setCurrentImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data nếu chưa có
  useEffect(() => {
    if ((!movies || movies.length === 0) && maPhim) {
      dispatch(fetchMovies());
    }
  }, [dispatch, movies, maPhim]);

  // Tìm phim theo maPhim khi component mount hoặc maPhim thay đổi
  useEffect(() => {
    if (movies && Array.isArray(movies) && maPhim) {
      const movieToEdit = movies.find(
        (movie) => movie.maPhim === parseInt(maPhim)
      );

      if (movieToEdit) {
        // Format ngày từ "2024-10-10T00:00:00" thành "2024-10-10" cho input date
        const ngayKhoiChieu = movieToEdit.ngayKhoiChieu
          ? movieToEdit.ngayKhoiChieu.split("T")[0]
          : "";

        setFormData({
          maPhim: movieToEdit.maPhim.toString(),
          tenPhim: movieToEdit.tenPhim || "",
          trailer: movieToEdit.trailer || "",
          moTa: movieToEdit.moTa || "",
          ngayKhoiChieu: ngayKhoiChieu,
          sapChieu: movieToEdit.sapChieu || false,
          dangChieu: movieToEdit.dangChieu || false,
          hot: movieToEdit.hot || false,
          danhGia: movieToEdit.danhGia || 10,
          hinhAnh: null,
        });

        setCurrentImage(movieToEdit.hinhAnh || "");
      }
    }
  }, [movies, maPhim]);

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

  // Validation form
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
    return true;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const movieData = {
      maPhim: parseInt(formData.maPhim),
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

    console.log("Movie data để cập nhật:", movieData);

    try {
      const result = await dispatch(updateMovie(movieData)).unwrap();
      console.log("Cập nhật phim thành công:", result);
      alert("Cập nhật phim thành công!");
      navigate("/admin/manage-movie");
    } catch (error) {
      console.error("Lỗi khi cập nhật phim:", error);
      alert(
        `Có lỗi xảy ra: ${error.message || "Lỗi không xác định"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý hủy
  const handleCancel = () => {
    navigate("/admin/manage-movie");
  };

  if (loading && !formData.maPhim) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">
          Đang tải thông tin phim...
        </span>
      </div>
    );
  }

  if (!formData.maPhim && maPhim) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Không tìm thấy phim
          </h2>
          <p className="text-gray-600">
            Không thể tìm thấy phim với mã: {maPhim}
          </p>
          <button
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Chỉnh Sửa Phim
          </h1>
          <p className="text-gray-600 mt-2">
            Cập nhật thông tin cho phim: {formData.tenPhim}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Mã phim: {formData.maPhim}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mã phim (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã phim
                </label>
                <input
                  type="text"
                  name="maPhim"
                  value={formData.maPhim}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

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
                Hình ảnh phim
              </label>
              <div className="flex items-start space-x-6">
                <div className="flex-1">
                  <input
                    type="file"
                    name="hinhAnh"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Chọn hình ảnh mới để thay thế ảnh hiện tại (để
                    trống nếu giữ nguyên)
                  </p>
                </div>

                {/* Image Previews */}
                <div className="flex space-x-4">
                  {/* Current Image */}
                  {currentImage && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        Ảnh hiện tại
                      </p>
                      <div className="w-32 h-48 border rounded-lg overflow-hidden">
                        <img
                          src={currentImage}
                          alt="Current"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=No+Image";
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* New Image Preview */}
                  {imagePreview && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        Ảnh mới
                      </p>
                      <div className="w-32 h-48 border rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <span>Cập nhật Phim</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
