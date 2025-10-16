import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "./slice";
import { useNavigate } from "react-router-dom";

export default function ShowMovies() {
  const dispatch = useDispatch();
  const {
    data: movies,
    loading,
    error,
  } = useSelector((state) => state.movieManagementReducer);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Fetch data khi component mount
  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  // Filter movies khi search term thay đổi
  useEffect(() => {
    if (movies && Array.isArray(movies)) {
      const filtered = movies.filter(
        (movie) =>
          movie.tenPhim
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          movie.moTa
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          movie.biDanh
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [movies, searchTerm]);

  // Xử lý xóa (placeholder)
  const handleDelete = (movieId) => {
    navigate(`/admin/delete-movie/${movieId}`);
  };
  // Xử lý sửa (placeholder)
  const handleEdit = (movie) => {
    navigate(`/admin/edit-movie/${movie.maPhim}`);
  };
  const navigate = useNavigate();
  // Xử lý thêm (placeholder)
  const handleAdd = () => {
    navigate("/admin/add-movie");
  };

  //Xử lý tạo lịch
  const handleCreateShowtime = (movie) => {
    navigate(`/admin/create-showtime/${movie.maPhim}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Lỗi:</strong> {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header với tiêu đề và nút thêm */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản Lý Phim
        </h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Thêm Phim</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm phim theo tên, mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Movies Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình Ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông Tin Phim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <tr
                    key={movie.maPhim}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    {/* Hình ảnh */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={movie.hinhAnh}
                        alt={movie.tenPhim}
                        className="h-16 w-12 object-cover rounded shadow-sm"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80x120/4F46E5/FFFFFF?text=No+Image";
                        }}
                      />
                    </td>

                    {/* Thông tin phim */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {movie.tenPhim}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {movie.moTa || "Chưa có mô tả"}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Ngày chiếu:{" "}
                          {new Date(
                            movie.ngayKhoiChieu
                          ).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {movie.hot && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            HOT
                          </span>
                        )}
                        {movie.dangChieu && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Đang chiếu
                          </span>
                        )}
                        {movie.sapChieu && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Sắp chiếu
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Đánh giá */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-yellow-400 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">
                          {movie.danhGia}/10
                        </span>
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(movie)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors duration-200 flex items-center space-x-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleDelete(movie.maPhim)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors duration-200 flex items-center space-x-1"
                        >
                          <svg
                            className="w-4 h-4"
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
                          <span>Xóa</span>
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        {/* Tạo lịch */}
                        <button
                          onClick={() => handleCreateShowtime(movie)}
                          className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors duration-200 flex items-center space-x-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          <span>Lịch chiếu</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "Không tìm thấy phim phù hợp với từ khóa tìm kiếm."
                      : "Không có dữ liệu phim."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer thống kê */}
      {filteredMovies.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Hiển thị {filteredMovies.length} trong tổng số{" "}
          {movies?.length || 0} phim
        </div>
      )}
    </div>
  );
}
