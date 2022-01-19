import axios from "axios";
import { cloneDeep } from "lodash";
import {fetchFromStorage} from "../utilities/Storage"

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  axiosInstance.interceptors.request.use(async (config) => {
    const clonedConfig = cloneDeep(config);
    const token = fetchFromStorage("token");
  
    if (token) {
      clonedConfig.headers.common = {
        Authorization: `Bearer ${token}`,
      };
    }
  
    return clonedConfig;
  });
  
  export default axiosInstance;
  