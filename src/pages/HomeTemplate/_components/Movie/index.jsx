import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function MovieCard(props) {
  const { movie } = props;
  const [showTrailer, setShowTrailer] = useState(false);

  // Hàm extract YouTube ID từ URL
  const getYouTubeId = (url) => {
    if (!url) return null;

    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(movie.trailer);

  const handleTrailerClick = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra card
    e.preventDefault(); // Ngăn chuyển trang khi click trailer
    if (youtubeId) {
      setShowTrailer(true);
    }
  };

  const closeTrailer = (e) => {
    e.stopPropagation();
    setShowTrailer(false);
  };

  // Kiểm tra movie tồn tại
  if (!movie || typeof movie !== "object") {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-96 animate-pulse">
        <div className="w-full h-64 bg-gray-300"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Link
        to={`/detail/${movie.maPhim}`}
        className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      >
        {/* Movie Image với overlay */}
        <div className="relative">
          <img
            src={
              movie.hinhAnh ||
              "https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=Movie+Poster"
            }
            alt={movie.tenPhim || "Movie Poster"}
            className="w-full h-80 object-cover"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=Movie+Poster";
            }}
          />

          {/* Rating badge */}
          <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full flex items-center space-x-1">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-bold">
              {movie.danhGia || "N/A"}
            </span>
          </div>

          {/* Hot badge nếu là phim hot */}
          {movie.hot && (
            <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
              HOT
            </div>
          )}

          {/* Overlay với các button */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="flex space-x-3">
              {/* Trailer button */}
              <button
                onClick={handleTrailerClick}
                disabled={!youtubeId}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                  youtubeId
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Trailer</span>
              </button>

              {/* Buy ticket button */}
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.5 22V2h15v20h-15zm3-13h9v2h-9V9zm0 4h9v2h-9v-2z" />
                </svg>
                <span>Mua vé</span>
              </button>
            </div>
          </div>
        </div>

        {/* Movie Info - rating */}
        <div className="p-4">
          {/* Movie Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {movie.tenPhim || "Tên phim không có"}
          </h3>

          {/* Rating*/}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500 font-bold">
                {movie.danhGia || "N/A"}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-green-600 text-sm font-medium">
                {movie.dangChieu
                  ? "Đang chiếu"
                  : movie.sapChieu
                  ? "Sắp chiếu"
                  : "Ngừng chiếu"}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Trailer Modal */}
      {showTrailer && youtubeId && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Trailer: {movie.tenPhim}
              </h3>
              <button
                onClick={closeTrailer}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* YouTube Video */}
            <div className="relative aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title={`Trailer - ${movie.tenPhim}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-96"
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <div className="flex space-x-3">
                <Link
                  to={`/detail/${movie.maPhim}`}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  Xem chi tiết
                </Link>
                <button
                  onClick={closeTrailer}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
