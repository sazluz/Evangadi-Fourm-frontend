import axios from "axios"
const axiosinstance = axios.create({
  baseURL: "http://localhost:5000/api",
});
export default axiosinstance