import React from "react";

export default function CinemaCorner() {
  const articles = [
    {
      id: 1,
      type: "Review",
      title: "Tử Chiến Trên Không: Phim Việt Xuất Sắc Top Đầu 2025!",
      index: 2289,
      url: "https://www.galaxycine.vn/binh-luan-phim/tu-chien-tren-khong-phim-viet-xuat-sac-top-dau-2025/",
      image:
        "https://www.galaxycine.vn/media/2025/9/23/tu-chien-tren-khong-phim-viet-xuat-sac-top-dau-2025-1_1758597702205.jpg",
    },
    {
      id: 2,
      type: "Review",
      title: "The Conjuring Last Rites: Chương Cuối Trọn Vẹn Cảm Xúc",
      index: 557,
      url: "https://www.galaxycine.vn/binh-luan-phim/review-the-conjuring-last-rates-chuong-cuoi-tron-ven-cam-xuc/",
      image:
        "https://www.galaxycine.vn/media/2025/9/16/750-the-conjuring_1758016483478.jpg",
    },
    {
      id: 3,
      type: "Preview",
      title:
        "The Conjuring Last Rites: Chương Cuối Cùng Ám Ảnh Ra Sao?",
      index: 1169,
      url: "https://www.galaxycine.vn/binh-luan-phim/preview-the-conjuring-last-rates-chuong-cuoi-cung-am-anh-ra-sao/",
      image:
        "https://www.galaxycine.vn/media/2025/8/29/750_1756441506304.jpg",
    },
  ];

  const formatIndex = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleArticleClick = (url) => {
    if (url && url !== "#") {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header với tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-6">
          <h2 className="text-xl font-bold text-gray-900">
            GÓC ĐIỆN ẢNH
          </h2>
          <div className="flex space-x-4">
            <button className=" hover:text-blue-600 font-medium transition-colors border-b-2 border-blue-600 text-blue-600">
              Bình luận phim
            </button>
            <button className=" hover:text-blue-600 font-medium transition-colors">
              Blog điện ảnh
            </button>
          </div>
        </div>

        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 transition-colors">
          <span>Xem thêm</span>
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0 cursor-pointer"
            onClick={() => handleArticleClick(article.url)}
          >
            <div className="flex space-x-4">
              {/* Article Image */}
              <div className="flex-shrink-0">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-24 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Movie+Blog";
                  }}
                />
              </div>

              {/* Article Content */}
              <div className="flex-1 min-w-0">
                {/* Article Type Badge và Index */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      article.type === "Review"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    [{article.type}]
                  </span>

                  {/* Index  */}
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <span>{formatIndex(article.index)}</span>
                    <span className="font-medium">lượt xem</span>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="text-lg font-semibold text-gray-900 leading-tight hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
