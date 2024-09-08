import customAxios from "./customApi";
import { toast } from "react-toastify";

class AuthApi {
  async register(data) {
    const response = await customAxios.post(`/auth/register`, data);
    return response;
  }
  async login(data) {
    const response = await customAxios.post(`/auth/login`, data);
    return response;
  }
  async logout() {
    const response = await customAxios.post(`/auth/logout`, {});
    return response;
  }

  async update(userId, data) {
    const response = await customAxios.post(`/auth/update/${userId}`, data);
    return response;
  }

  async getInfo() {
    const response = await customAxios.get(`/auth/info`);
    return response;
  }
}

export default new AuthApi();
