import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./_components/Navbar";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function AdminTemplate() {
  const data = useSelector((state) => state.authReducer.data);

  if (!data) {
    return <Navigate to="/auth" />;
  }
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Navbar />

      {/* Nội dung chính */}
      <main className="flex-1 ml-64 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}
