// components/SeatSelection.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const SeatSelection = () => {
  const { maLichChieu } = useParams(); // Lấy maLichChieu từ URL

  // Fetch thông tin lịch chiếu dựa trên maLichChieu
  useEffect(() => {
    if (maLichChieu) {
      // Gọi API để lấy thông tin lịch chiếu và danh sách ghế
      console.log("Fetching seats for schedule:", maLichChieu);
    }
  }, [maLichChieu]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Chọn Ghế - Mã lịch chiếu: {maLichChieu}
      </h1>
      {/* Component chọn ghế sẽ được thêm ở đây */}
    </div>
  );
};

export default SeatSelection;
