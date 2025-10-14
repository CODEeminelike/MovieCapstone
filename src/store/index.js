import { configureStore } from "@reduxjs/toolkit";
import listMovieReducer from "@/pages/HomeTemplate/ListMoviePage/slice";
import detailReducer from "@/pages/HomeTemplate/Detailpage/slice";
import authReducer from "@/pages/AdminTemplate/AuthPage/slice";
import addUserReducer from "@/pages/AdminTemplate/AddUserPage/slice";
import authUserReducer from "@/pages/HomeTemplate/LoginPage/slice";
import authUserRegisterReducer from "@/pages/HomeTemplate/RegisterPage/slice";
import listBannerReducer from "@/pages/HomeTemplate/HomePage/BannerPage/slice";
import moviesWithPaginationReducer from "@/pages/HomeTemplate/HomePage/MoviePagination/slice";
import theaterSlice from "@/pages/HomeTemplate/DetailPage/TheaterList/theaterSlice";

//src\pages\HomeTemplate\DetailPage\TheaterList\slice.js
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
    theaterSlice,
  },
});
