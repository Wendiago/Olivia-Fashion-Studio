import customAxios from "./customApi";

class TransactionApi {
  async getAllTransaction() {
    try {
      const response = await customAxios.get(`/payment/transactions`);
      return response;
    } catch (error) {
      return error.response;
    }
  }
  async topUp(data) {
    try {
      const response = await customAxios.post(`/payment/deposit`, data);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async getAccountBalance() {
    try {
      const response = await customAxios.get(`/payment/get-amount`);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async getAllTransactionForAdmin(page, limit) {
    try {
      const response = await customAxios.get(`/payment/getAllTransaction?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default new TransactionApi();
