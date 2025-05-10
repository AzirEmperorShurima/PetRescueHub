import { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/api.service';
import debounce from 'lodash.debounce';

export const useForum = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [posts, setPosts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [events, setEvents] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [findLostPet, setFindLostPet] = useState([]); // Add new state

  // Debounce search để giảm spam API
  const debouncedFetch = useCallback(
    debounce((search, sort, category) => {
      fetchPosts(search, sort, category);
    }, 500),
    []
  );

  // Khi mount hoặc sort/category thay đổi → fetch ngay
  useEffect(() => {
    fetchPosts(searchTerm, sortBy, categoryFilter);
  }, [sortBy, categoryFilter]);

  // Khi searchTerm thay đổi → debounce rồi fetch
  useEffect(() => {
    debouncedFetch(searchTerm, sortBy, categoryFilter);
    return debouncedFetch.cancel;
  }, [searchTerm, sortBy, categoryFilter, debouncedFetch]);

  // Hàm chính gọi API lấy posts
  const fetchPosts = async (search, sort, category) => {
    setLoading(true);
    try {
      const params = {
        search,
        sort,
        category,
        limit: 10
      };

      const [postsRes, questionsRes, eventsRes, petPostRes] = await Promise.all([
        apiService.forum.posts.getAll({ ...params, postType: 'Post' }),
        apiService.forum.posts.getAll({ ...params, postType: 'Question' }),
        apiService.forum.posts.getAll({ ...params, postType: 'Event' }),
        apiService.forum.posts.getAll({ ...params, postType: 'FindLostPetPost' })
      ]);

      setPosts(postsRes.data?.data || []);
      setQuestions(questionsRes.data?.data || []);
      setEvents(eventsRes.data?.data || []);
      setFindLostPet(petPostRes.data?.data || []); // Fix the undefined setPetPost
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
      setQuestions([]);
      setEvents([]);
      setFindLostPet([]); // Add this line
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleSearchChange = useCallback(e => setSearchTerm(e.target.value), []);
  const handleSortChange = useCallback(val => setSortBy(val), []);
  const handleCategoryChange = useCallback(cat => setCategoryFilter(prev => prev === cat ? '' : cat), []);
  const handleTabChange = useCallback((e, newValue) => setTabValue(newValue), []);
  const handleFilterClick = useCallback(e => setFilterAnchorEl(e.currentTarget), []);
  const handleFilterClose = useCallback(() => setFilterAnchorEl(null), []);
  
  const handleToggleLike = useCallback(async (id, type) => {
    try {
      await apiService.forum.posts.likePost(id);
      fetchPosts(searchTerm, sortBy, categoryFilter);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  }, [searchTerm, sortBy, categoryFilter]);

  const handleToggleFavorite = useCallback(async (id, type) => {
    try {
      // Implement favorite toggle logic here
      fetchPosts(searchTerm, sortBy, categoryFilter);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  }, [searchTerm, sortBy, categoryFilter]);

  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  }, []);

  return {
    loading,
    posts,
    questions,
    events,
    findLostPet, // Add this to return object
    searchTerm,
    sortBy,
    categoryFilter,
    tabValue,
    filterAnchorEl,
    categories,
    handleSearchChange,
    handleSortChange,
    handleCategoryChange,
    handleTabChange,
    handleFilterClick,
    handleFilterClose,
    handleToggleLike,
    handleToggleFavorite,
    formatDate
  };
};
