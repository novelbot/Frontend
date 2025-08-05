import axios from "axios";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,

    withCredentials: false,
    headers:{
        "Content-Type": "application/json",
    },
    timeout: 10000,
});