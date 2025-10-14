import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlertError from "../../../components/alertError";
import { Navigate, NavLink } from "react-router-dom";
import { authUserLogin } from "./slice";

export default function Login() {
  const [user, setUser] = useState({
    taiKhoan: "",
    matKhau: "",
  });

  const error = useSelector((state) => state.authUserReducer?.error);
  const data = useSelector((state) => state.authUserReducer?.data);

  // Sử dụng useEffect để xử lý redirect khi login thành công
  useEffect(() => {
    if (data) {
      console.log("LOGIN SUCCESS");
      window.history.back(); // Quay lại trang trước đó
    }
  }, [data]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const dispatch = useDispatch();
  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(authUserLogin(user));
  };

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30 p-4">
        <div className="relative w-full max-w-md">
          {error && (
            <div className="fixed top-16 right-1 z-50 max-w-sm w-full">
              <AlertError messageError={error.message} />
            </div>
          )}

          {/* Background Decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute w-full h-full bg-blue-400 rounded-3xl transform -rotate-6 opacity-70" />
            <div className="absolute w-full h-full bg-red-400 rounded-3xl transform rotate-6 opacity-70" />
          </div>

          {/* Modal Content */}
          <div className="relative w-full rounded-3xl px-6 py-8 bg-white shadow-2xl">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => window.history.back()}
            >
              ×
            </button>

            <label className="block text-lg text-gray-700 text-center font-semibold mb-6">
              Đăng nhập
            </label>

            <form className="space-y-6">
              <div>
                <input
                  type="text"
                  name="taiKhoan"
                  placeholder="Tài khoản"
                  className="w-full border-none bg-gray-100 h-12 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 px-4"
                  onChange={handleOnChange}
                />
              </div>

              <div>
                <input
                  type="password"
                  name="matKhau"
                  placeholder="Mật khẩu"
                  className="w-full border-none bg-gray-100 h-12 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 px-4"
                  onChange={handleOnChange}
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    name="remember"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Ghi nhớ đăng nhập
                  </span>
                </label>
                <div>
                  <a
                    className="underline text-sm text-gray-600 hover:text-gray-900"
                    href="#"
                  >
                    Quên mật khẩu
                  </a>
                </div>
              </div>

              <div>
                <button
                  className="bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
                  onClick={handleOnSubmit}
                >
                  Đăng nhập
                </button>
              </div>

              <div className="flex items-center text-center">
                <hr className="border-gray-300 border-1 w-full rounded-md" />
                <label className="block font-medium text-sm text-gray-600 mx-4">
                  Hoặc
                </label>
                <hr className="border-gray-300 border-1 w-full rounded-md" />
              </div>

              <div className="flex justify-center gap-4">
                <button className="bg-blue-500 border-none px-6 py-3 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out transform hover:-translate-y-0.5">
                  Facebook
                </button>
                <button className="bg-red-500 border-none px-6 py-3 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out transform hover:-translate-y-0.5">
                  Google
                </button>
              </div>

              <div>
                <div className="flex justify-center items-center">
                  <label className="mr-2">Chưa có tài khoản ?</label>
                  <NavLink
                    to="/register"
                    className="text-blue-500 transition duration-500 ease-in-out transform hover:-translate-y-0.5"
                  >
                    Đăng kí mới
                  </NavLink>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
