import { useParams } from "react-router-dom";
import { fetchDetailMovie } from "./slice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

export default function DetailPage() {
  const state = useSelector((state) => state.detailReducer);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    dispatch(fetchDetailMovie(id));
  }, [id, dispatch]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-600">
          Loading...
        </p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-600">
          Error: {state.error}
        </p>
      </div>
    );
  }

  const movie = state.data;

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-600">
          No movie data found.
        </p>
      </div>
    );
  }

  // Format ngày khởi chiếu
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section - SỬA Ở ĐÂY */}
        <div className="relative rounded-xl overflow-hidden shadow-xl mb-12 h-96">
          {imageError ? (
            // Fallback khi ảnh lỗi
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-white text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xl font-semibold">
                  Không thể tải hình ảnh
                </p>
              </div>
            </div>
          ) : (
            // Sử dụng object-cover như cũ nhưng có background
            <div className="w-full h-full  flex items-center justify-center">
              <img
                src={movie.hinhAnh}
                alt={movie.tenPhim}
                className="h-full w-auto object-cover" // Giữ nguyên object-cover
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
              />
            </div>
          )}

          {/* Overlay content */}
          <div className="absolute inset-0  bg-opacity-30 flex flex-col justify-end p-8">
            <h1 className="text-4xl font-bold text-black mb-2">
              {movie.tenPhim}
            </h1>
            <p className="text-lg text-black mb-4">{movie.biDanh}</p>
            <div className="flex items-center space-x-4">
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Đánh giá: {movie.danhGia}/10
              </span>
              {movie.hot && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Hot
                </span>
              )}
              {movie.dangChieu && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Đang chiếu
                </span>
              )}
              {movie.sapChieu && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Sắp chiếu
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Phần mô tả và thông tin */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Chi tiết
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {movie.moTa || "Đang cập nhật mô tả..."}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Thông tin phim
            </h2>
            <dl className="space-y-4">
              <div className="flex">
                <dt className="w-32 font-semibold text-gray-700">
                  Ngày khởi chiếu:
                </dt>
                <dd className="text-gray-600">
                  {formatDate(movie.ngayKhoiChieu)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Phần trailer */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Trailer
            </h2>
            <div className="aspect-w-16 aspect-h-9">
              {movie.trailer ? (
                <iframe
                  src={`https://www.youtube.com/embed/${
                    movie.trailer.includes("youtube.com")
                      ? movie.trailer.split("v=")[1]?.split("&")[0]
                      : movie.trailer
                  }`}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-64 rounded-lg"
                ></iframe>
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Không có trailer</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lịch chiếu rạp */}
        {/* <TheaterList movieId={movie.maPhim} /> */}
      </div>
    </div>
  );
}
