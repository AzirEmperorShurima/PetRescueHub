import apiService from './api.service';

const rescueService = {
  /**
   * Gửi báo cáo cứu hộ mới
   * @param {Object} rescueData - Dữ liệu báo cáo cứu hộ
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  createRescueMission: async (rescueData) => {
    try {
      const response = await apiService.post('/rescue-missions', rescueData);
      return response.data;
    } catch (error) {
      console.error('Error creating rescue mission:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin báo cáo cứu hộ theo ID
   * @param {String} missionId - ID của báo cáo cứu hộ
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  getRescueMission: async (missionId) => {
    try {
      const response = await apiService.get(`/rescue-missions/${missionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rescue mission:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách báo cáo cứu hộ của người dùng
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  getUserRescueMissions: async () => {
    try {
      const response = await apiService.get('/rescue-missions/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user rescue missions:', error);
      throw error;
    }
  }
};

export default rescueService;