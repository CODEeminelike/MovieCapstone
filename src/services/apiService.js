import axios from "axios";
import { storage } from "../helpers/localStorageHelper";
import { API_CONFIG } from "../constants/constant";

const createApi = (userType = "ADMIN_INFO") => {
  const api = axios.create({
    baseURL: "https://movienew.cybersoft.edu.vn/api/",
  });

  api.interceptors.request.use((config) => {
    const userInfo = storage.get(userType);
    const accessToken = userInfo
      ? `Bearer ${userInfo.accessToken}`
      : "";

    config.headers = {
      ...config.headers,
      Authorization: accessToken,
      TokenCybersoft: API_CONFIG.TOKEN,
    };
    return config;
  });
  return api;
};

// Export các instance khác nhau
export const adminApi = createApi("ADMIN_INFO");
export const userApi = createApi("USER_INFO");
export const guestApi = createApi(""); // không có token
