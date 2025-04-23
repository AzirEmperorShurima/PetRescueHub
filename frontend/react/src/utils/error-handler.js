import { toast } from 'react-toastify';

/**
 * Xử lý lỗi từ API một cách nhất quán
 * @param {Error} error - Lỗi từ API
 * @param {string} defaultMessage - Thông báo mặc định nếu không có thông báo lỗi cụ thể
 * @param {boolean} showToast - Có hiển thị toast thông báo lỗi hay không
 * @returns {string} Thông báo lỗi
 */
export const handleApiError = (error, defaultMessage = 'Đã xảy ra lỗi', showToast = true) => {
  const errorMessage = error.response?.data?.message || 
                       error.message || 
                       defaultMessage;
  
  console.error('API Error:', error);
  
  if (showToast) {
    toast.error(errorMessage);
  }
  
  // Xử lý các mã lỗi HTTP cụ thể
  if (error.response) {
    const { status } = error.response;
    
    switch (status) {
      case 400:
        console.log('Lỗi dữ liệu đầu vào:', error.response.data);
        break;
      case 401:
        // Đã được xử lý trong axios interceptor
        break;
      case 403:
        // Forbidden - Không có quyền truy cập
        toast.error('Bạn không có quyền thực hiện hành động này');
        break;
      case 404:
        // Not Found
        toast.error('Không tìm thấy dữ liệu yêu cầu');
        break;
      case 500:
        // Server Error
        toast.error('Lỗi máy chủ, vui lòng thử lại sau');
        break;
      default:
        // Các lỗi khác
        break;
    }
  }
  
  return errorMessage;
};

/**
 * Bọc một hàm async để xử lý lỗi một cách nhất quán
 * @param {Function} asyncFunction - Hàm async cần bọc
 * @param {Object} options - Các tùy chọn xử lý lỗi
 * @returns {Function} Hàm đã được bọc
 */
export const withErrorHandling = (asyncFunction, options = {}) => {
  return async (...args) => {
    const { 
      defaultErrorMessage = 'Đã xảy ra lỗi', 
      showToast = true,
      onError = null
    } = options;
    
    try {
      return await asyncFunction(...args);
    } catch (error) {
      const errorMessage = handleApiError(error, defaultErrorMessage, showToast);
      
      // Gọi callback onError nếu được cung cấp
      if (onError && typeof onError === 'function') {
        onError(error, errorMessage);
      }
      
      throw error; // Re-throw để component có thể xử lý thêm nếu cần
    }
  };
};

export default {
  handleApiError,
  withErrorHandling
};