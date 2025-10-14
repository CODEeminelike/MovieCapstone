import { configureStore } from "@reduxjs/toolkit";
import listMovieReducer from "@/pages/HomeTemplate/ListMoviePage/slice";
import detailReducer from "@/pages/HomeTemplate/Detailpage/slice";
import authReducer from "@/pages/AdminTemplate/AuthPage/slice";
import addUserReducer from "@/pages/AdminTemplate/AddUserPage/slice";
import authUserReducer from "@/pages/HomeTemplate/LoginPage/slice";
import authUserRegisterReducer from "@/pages/HomeTemplate/RegisterPage/slice";
import listBannerReducer from "@/pages/HomeTemplate/HomePage/BannerPage/slice";
import moviesWithPaginationReducer from "@/pages/HomeTemplate/HomePage/MoviePagination/slice";

//D:\Hard\Cyber\sbc_react\capstone\src\pages\HomeTemplate\HomePage\MoviePagination\slice.js
export const store = configureStore({
  reducer: {
    listMovieReducer,
    detailReducer,
    authReducer,
    addUserReducer,
    authUserReducer,
    authUserRegisterReducer,
    listBannerReducer,
    moviesWithPaginationReducer,
  },
});
