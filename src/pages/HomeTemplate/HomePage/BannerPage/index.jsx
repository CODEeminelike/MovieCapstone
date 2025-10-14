import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "./slice";
import { Link } from "react-router-dom";

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const {
    loading,
    data: banners,
    error,
  } = useSelector((state) => state.listBannerReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const nextSlide = () => {
    if (!banners || banners.length === 0) return;
    setCurrentSlide((prev) =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    if (!banners || banners.length === 0) return;
    setCurrentSlide((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!banners || banners.length === 0) return;

    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [banners]);

  // Hàm để lấy index của slide trước và sau
  const getSlideIndex = (offset) => {
    if (!banners || banners.length === 0) return 0;
    return (currentSlide + offset + banners.length) % banners.length;
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-white animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Đang tải banner...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 bg-white flex items-center justify-center">
        <div className="text-red-600">
          Lỗi khi tải banner: {error.message || "Có lỗi xảy ra"}
        </div>
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="w-full h-96 bg-white flex items-center justify-center">
        <div className="text-gray-500">Không có banner nào</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-white overflow-hidden">
      <div className="flex items-center justify-center h-full px-8">
        {/* Slide trước (bên trái) */}
        <div className="w-1/4 h-64 mx-2 opacity-60 scale-90 transition-all duration-300">
          <Link
            to={`/detail/${banners[getSlideIndex(-1)]?.maPhim}`}
            className="block w-full h-full"
          >
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={banners[getSlideIndex(-1)]?.hinhAnh}
                alt={`Banner phim ${
                  banners[getSlideIndex(-1)]?.maPhim
                }`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=Prev";
                }}
              />
            </div>
          </Link>
        </div>

        {/* Slide chính (ở giữa) */}
        <div className="w-2/4 h-80 mx-2 scale-105 transition-all duration-300 shadow-lg">
          <Link
            to={`/detail/${banners[currentSlide]?.maPhim}`}
            className="block w-full h-full"
          >
            <div className="w-full h-full flex items-center justify-center bg-white rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer">
              <img
                src={banners[currentSlide]?.hinhAnh}
                alt={`Banner phim ${banners[currentSlide]?.maPhim}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x400/ffffff/333333?text=Current";
                }}
              />
            </div>
          </Link>
        </div>

        {/* Slide sau (bên phải) */}
        <div className="w-1/4 h-64 mx-2 opacity-60 scale-90 transition-all duration-300">
          <Link
            to={`/detail/${banners[getSlideIndex(1)]?.maPhim}`}
            className="block w-full h-full"
          >
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={banners[getSlideIndex(1)]?.hinhAnh}
                alt={`Banner phim ${
                  banners[getSlideIndex(1)]?.maPhim
                }`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=Next";
                }}
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-900 text-white rounded-full p-3 transition-all z-10"
        aria-label="Previous slide"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-900 text-white rounded-full p-3 transition-all z-10"
        aria-label="Next slide"
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 transition-all rounded-full ${
              index === currentSlide
                ? "bg-gray-800 scale-125"
                : "bg-gray-400 hover:bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 bg-gray-800/80 text-white px-3 py-1 text-sm rounded z-10">
        {currentSlide + 1} / {banners.length}
      </div>
    </div>
  );
}
