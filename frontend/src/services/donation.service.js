import api from '../utils/axios';

const donationService = {

  // Thêm các phương thức thanh toán
  createMomoPayment: async (amount) => {
    try {
      const response = await api.post('/user/user/payments/momo/transactions/create', { amount });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tạo giao dịch MOMO');
    }
  },

  createVnPayPayment: async (amount) => {
    try {
      const response = await api.post('/user/user/payments/vnpay/transactions/create', { amount });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tạo giao dịch VNPay');
    }
  },

  createZaloPayment: async (amount) => {
    try {
      const response = await api.post('/user/user/payments/zalopay/transactions/create', { amount });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tạo giao dịch ZaloPay');
    }
  }
};

export default donationService;