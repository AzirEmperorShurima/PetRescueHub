import { useToast } from '@chakra-ui/react';

/**
 * Custom hook để xử lý lỗi API có hỗ trợ toast
 */
const useApiErrorHandler = () => {
  const toast = useToast();

  const handleApiError = (error, defaultMessage = 'Đã xảy ra lỗi', showToast = true) => {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      defaultMessage;

    console.error('API Error:', error);

    if (showToast) {
      toast({
        title: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    if (error?.response) {
      const { status } = error.response;

      switch (status) {
        case 400:
          console.log('Lỗi dữ liệu đầu vào:', error.response.data);
          break;
        case 403:
          toast({
            title: 'Bạn không có quyền thực hiện hành động này',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          break;
        case 404:
          toast({
            title: 'Không tìm thấy dữ liệu yêu cầu',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          break;
        case 500:
          toast({
            title: 'Lỗi máy chủ, vui lòng thử lại sau',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          break;
        default:
          break;
      }
    }

    return errorMessage;
  };

  const withErrorHandling = (asyncFunction, options = {}) => {
    return async (...args) => {
      const {
        defaultErrorMessage = 'Đã xảy ra lỗi',
        showToast = true,
        onError = null,
      } = options;

      try {
        return await asyncFunction(...args);
      } catch (error) {
        const errorMessage = handleApiError(error, defaultErrorMessage, showToast);

        if (onError && typeof onError === 'function') {
          onError(error, errorMessage);
        }

        throw error;
      }
    };
  };

  return { handleApiError, withErrorHandling };
};

export default useApiErrorHandler;