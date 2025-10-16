import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesWithPagination } from "./slice";
import Spinner from "../../../../components/spinner";
import MovieCard from "../../_components/Movie";

export default function MoviePagination() {
  const {
    data: movies,
    loading,
    error,
  } = useSelector((state) => state.moviesWithPaginationReducer);

  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMoviesWithPagination(currentPage));
  }, [dispatch, currentPage]);

  useEffect(() => {
    console.log("Movies data:", movies);
  }, [movies]);

  // Tạo danh sách trang ( 3 trang)
  const totalPages = 3;
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Lỗi khi tải dữ liệu: {error.message}
      </div>
    );
  }

  // Kiểm tra cấu trúc data
  if (!movies || !movies.items || !Array.isArray(movies.items)) {
    return (
      <div className="text-center p-4">
        Không có dữ liệu phim hoặc cấu trúc dữ liệu không đúng
      </div>
    );
  }

  return (
    <div>
      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
        {movies.items.map((movie) => (
          <MovieCard key={movie.maPhim} movie={movie} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-2 py-6">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border transition-all ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
          }`}
        >
          ← Trước
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              currentPage === pageNumber
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg border transition-all ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
          }`}
        >
          Sau →
        </button>
      </div>

      {/* Current Page Info */}
      <div className="text-center text-gray-600 text-sm pb-4">
        Trang {currentPage} / {totalPages}
      </div>
    </div>
  );
}
