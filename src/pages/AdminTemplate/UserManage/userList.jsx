import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUsers,
  deleteUser,
  updateUser,
  clearError,
} from "./userSlice";

export default function UserList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: users,
    loading,
    error,
  } = useSelector((state) => state.userSlice);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Lấy danh sách user khi component mount
  useEffect(() => {
    dispatch(fetchUsers("GP01"));
    dispatch(clearError());
  }, [dispatch]);

  // Xử lý điều hướng đến trang thêm user
  const handleAddUser = () => {
    console.log("đây");
    navigate("/admin/add-user"); // Điều hướng đến route add-user
  };

  // Xử lý xóa user
  const handleDelete = (taiKhoan) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa user này?")) {
      dispatch(deleteUser(taiKhoan));
    }
  };

  // Xử lý mở modal sửa user - FIX LỖI UNCONTROLLED INPUT
  const handleEdit = (user) => {
    // Khởi tạo với tất cả giá trị mặc định
    setEditingUser({
      taiKhoan: user.taiKhoan || "",
      hoTen: user.hoTen || "",
      email: user.email || "",
      soDt: user.soDt || "",
      maLoaiNguoiDung: user.maLoaiNguoiDung || "KhachHang",
    });
    setShowEditModal(true);
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    dispatch(clearError());
  };

  // Xử lý thay đổi thông tin user trong form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý cập nhật user
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (
      !editingUser.hoTen ||
      !editingUser.email ||
      !editingUser.soDt
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Tìm user gốc để lấy mật khẩu
    const originalUser = users.find(
      (user) => user.taiKhoan === editingUser.taiKhoan
    );

    // Chuẩn bị data với đầy đủ các trường
    const userData = {
      taiKhoan: editingUser.taiKhoan,
      matKhau: originalUser?.matKhau || "123456", // Fallback nếu không tìm thấy
      email: editingUser.email,
      soDt: editingUser.soDt,
      maNhom: "GP01",
      maLoaiNguoiDung: editingUser.maLoaiNguoiDung,
      hoTen: editingUser.hoTen,
    };

    console.log("Data gửi lên API:", userData);

    try {
      await dispatch(updateUser(userData)).unwrap();
      alert("Cập nhật user thành công!");
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
      const errorMessage =
        error.message?.content ||
        error.message?.message ||
        error.message;
      alert(`Lỗi khi cập nhật: ${errorMessage}`);
    }
  };

  // Lọc user theo search term
  const filteredUsers = users.filter(
    (user) =>
      user.taiKhoan
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header với nút Thêm người dùng */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản Lý Người Dùng
          </h1>
          <p className="text-gray-600">
            Danh sách tất cả user trong nhóm GP01
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
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
          <span>Thêm người dùng</span>
        </button>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo tài khoản, họ tên, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Lỗi:</strong>{" "}
          {error.message?.content ||
            error.message?.message ||
            error.message}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tài Khoản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số ĐT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.taiKhoan}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.taiKhoan}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.hoTen}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.soDt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.maLoaiNguoiDung === "QuanTri"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.maLoaiNguoiDung === "QuanTri"
                          ? "Quản Trị"
                          : "Khách Hàng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-lg transition-colors duration-200"
                        disabled={loading}
                      >
                        {loading ? "Đang xử lý..." : "Sửa"}
                      </button>
                      <button
                        onClick={() => handleDelete(user.taiKhoan)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-lg transition-colors duration-200"
                        disabled={loading}
                      >
                        {loading ? "Đang xử lý..." : "Xóa"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {searchTerm
                      ? "Không tìm thấy user nào phù hợp"
                      : "Không có user nào"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 text-sm text-gray-600">
        Tổng số: {filteredUsers.length} user
        {searchTerm &&
          ` (tìm thấy ${filteredUsers.length} kết quả phù hợp)`}
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Sửa Thông Tin User
              </h3>
            </div>

            <form
              onSubmit={handleUpdateUser}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tài khoản
                </label>
                <input
                  type="text"
                  value={editingUser.taiKhoan || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tài khoản không thể thay đổi
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên *
                </label>
                <input
                  type="text"
                  name="hoTen"
                  value={editingUser.hoTen || ""}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email || ""}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="text"
                  name="soDt"
                  value={editingUser.soDt || ""}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại người dùng
                </label>
                <select
                  name="maLoaiNguoiDung"
                  value={editingUser.maLoaiNguoiDung || "KhachHang"}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="KhachHang">Khách hàng</option>
                  <option value="QuanTri">Quản trị</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                  {error.message?.content ||
                    error.message?.message ||
                    error.message}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>Cập nhật</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
