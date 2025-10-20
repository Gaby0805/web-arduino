import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://arduino-rirau-ipyra.onrender.com",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;