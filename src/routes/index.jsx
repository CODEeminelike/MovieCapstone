import HomeTemplate from "../pages/HomeTemplate";
import HomePage from "../pages/HomeTemplate/HomePage";
import AboutPage from "../pages/HomeTemplate/AboutPage";
import ListMoviePage from "../pages/HomeTemplate/ListMoviePage";
import DetailPage from "../pages/HomeTemplate/DetailPage";
import AdminTemplate from "../pages/AdminTemplate";
import Dashboard from "../pages/AdminTemplate/Dashboard";
import AddUserPage from "../pages/AdminTemplate/AddUserPage";
import AuthPage from "../pages/AdminTemplate/AuthPage";
import { Route } from "react-router-dom";
import Login from "../pages/HomeTemplate/LoginPage";
import Register from "../pages/HomeTemplate/RegisterPage";
import SeatSelection from "../pages/HomeTemplate/Booking/seatSelection";

export const routes = [
  {
    path: "",
    element: HomeTemplate,
    nested: [
      { path: "", element: HomePage, name: "TRANG CHỦ" },
      { path: "about", element: AboutPage, name: "GIỚI THIỆU" },
      { path: "list-movie", element: ListMoviePage, name: "PHIM" },
      { path: "detail/:id", element: DetailPage, hiddenNav: true }, // Không hiển thị trong nav
      {
        path: "booking/:maLichChieu",
        element: SeatSelection,
        hiddenNav: true,
      },
      {
        path: "login",
        element: Login,
        name: "ĐĂNG NHẬP",
        hiddenNav: true,
      },
      {
        path: "register",
        element: Register,
        name: "ĐĂNG KÍ",
        hiddenNav: true,
      },
    ],
  },

  {
    path: "admin",
    element: AdminTemplate,
    nested: [
      { path: "dashboard", element: Dashboard, name: "DASHBOARD" },
      {
        path: "add-user",
        element: AddUserPage,
        name: "THÊM NGƯỜI DÙNG",
      },
    ],
  },
  {
    path: "auth",
    element: AuthPage,
    hiddenNav: true, // Không hiển thị trong nav
  },
];

export const renderRoutes = (routesArray = routes) => {
  return routesArray.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={<route.element />}
    >
      {route.nested && renderRoutes(route.nested)}
    </Route>
  ));
};
