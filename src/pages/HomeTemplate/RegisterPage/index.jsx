import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authUserRegister } from "./slice";
import AlertError from "../../../components/alertError";
import { storage } from "../../../helpers/localStorageHelper";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDt: "",
    maNhom: "GP01",
    hoTen: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    taiKhoan: "",
    matKhau: "",
    email: "",
    confirmPassword: "",
  });

  const reduxError = useSelector(
    (state) => state.authUserRegisterReducer?.error
  );
  const data = storage.get("USER_INFO");

  useEffect(() => {
    if (data) {
      console.log("REGISTER SUCCESS");
      console.log(data);
      window.history.back();
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const dispatch = useDispatch();

  const validateField = (name, value) => {
    let message = "";
    const fieldName =
      {
        taiKhoan: "Tài khoản",
        matKhau: "Mật khẩu",
        email: "Email",
        confirmPassword: "Xác nhận mật khẩu",
      }[name] || "";

    if (!value && name !== "confirmPassword") {
      message = `Không được để trống ${fieldName}!`;
    } else {
      switch (name) {
        case "taiKhoan":
          if (!value.match(/^[a-zA-Z0-9_]{3,20}$/)) {
            message =
              "Vui lòng nhập tài khoản hợp lệ (3-20 ký tự, chỉ chữ cái, số và dấu gạch dưới).";
          }
          break;
        case "matKhau":
          if (
            !value.match(
              /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/
            )
          ) {
            message =
              "Mật khẩu không đủ phức tạp. Vui lòng đảm bảo mật khẩu chứa ít nhất một chữ cái thường, một chữ cái hoa, một chữ số, một ký tự đặc biệt và tối thiểu 8 ký tự.";
          }
          break;
        case "email":
          if (
            !value.match(
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            )
          ) {
            message =
              "Email không hợp lệ. Vui lòng nhập địa chỉ email đúng định dạng.";
          }
          break;
        case "confirmPassword":
          if (value !== user.matKhau) {
            message = "Xác nhận mật khẩu không khớp.";
          }
          break;
        default:
          break;
      }
    }
    return message;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const val =
      name === "confirmPassword" ? confirmPassword : user[name];
    const message = validateField(name, val);
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all fields again
    const newErrors = {};
    Object.keys(user).forEach((key) => {
      if (["taiKhoan", "matKhau", "email"].includes(key)) {
        newErrors[key] = validateField(key, user[key]);
      }
    });
    newErrors.confirmPassword = validateField(
      "confirmPassword",
      confirmPassword
    );
    setErrors(newErrors);

    // Check if any errors
    if (Object.values(newErrors).every((err) => err === "")) {
      dispatch(authUserRegister(user));
    }
  };

  return (
    <div className="bg-slate-50 flex items-center md:h-screen p-4">
      {reduxError && (
        <div className="fixed top-16 right-1 z-50 max-w-sm w-full">
          <AlertError messageError={reduxError.message} />
        </div>
      )}

      <div className="w-full max-w-3xl max-md:max-w-xl mx-auto">
        <div className="relative">
          {/* Background Decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute w-full h-full bg-blue-400 rounded-3xl transform -rotate-6 opacity-60" />
            <div className="absolute w-full h-full bg-red-400 rounded-3xl transform rotate-6 opacity-60" />
          </div>

          {/* Main Content */}
          <div className="relative bg-white grid md:grid-cols-2 gap-10 w-full sm:p-8 p-6 shadow-2xl rounded-3xl">
            <div className="max-md:order-1 space-y-6">
              <div className="md:mb-16 mb-8">
                <h2 className="text-slate-900 text-2xl font-medium">
                  Đăng ký nhanh
                </h2>
              </div>
              <div className="space-y-4">
                <button
                  type="button"
                  className="px-4 py-2.5 flex items-center justify-center cursor-pointer rounded-md text-white text-sm font-medium tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700 transition duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22px"
                    fill="#fff"
                    className="inline shrink-0 mr-3"
                    viewBox="0 0 167.657 167.657"
                  >
                    <path
                      d="M83.829.349C37.532.349 0 37.881 0 84.178c0 41.523 30.222 75.911 69.848 82.57v-65.081H49.626v-23.42h20.222V60.978c0-20.037 12.238-30.956 30.115-30.956 8.562 0 15.92.638 18.056.919v20.944l-12.399.006c-9.72 0-11.594 4.618-11.594 11.397v14.947h23.193l-3.025 23.42H94.026v65.653c41.476-5.048 73.631-40.312 73.631-83.154 0-46.273-37.532-83.805-83.828-83.805z"
                      data-original="#010002"
                    />
                  </svg>
                  Tiếp tục với Facebook
                </button>
                <button
                  type="button"
                  className="px-4 py-2.5 flex items-center justify-center cursor-pointer rounded-md text-slate-900 text-sm font-medium tracking-wider border-none outline-none bg-slate-100 hover:bg-slate-200 transition duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22px"
                    fill="#fff"
                    className="inline shrink-0 mr-3"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#fbbd00"
                      d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                      data-original="#fbbd00"
                    />
                    <path
                      fill="#0f9d58"
                      d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                      data-original="#0f9d58"
                    />
                    <path
                      fill="#31aa52"
                      d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                      data-original="#31aa52"
                    />
                    <path
                      fill="#3c79e6"
                      d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                      data-original="#3c79e6"
                    />
                    <path
                      fill="#cf2d48"
                      d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                      data-original="#cf2d48"
                    />
                    <path
                      fill="#eb4132"
                      d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                      data-original="#eb4132"
                    />
                  </svg>
                  Tiếp tục với Google
                </button>
                <button
                  type="button"
                  className="px-4 py-2.5 flex items-center justify-center cursor-pointer rounded-md text-white text-sm font-medium tracking-wider border-none outline-none bg-black hover:bg-[#222] transition duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22px"
                    fill="#fff"
                    className="inline shrink-0 mr-3"
                    viewBox="0 0 22.773 22.773"
                  >
                    <path
                      d="M15.769 0h.162c.13 1.606-.483 2.806-1.228 3.675-.731.863-1.732 1.7-3.351 1.573-.108-1.583.506-2.694 1.25-3.561C13.292.879 14.557.16 15.769 0zm4.901 16.716v.045c-.455 1.378-1.104 2.559-1.896 3.655-.723.995-1.609 2.334-3.191 2.334-1.367 0-2.275-.879-3.676-.903-1.482-.024-2.297.735-3.652.926h-.462c-.995-.144-1.798-.932-2.383-1.642-1.725-2.098-3.058-4.808-3.306-8.276v-1.019c.105-2.482 1.311-4.5 2.914-5.478.846-.52 2.009-.963 3.304-.765.555.086 1.122.276 1.619.464.471.181 1.06.502 1.618.485.378-.011.754-.208 1.135-.347 1.116-.403 2.21-.865 3.652-.648 1.733.262 2.963 1.032 3.723 2.22-1.466.933-2.625 2.339-2.427 4.74.176 2.181 1.444 3.457 3.028 4.209z"
                      data-original="#000000"
                    />
                  </svg>
                  Tiếp tục với Apple
                </button>
              </div>
            </div>
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-slate-900 text-2xl font-medium">
                  Đăng ký tài khoản
                </h2>
              </div>
              <div className="space-y-6">
                {/* Tài khoản */}
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Tài khoản <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="taiKhoan"
                      type="text"
                      required
                      className="bg-white border border-slate-300 w-full text-sm text-slate-900 pl-4 pr-10 py-2.5 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 outline-none transition duration-300"
                      placeholder="Nhập tài khoản"
                      value={user.taiKhoan}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-4 h-4 absolute right-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx={10}
                        cy={7}
                        r={6}
                        data-original="#000000"
                      />
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"
                      />
                    </svg>
                  </div>
                  {errors.taiKhoan && (
                    <div className="mt-2 bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-4">
                      <span className="font-bold">Cảnh báo</span>{" "}
                      {errors.taiKhoan}
                    </div>
                  )}
                </div>

                {/* Mật khẩu */}
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="matKhau"
                      type={showPassword ? "text" : "password"}
                      required
                      className="bg-white border border-slate-300 w-full text-sm text-slate-900 pl-4 pr-10 py-2.5 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 outline-none transition duration-300"
                      placeholder="Nhập mật khẩu"
                      value={user.matKhau}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      className="absolute right-4 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.matKhau && (
                    <div className="mt-2 bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-4">
                      <span className="font-bold">Cảnh báo</span>{" "}
                      {errors.matKhau}
                    </div>
                  )}
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Xác nhận mật khẩu{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      className="bg-white border border-slate-300 w-full text-sm text-slate-900 pl-4 pr-10 py-2.5 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 outline-none transition duration-300"
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      className="absolute right-4 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="mt-2 bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-4">
                      <span className="font-bold">Cảnh báo</span>{" "}
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="email"
                      type="email"
                      required
                      className="bg-white border border-slate-300 w-full text-sm text-slate-900 pl-4 pr-10 py-2.5 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0 outline-none transition duration-300"
                      placeholder="Nhập email"
                      value={user.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-4 h-4 absolute right-4"
                      viewBox="0 0 682.667 682.667"
                    >
                      <defs>
                        <clipPath
                          id="a"
                          clipPathUnits="userSpaceOnUse"
                        >
                          <path
                            d="M0 512h512V0H0Z"
                            data-original="#000000"
                          />
                        </clipPath>
                      </defs>
                      <g
                        clipPath="url(#a)"
                        transform="matrix(1.33 0 0 -1.33 0 682.667)"
                      >
                        <path
                          fill="none"
                          strokeMiterlimit={10}
                          strokeWidth={40}
                          d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                          data-original="#000000"
                        />
                        <path
                          d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                          data-original="#000000"
                        />
                      </g>
                    </svg>
                  </div>
                  {errors.email && (
                    <div className="mt-2 bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-4">
                      <span className="font-bold">Cảnh báo</span>{" "}
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded-md"
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-slate-600 ml-3 block text-sm"
                  >
                    Tôi đồng ý với{" "}
                    <a
                      href="javascript:void(0);"
                      className="text-blue-600 font-medium hover:underline ml-1"
                    >
                      Điều khoản và Điều kiện
                    </a>
                  </label>
                </div>
              </div>
              <div className="!mt-8">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-medium tracking-wider cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
                >
                  Tạo tài khoản
                </button>
              </div>
              <p className="text-slate-600 text-sm mt-4 text-left">
                Đã có tài khoản?{" "}
                <a
                  href="javascript:void(0);"
                  className="text-blue-600 font-medium hover:underline ml-1 transition duration-300"
                >
                  Đăng nhập tại đây
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
