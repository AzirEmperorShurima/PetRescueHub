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

  // Mapping tab index → postType
  const postTypeMap = ['', 'Question', 'EventPost', 'FindLostPetPost'];

  // Debounce fetch
  const debouncedFetch = useCallback(
    debounce((search, sort, postType) => {
      fetchPosts(search, sort, postType);
    }, 500),
    []
  );

  // Fetch ngay khi mount hoặc sort/postType thay đổi
  useEffect(() => {
    fetchPosts(searchTerm, sortBy, postTypeFilter);
  }, [sortBy, postTypeFilter]);

  // Debounce khi searchTerm thay đổi
  useEffect(() => {
    debouncedFetch(searchTerm, sortBy, postTypeFilter);
    return debouncedFetch.cancel;
  }, [searchTerm, sortBy, postTypeFilter, debouncedFetch]);

  const fetchPosts = async (search, sort, postType) => {
    setLoading(true);
    try {
      const params = {
        search,
        sort,
        postType,
        limit: 100,
      };

      const response = await apiService.forum.posts.getAll(params);
      const data = response.data?.data || [];

      const newPosts = data;
      const newQuestions = [];
      const newEvents = [];
      const newLostPets = [];

      data.forEach(post => {
        switch (post.postType) {
          case 'Question':
            newQuestions.push(post);
            break;
          case 'EventPost':
            newEvents.push(post);
            break;
          case 'FindLostPetPost':
            newLostPets.push(post);
            break;
        }
      });

      setPosts(newPosts);
      setQuestions(newQuestions);
      setEvents(newEvents);
      setFindLostPet(newLostPets);

    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
      setQuestions([]);
      setEvents([]);
      setFindLostPet([]);
    } finally {
      setLoading(false);
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

  const handleToggleLike = useCallback(async (id, reactionType) => {
    try {
      // Optimistic UI Update - Cập nhật UI ngay lập tức
      // Component Reaction đã xử lý việc cập nhật UI
      
      // Gọi API thông qua service
      await apiService.forum.reactions.addOrUpdate({
        targetId: id,
        targetType: 'Post',
        reactionType: reactionType || 'like'
      });
      
      // Không cần fetch lại dữ liệu ngay lập tức
      // Chỉ fetch lại sau một khoảng thời gian để đảm bảo dữ liệu đồng bộ
      // nhưng không làm gián đoạn trải nghiệm người dùng
    } catch (err) {
      console.error('Error toggling reaction:', err);
      // Có thể thêm logic để khôi phục UI nếu API thất bại
    }
  }, []);

  const handleToggleFavorite = useCallback(async (id) => {
    try {
      // Placeholder for favorite toggle
      fetchPosts(searchTerm, sortBy, postTypeFilter);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  }, [searchTerm, sortBy, postTypeFilter]);

  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  }, []);

  return {
    loading,
    posts,
    questions,
    eventspost: events,
    findLostPet,
    searchTerm,
    sortBy,
    postTypeFilter,
    tabValue,
    filterAnchorEl,
    categories,
    handleSearchChange,
    handleSortChange,
    handleTabChange,
    handleFilterClick,
    handleFilterClose,
    handleToggleLike,
    handleToggleFavorite,
    formatDate,
  };
};