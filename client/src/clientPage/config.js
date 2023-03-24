import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "https://registrar-online-appointment-gsko.onrender.com/api",
});
