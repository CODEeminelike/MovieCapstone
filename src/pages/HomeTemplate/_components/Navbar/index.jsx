import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "../../../../routes";
import { logout } from "../../LoginPage/slice";

export default function Navbar() {
  const dispatch = useDispatch();
  const userData = useSelector(
    (state) => state.authUserReducer?.data
  ); // LẤY USER DATA

  const renderNavList = () => {
    const mainRoutes = routes[0].nested;

    return mainRoutes.map((route, index) => {
      if (route.hiddenNav) return null;

      return (
        <li key={index}>
          <NavLink
            className={({ isActive }) =>
              `block py-2 px-3 text-white rounded md:p-0 transition-colors duration-200 ${
                isActive
                  ? "bg-cyan-700 md:bg-transparent md:text-cyan-300 font-bold"
                  : "hover:text-cyan-300"
              }`
            }
            to={route.path}
            end={route.path === ""}
          >
            {route.name}
          </NavLink>
        </li>
      );
    });
  };

  const handleLogout = () => {
    console.log("Logging out...");
    dispatch(logout());
  };

  return (
    <nav className="bg-gradient-to-r from-cyan-900 to-blue-900 shadow-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo bên trái */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex flex-col">
            <span className="self-center text-2xl font-bold text-white tracking-wider">
              GALAXY CINEMA
            </span>
            <span className="self-center text-xs text-cyan-300 tracking-widest mt-1">
              GSTAR
            </span>
          </div>
        </div>

        {/* Menu điều hướng */}
        <div
          className="hidden w-full md:block md:w-auto"
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            {renderNavList()}

            {/* NÚT ĐĂNG NHẬP/ĐĂNG XUẤT */}
            <li>
              {userData ? (
                // ĐÃ ĐĂNG NHẬP - HIỆN NÚT ĐĂNG XUẤT
                <button
                  onClick={handleLogout}
                  className="block py-2 px-3 text-white rounded md:p-0 transition-colors duration-200 hover:text-cyan-300 cursor-pointer"
                >
                  ĐĂNG XUẤT ({userData.taiKhoan || userData.hoTen})
                </button>
              ) : (
                // CHƯA ĐĂNG NHẬP - HIỆN NÚT ĐĂNG NHẬP
                <NavLink
                  className={({ isActive }) =>
                    `block py-2 px-3 text-white rounded md:p-0 transition-colors duration-200 ${
                      isActive
                        ? "bg-cyan-700 md:bg-transparent md:text-cyan-300 font-bold"
                        : "hover:text-cyan-300"
                    }`
                  }
                  to="/login"
                >
                  ĐĂNG NHẬP
                </NavLink>
              )}
            </li>
          </ul>
        </div>

        {/* Nút menu mobile - giữ nguyên */}
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
