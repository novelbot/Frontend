// src/API/tokenAPI.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // 서버 주소 예: https://api.novelbot.org
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // localStorage에서 토큰 가져오기

    try {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    } catch (err) {
      console.error("Axios 요청 인터셉터 오류:", err);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

export default instance;
