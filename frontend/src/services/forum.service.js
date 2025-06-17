import apiService from './api.service';
import api from '../utils/axios';

/**
 * ForumService - Xử lý logic nghiệp vụ liên quan đến diễn đàn
 * Gọi API và xử lý dữ liệu trả về
 */
class ForumService {
  /**
   * Cập nhật bài viết
   * @param {string} id - ID bài viết
   * @param {Object} data - Dữ liệu cập nhật
   * @returns {Promise<Object>} Kết quả từ API
   */
  async updatePost(id, data) {
    try {
      const response = await api.put(`/forum/posts/${id}`, data, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Update post API error:', error);
      throw error;
    }
  }

  /**
   * Xóa bài viết
   * @param {string} id - ID bài viết
   * @returns {Promise<Object>} Kết quả từ API
   */
  async deletePost(id) {
    try {
      const response = await api.delete(`/forum/posts/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Delete post API error:', error);
      throw error;
    }
  }

  /**
   * Thêm hoặc cập nhật reaction cho bài viết
   * @param {Object} data - Dữ liệu reaction
   * @param {string} data.targetId - ID của đối tượng (bài viết, bình luận)
   * @param {string} data.targetType - Loại đối tượng ('Post', 'Comment')
   * @param {string} data.reactionType - Loại reaction ('like', 'love', 'haha', 'wow', 'sad', 'angry')
   * @returns {Promise<Object>} Kết quả từ API
   */
  async addReaction(data) {
    try {
      const response = await api.post(`/forum/reactions/post`, data, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Reaction API error:', error);
      throw error;
    }
  }
  
  /**
   * Lấy danh sách bình luận
   * @param {Object} params - Tham số truy vấn
   * @returns {Promise<Object>} Kết quả từ API
   */
  async getComments(params) {
    try {
      const response = await api.get('/forum/comments', { params });
      return response.data;
    } catch (error) {
      console.error('Get comments API error:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách bình luận theo ID bài viết
   * @param {string} postId - ID bài viết
   * @returns {Promise<Object>} Kết quả từ API
   */
  async getCommentsByPostId(postId) {
    try {
      const response = await api.get(`/forum/comments/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Get comments by post ID API error:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách bình luận theo ID câu hỏi
   * @param {string} questionId - ID câu hỏi
   * @returns {Promise<Object>} Kết quả từ API
   */
  async getCommentsByQuestionId(questionId) {
    try {
      const response = await api.get(`/forum/comments/${questionId}`);
      return response.data;
    } catch (error) {
      console.error('Get comments by question ID API error:', error);
      throw error;
    }
  }

  /**
   * Tạo bình luận mới
   * @param {Object} data - Dữ liệu bình luận
   * @returns {Promise<Object>} Kết quả từ API
   */
  async createComment(data) {
    try {
      const response = await api.post('/forum/comments/new', data, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Create comment API error:', error);
      throw error;
    }
  }

  /**
   * Cập nhật bình luận
   * @param {string} id - ID bình luận
   * @param {Object} data - Dữ liệu cập nhật
   * @returns {Promise<Object>} Kết quả từ API
   */
  async updateComment(id, data) {
    try {
      const response = await api.put(`/forum/comments/${id}`, data, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Update comment API error:', error);
      throw error;
    }
  }

  /**
   * Xóa bình luận
   * @param {string} id - ID bình luận
   * @returns {Promise<Object>} Kết quả từ API
   */
  async deleteComment(id) {
    try {
      const response = await api.delete(`/forum/comments/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Delete comment API error:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách tags
   * @returns {Promise<Object>} Kết quả từ API
   */
  async getTags() {
    try {
      const response = await api.get('/forum/tags');
      return response.data;
    } catch (error) {
      console.error('Get tags API error:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin tag theo ID
   * @param {string} id - ID tag
   * @returns {Promise<Object>} Kết quả từ API
   */
  async getTagById(id) {
    try {
      const response = await api.get(`/forum/tags/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get tag by ID API error:', error);
      throw error;
    }
  }

  /**
   * Tạo bài viết mới
   * @param {Object} data - Dữ liệu bài viết
   * @returns {Promise<Object>} Kết quả từ API
   */
  async createNewPost(data) {
    try {
      // Sử dụng apiService.forum.posts.create đã được định nghĩa trong api.service.js
      const response = await apiService.forum.posts.create(data);
      return response.data;
    } catch (error) {
      console.error('Create post API error:', error);
      throw error;
    }
  }

  /**
   * Tạo bài viết mới với FormData (hỗ trợ upload file)
   * @param {FormData} formData - FormData chứa dữ liệu bài viết và file
   * @returns {Promise<Object>} Kết quả từ API
   */
  async createNewPostWithImage(formData) {
    try {
      console.log('Gọi API tạo bài viết với FormData');
      
      // Kiểm tra nội dung của FormData
      console.log('FormData entries trong service:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      // Tạo FormData mới để đảm bảo tên trường chính xác
      const newFormData = new FormData();
      
      // Sao chép các trường từ formData gốc
      for (let [key, value] of formData.entries()) {
        // Đổi tên trường imgUrl thành image nếu đó là file
        if (key === 'imgUrl' && value instanceof File) {
          newFormData.append('image', value, value.name);
        } else {
          newFormData.append(key, value);
        }
      }
      
      // Gọi API với FormData đã được điều chỉnh
      const response = await api.post('/forum/posts/new', newFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      
      console.log('Kết quả từ API:', response);
      return response.data;
    } catch (error) {
      console.error('Chi tiết lỗi API createNewPost:', error.response || error);
      throw error;
    }
  }

}

export default new ForumService();