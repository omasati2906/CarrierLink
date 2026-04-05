import axios from "axios";

export const BASE_URL = "https://carrierlink.onrender.com";

export default axios.create({
   baseURL: BASE_URL,
});