import customAxios from "./customApi";

class PaymentApi {
    async sendPin() {
        try {
            const response = await customAxios.post(`/payment/send`, {});
            return response;
        } catch (error) {
            return error.response;
        }
    }
    async sendCode(data) {
        try {
        const response = await customAxios.post(`/payment/send-code`, {code: data});
        return response;
        } catch (error) {
        return error.response;
        }
    }
    async sendPaymentData(data) {
        try {
            const response = await customAxios.post(`/payment/send-datapayment`, {amount: data});
            return response;
        } catch (error) {
            return error.response;
        }
    }
}

export default new PaymentApi();
