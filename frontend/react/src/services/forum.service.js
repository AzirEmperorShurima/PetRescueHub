import api from './api';

const forumService = {
  // Bài viết
  getPosts: (params) => api.forum.posts.getAll(params),
  getPostById: (id) => api.forum.posts.getById(id),
  createPost: (data) => api.forum.posts.create(data),
  updatePost: (id, data) => api.forum.posts.update(id, data),
  deletePost: (id) => api.forum.posts.delete(id),
  likePost: (id) => api.forum.posts.update(id, { action: 'like' }),
  unlikePost: (id) => api.forum.posts.update(id, { action: 'unlike' }),
  
  // Câu hỏi
  getQuestions: (params) => api.forum.questions.getAll(params),
  getQuestionById: (id) => api.forum.questions.getById(id),
  createQuestion: (data) => api.forum.questions.create(data),
  updateQuestion: (id, data) => api.forum.questions.update(id, data),
  deleteQuestion: (id) => api.forum.questions.delete(id),
  likeQuestion: (id) => api.forum.questions.update(id, { action: 'like' }),
  unlikeQuestion: (id) => api.forum.questions.update(id, { action: 'unlike' }),
  
  // Bình luận
  getComments: (params) => api.forum.comments.getAll(params),
  getCommentsByPostId: (postId) => api.forum.comments.getAll({ postId }),
  getCommentsByQuestionId: (questionId) => api.forum.comments.getAll({ questionId }),
  createComment: (data) => api.forum.comments.create(data),
  updateComment: (id, data) => api.forum.comments.update(id, data),
  deleteComment: (id) => api.forum.comments.delete(id),
  
  // Danh mục
  getCategories: () => api.forum.categories.getAll(),
  
  // Tags
  getTags: () => api.forum.tags.getAll(),
  
  // Tìm kiếm
  search: (query) => api.forum.posts.getAll({ search: query }),
};

export default forumService;