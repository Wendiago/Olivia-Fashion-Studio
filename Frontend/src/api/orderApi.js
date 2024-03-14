import customAxios from "./customApi";

class OrderApi {
  async createOrder(name, address, phone, items, totalPrice) {
    try {
      const response = await customAxios.post(`/order/create`, {
        name: name,
        address: address,
        phone: phone,
        items: items,
        totalPrice: totalPrice,
        status: 'COMPLETED'
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default new OrderApi();
