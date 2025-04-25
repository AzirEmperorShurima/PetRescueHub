import apiService from './api.service';

const forumService = {
  // Bài viết
  getPosts: (params) => apiService.forum.posts.getAll(params),
  getPostById: (id) => apiService.forum.posts.getById(id),
  createPost: (data) => apiService.forum.posts.create(data),
  updatePost: (id, data) => apiService.forum.posts.update(id, data),
  deletePost: (id) => apiService.forum.posts.delete(id),
  likePost: (id) => apiService.forum.posts.update(id, { action: 'like' }),
  unlikePost: (id) => apiService.forum.posts.update(id, { action: 'unlike' }),
  
  // Câu hỏi
  getQuestions: (params) => apiService.forum.questions.getAll(params),
  getQuestionById: (id) => apiService.forum.questions.getById(id),
  createQuestion: (data) => apiService.forum.questions.create(data),
  updateQuestion: (id, data) => apiService.forum.questions.update(id, data),
  deleteQuestion: (id) => apiService.forum.questions.delete(id),
  likeQuestion: (id) => apiService.forum.questions.update(id, { action: 'like' }),
  unlikeQuestion: (id) => apiService.forum.questions.update(id, { action: 'unlike' }),
  
  // Bình luận
  getComments: (params) => apiService.forum.comments.getAll(params),
  getCommentsByPostId: (postId) => apiService.forum.comments.getAll({ postId }),
  getCommentsByQuestionId: (questionId) => apiService.forum.comments.getAll({ questionId }),
  createComment: (data) => apiService.forum.comments.create(data),
  updateComment: (id, data) => apiService.forum.comments.update(id, data),
  deleteComment: (id) => apiService.forum.comments.delete(id),
  
  // Danh mục
  getCategories: () => apiService.forum.categories.getAll(),
  getCategoryById: (id) => apiService.forum.categories.getById(id),
  
  // Tags
  getTags: () => apiService.forum.tags.getAll(),
  getTagById: (id) => apiService.forum.tags.getById(id),
};

export default forumService;