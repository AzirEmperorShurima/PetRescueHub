import { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/api.service';

// Custom debounce function
const debounce = (func, delay) => {
  let timeoutId;
  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
};

export const useForum = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [postTypeFilter, setPostTypeFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const [posts, setPosts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [events, setEvents] = useState([]);
  const [findLostPet, setFindLostPet] = useState([]);

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [categories, setCategories] = useState([]);

  // Mapping tab index → postType - Cập nhật lại thứ tự cho phù hợp với UI mới
  const postTypeMap = ['ForumPost', 'Question', 'EventPost', 'FindLostPetPost'];

  // Debounce fetch
  const debouncedFetch = useCallback(
    debounce((search, sort, postType) => {
      fetchPosts(search, sort, postType);
    }, 500),
    []
  );

  // Fetch posts
  const fetchPosts = async (search, sort, postType) => {
    setLoading(true);
    setError(null);
    try {
      const params = { search, sort, postType, limit: 100 };
      const response = await apiService.forum.posts.getAll(params);
      const data = response.data?.data || [];

      const categorizedPosts = categorizePosts(data);
      updatePostStates(categorizedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      resetPostStates();
    } finally {
      setLoading(false);
    }
  };

  // Categorize posts by type
  const categorizePosts = (data) => {
    return data.reduce((acc, post) => {
      switch (post.postType) {
        case 'Question':
          acc.questions.push(post);
          break;
        case 'EventPost':
          acc.events.push(post);
          break;
        case 'FindLostPetPost':
          acc.findLostPet.push(post);
          break;
      }
      acc.all.push(post);
      return acc;
    }, { all: [], questions: [], events: [], findLostPet: [] });
  };

  // Update all post states
  const updatePostStates = (categorizedPosts) => {
    setPosts(categorizedPosts.all);
    setQuestions(categorizedPosts.questions);
    setEvents(categorizedPosts.events);
    setFindLostPet(categorizedPosts.findLostPet);
  };

  // Reset all post states
  const resetPostStates = () => {
    setPosts([]);
    setQuestions([]);
    setEvents([]);
    setFindLostPet([]);
  };

  // Post actions
  const createPost = async (postData) => {
    try {
      const response = await apiService.forum.posts.create(postData);
      await fetchPosts(searchTerm, sortBy, postTypeFilter);
      return response.data;
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  const updatePost = async (postId, postData) => {
    try {
      const response = await apiService.forum.posts.update(postId, postData);
      await fetchPosts(searchTerm, sortBy, postTypeFilter);
      return response.data;
    } catch (err) {
      console.error('Error updating post:', err);
      throw err;
    }
  };

  const deletePost = async (postId) => {
    try {
      await apiService.forum.posts.delete(postId);
      await fetchPosts(searchTerm, sortBy, postTypeFilter);
    } catch (err) {
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  // Reaction handling
  const handleReaction = async (targetId, reactionType) => {
    try {
      if (reactionType) {
        await apiService.forum.reactions.add({
          targetId,
          targetType: 'Post',
          reactionType
        });
      } else {
        await apiService.forum.reactions.delete(targetId, 'Post');
      }
      await fetchPosts(searchTerm, sortBy, postTypeFilter);
    } catch (err) {
      console.error('Error handling reaction:', err);
      throw err;
    }
  };

  // Favorite handling
  const toggleFavorite = async (postId, isFavorited) => {
    try {
      if (isFavorited) {
        await apiService.forum.posts.favorite.remove(postId);
      } else {
        await apiService.forum.posts.favorite.add(postId);
      }
      await fetchPosts(searchTerm, sortBy, postTypeFilter);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw err;
    }
  };

  // Comment actions
  const getPostComments = async (postId) => {
    try {
      const response = await apiService.forum.comments.getByPost(postId);
      return response.data?.data || [];
    } catch (err) {
      console.error('Error fetching comments:', err);
      throw err;
    }
  };

  const createComment = async (postId, content) => {
    try {
      await apiService.forum.comments.create({ postId, content });
      return await getPostComments(postId);
    } catch (err) {
      console.error('Error creating comment:', err);
      throw err;
    }
  };

  const updateComment = async (commentId, content, postId) => {
    try {
      await apiService.forum.comments.update(commentId, { content });
      return await getPostComments(postId);
    } catch (err) {
      console.error('Error updating comment:', err);
      throw err;
    }
  };

  const deleteComment = async (commentId, postId) => {
    try {
      await apiService.forum.comments.delete(commentId);
      return await getPostComments(postId);
    } catch (err) {
      console.error('Error deleting comment:', err);
      throw err;
    }
  };

  // Report handling
  const reportPost = async (postId, reason) => {
    try {
      await apiService.forum.reports.post(postId, reason);
    } catch (err) {
      console.error('Error reporting post:', err);
      throw err;
    }
  };

  const reportComment = async (commentId, reason) => {
    try {
      await apiService.forum.reports.comment(commentId, reason);
    } catch (err) {
      console.error('Error reporting comment:', err);
      throw err;
    }
  };

  // Handlers
  const handleSearchChange = useCallback(e => setSearchTerm(e.target.value), []);
  const handleSortChange = useCallback(val => setSortBy(val), []);
  const handleTabChange = useCallback((e, newValue) => {
    setTabValue(newValue);
    setPostTypeFilter(postTypeMap[newValue]);
  }, []);

  const handleFilterClick = useCallback(e => setFilterAnchorEl(e.currentTarget), []);
  const handleFilterClose = useCallback(() => setFilterAnchorEl(null), []);

  // Effects
  useEffect(() => {
    fetchPosts(searchTerm, sortBy, postTypeFilter);
  }, [sortBy, postTypeFilter]);

  useEffect(() => {
    debouncedFetch(searchTerm, sortBy, postTypeFilter);
    return debouncedFetch.cancel;
  }, [searchTerm, debouncedFetch]);

  return {
    // States
    loading,
    error,
    posts,
    questions,
    events,
    findLostPet,
    searchTerm,
    sortBy,
    postTypeFilter,
    tabValue,
    filterAnchorEl,
    categories,

    // State setters
    setSearchTerm,
    setSortBy,
    setPostTypeFilter,
    setTabValue,
    setPosts,
    setQuestions,
    setEvents,
    setFindLostPet,

    // Post actions
    createPost,
    updatePost,
    deletePost,
    handleReaction,
    toggleFavorite,

    // Comment actions
    getPostComments,
    createComment,
    updateComment,
    deleteComment,

    // Report actions
    reportPost,
    reportComment,

    // Utils
    formatDate: (date) => new Date(date).toLocaleDateString('vi-VN'),

    // Handlers
    handleSearchChange,
    handleSortChange,
    handleTabChange,
    handleFilterClick,
    handleFilterClose
  };
};