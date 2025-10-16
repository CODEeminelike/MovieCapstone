import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMovies, deleteMovie } from "./slice";

export default function DeleteMovie() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { maPhim } = useParams();
  const {
    data: movies,
    loading,
    error,
  } = useSelector((state) => state.movieManagementReducer);

  const [movieToDelete, setMovieToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data nếu chưa có
  useEffect(() => {
    if ((!movies || movies.length === 0) && maPhim) {
      dispatch(fetchMovies());
    }
  }, [dispatch, movies, maPhim]);

  // Tìm phim theo maPhim
  useEffect(() => {
    if (movies && Array.isArray(movies) && maPhim) {
      const movie = movies.find(
        (movie) => movie.maPhim === parseInt(maPhim)
      );

      if (movie) {
        setMovieToDelete(movie);
      }
    }
  }, [movies, maPhim]);

  // Xử lý xóa phim
  const handleDelete = async () => {
    if (!movieToDelete || isDeleting) return;

    setIsDeleting(true);

    try {
      const result = await dispatch(
        deleteMovie(movieToDelete.maPhim)
      ).unwrap();
      console.log("Xóa phim thành công:", result);
      alert("Xóa phim thành công!");
      navigate("/admin/manage-movie");
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
      alert(
        `Có lỗi xảy ra: ${error.message || "Lỗi không xác định"}`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Xử lý hủy
  const handleCancel = () => {
    navigate("/admin/manage-movie");
  };

  if (loading && !movieToDelete) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">
          Đang tải thông tin phim...
        </span>
      </div>
    );
  }

  if (!movieToDelete && maPhim) {
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
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Xóa Phim
          </h1>
          <p className="text-red-600 font-medium">
            Cảnh báo: Hành động này không thể hoàn tác
          </p>
        </div>

        {/* Movie Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start space-x-6">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <img
                src={movieToDelete.hinhAnh}
                alt={movieToDelete.tenPhim}
                className="w-32 h-48 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=No+Image";
                }}
              />
            </div>

            {/* Movie Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {movieToDelete.tenPhim}
              </h2>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Mã phim:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {movieToDelete.maPhim}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Mô tả:
                  </span>
                  <p className="mt-1 text-gray-700 line-clamp-3">
                    {movieToDelete.moTa || "Chưa có mô tả"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Ngày chiếu:
                    </span>
                    <p className="text-gray-700">
                      {new Date(
                        movieToDelete.ngayKhoiChieu
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Đánh giá:
                    </span>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-yellow-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-gray-700">
                        {movieToDelete.danhGia}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  {movieToDelete.hot && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      HOT
                    </span>
                  )}
                  {movieToDelete.dangChieu && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Đang chiếu
                    </span>
                  )}
                  {movieToDelete.sapChieu && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Sắp chiếu
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400 mr-3 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Bạn có chắc chắn muốn xóa phim này?
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>• Tất cả thông tin về phim sẽ bị xóa vĩnh viễn</p>
                <p>• Hành động này không thể hoàn tác</p>
                <p>• Các lịch chiếu liên quan có thể bị ảnh hưởng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>Lỗi:</strong> {error.message}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleCancel}
            disabled={isDeleting}
            className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Đang xóa...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Xác nhận xóa</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
