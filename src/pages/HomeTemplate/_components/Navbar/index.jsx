import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "../../../../routes";
import { logout } from "../../LoginPage/slice";
import { useState } from "react";

export default function Navbar() {
  const dispatch = useDispatch();
  const userData = useSelector(
    (state) => state.authUserReducer?.data
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderNavList = () => {
    const mainRoutes = routes[0].nested;

    return mainRoutes.map((route, index) => {
      if (route.hiddenNav) return null;

      return (
        <li key={index}>
          <NavLink
            className={({ isActive }) =>
              `block py-3 px-4 lg:py-2 lg:px-3 rounded-lg transition-all duration-300 font-medium ${
                isActive
                  ? "bg-white/20 text-white shadow-lg lg:bg-transparent lg:text-cyan-300 lg:font-bold lg:border-b-2 lg:border-cyan-300"
                  : "text-white/90 hover:bg-white/10 hover:text-white lg:hover:text-cyan-300 lg:hover:bg-transparent"
              }`
            }
            to={route.path}
            end={route.path === ""}
            onClick={() => setIsMenuOpen(false)}
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
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-cyan-800 via-blue-800 to-cyan-900 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold  tracking-wider bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
                GALAXY CINEMA
              </span>
              <span className="text-xs text-cyan-300/80 tracking-widest mt-0.5 font-light">
                EXPERIENCE THE MAGIC
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <ul className="flex items-center space-x-1 xl:space-x-2">
              {renderNavList()}

              {/* User Section */}
              <li className="ml-2">
                {userData ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-cyan-200 text-sm font-medium px-3 py-1 bg-white/10 rounded-full">
                      👋 {userData.taiKhoan || userData.hoTen}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-white/90 hover:text-white hover:bg-red-600/20 px-3 py-2 rounded-lg transition-all duration-300 font-medium border border-transparent hover:border-red-400/30"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <NavLink
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                        isActive
                          ? "bg-cyan-500 text-white shadow-lg"
                          : "bg-white/10 text-white hover:bg-white/20 hover:shadow-lg border border-white/20"
                      }`
                    }
                    to="/login"
                  >
                    Đăng nhập
                  </NavLink>
                )}
              </li>
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-4 space-y-1 bg-blue-900/50 backdrop-blur-sm rounded-lg mt-2 border border-white/10 shadow-2xl">
              <ul className="space-y-1">
                {renderNavList()}

                {/* Mobile User Section */}
                <li className="border-t border-white/20 pt-2 mt-2">
                  {userData ? (
                    <div className="space-y-2">
                      <div className="px-4 py-2 text-cyan-200 text-sm font-medium bg-white/10 rounded-lg">
                        👋 Xin chào,{" "}
                        {userData.taiKhoan || userData.hoTen}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-white bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors duration-200 font-medium border border-red-400/30"
                      >
                        🚪 Đăng xuất
                      </button>
                    </div>
                  ) : (
                    <NavLink
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                          isActive
                            ? "bg-cyan-500 text-white shadow-lg"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`
                      }
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      🔐 Đăng nhập
                    </NavLink>
                  )}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
