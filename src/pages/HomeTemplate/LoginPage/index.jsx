import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlertError from "../../../components/alertError";
import { Navigate, NavLink } from "react-router-dom";
import { authUserLogin } from "./slice";

export default function Login() {
  const [user, setUser] = useState({
    taiKhoan: "",
    matKhau: "",
  });

  // TRONG COMPONENT LOGIN
  const error = useSelector((state) => state.authUserReducer?.error);
  const data = useSelector((state) => state.authUserReducer?.data);
  const loading = useSelector(
    (state) => state.authUserReducer?.loading
  );
  if (data) {
    console.log("LOGIN SUCCESS");
    return <Navigate to="/" />;
  }
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
      {error && (
        <div className="fixed top-16 right-1 z-50 max-w-sm w-full">
          <AlertError messageError={error.message} />
        </div>
      )}
      <div>
        {/* This is an example component */}
        <div className="font-sans">
          <div className="relative min-h-screen flex flex-col sm:justify-center items-center bg-gray-100 ">
            <div className="relative sm:max-w-sm w-full">
              <div className="card bg-blue-400 shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6" />
              <div className="card bg-red-400 shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6" />
              <div className="relative w-full rounded-3xl  px-6 py-4 bg-gray-100 shadow-md">
                <label
                  htmlFor
                  className="block mt-3 text-sm text-gray-700 text-center font-semibold"
                >
                  Đăng nhập
                </label>
                <form method="#" action="#" className="mt-10">
                  <div>
                    <input
                      type="text"
                      name="taiKhoan"
                      placeholder="Tài khoản"
                      className="mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="mt-7">
                    <input
                      type="password"
                      name="matKhau"
                      placeholder="Mật khẩu"
                      className="mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="mt-7 flex">
                    <label
                      htmlFor="remember_me"
                      className="inline-flex items-center w-full cursor-pointer"
                    >
                      <input
                        id="remember_me"
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        name="remember"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Ghi nhớ đăng nhập
                      </span>
                    </label>
                    <div className="w-full text-right">
                      <a
                        className="underline text-sm text-gray-600 hover:text-gray-900"
                        href="#"
                      >
                        Quên mật khẩu
                      </a>
                    </div>
                  </div>
                  <div className="mt-7">
                    <button
                      className="bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105"
                      onClick={handleOnSubmit}
                    >
                      Đăng nhập
                    </button>
                  </div>
                  <div className="flex mt-7 items-center text-center">
                    <hr className="border-gray-300 border-1 w-full rounded-md" />
                    <label className="block font-medium text-sm text-gray-600 w-full">
                      Hoặc
                    </label>
                    <hr className="border-gray-300 border-1 w-full rounded-md" />
                  </div>
                  <div className="flex mt-7 justify-center w-full">
                    <button className="mr-5 bg-blue-500 border-none px-4 py-2 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                      Facebook
                    </button>
                    <button className="bg-red-500 border-none px-4 py-2 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                      Google
                    </button>
                  </div>
                  <div className="mt-7">
                    <div className="flex justify-center items-center">
                      <label className="mr-2">
                        Chưa có tài khoản ?
                      </label>
                      {/* THAY THẾ THẺ <a> BẰNG NavLink */}
                      <NavLink
                        to="/register" // HOẶC ĐƯỜNG DẪN ĐẾN TRANG ĐĂNG KÍ CỦA BẠN
                        className="text-blue-500 transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
                      >
                        Đăng kí mới
                      </NavLink>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
