import { useState, useEffect, useCallback, useMemo } from 'react';
import { forumPosts, forumQuestions, forumEvents, forumCategories } from '../../mocks';

export const useForum = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [posts, setPosts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Trong thực tế, bạn sẽ gọi API thực sự
        // const postsResponse = await api.get('/forum/posts');
        // const questionsResponse = await api.get('/forum/questions');
        // const eventsResponse = await api.get('/forum/events');
        
        // Sử dụng mock data
        setPosts(forumPosts);
        setQuestions(forumQuestions);
        setEvents(forumEvents);
      } catch (error) {
        console.error('Error fetching forum data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleFilterClick = useCallback((event) => {
    setFilterAnchorEl(event.currentTarget);
  }, []);

  const handleFilterClose = useCallback(() => {
    setFilterAnchorEl(null);
  }, []);

  const handleSortChange = useCallback((sortOption) => {
    setSortBy(sortOption);
    setFilterAnchorEl(null); // Sử dụng setter trực tiếp thay vì gọi handleFilterClose
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setCategoryFilter(category);
    setFilterAnchorEl(null); // Sử dụng setter trực tiếp thay vì gọi handleFilterClose
  }, []);

  const handleToggleLike = useCallback((id, type) => {
    // Trong thực tế, bạn sẽ gọi API để like/unlike
    if (type === 'post') {
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === id ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post
      ));
    } else if (type === 'question') {
      setQuestions(prevQuestions => prevQuestions.map(question => 
        question.id === id ? { ...question, isLiked: !question.isLiked, likes: question.isLiked ? question.likes - 1 : question.likes + 1 } : question
      ));
    } else if (type === 'event') {
      setEvents(prevEvents => prevEvents.map(event => 
        event.id === id ? { ...event, isLiked: !event.isLiked, likes: event.isLiked ? event.likes - 1 : event.likes + 1 } : event
      ));
    }
  }, []);

  const handleToggleFavorite = useCallback((id, type) => {
    // Trong thực tế, bạn sẽ gọi API để favorite/unfavorite
    if (type === 'post') {
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === id ? { ...post, isFavorited: !post.isFavorited } : post
      ));
    } else if (type === 'question') {
      setQuestions(prevQuestions => prevQuestions.map(question => 
        question.id === id ? { ...question, isFavorited: !question.isFavorited } : question
      ));
    } else if (type === 'event') {
      setEvents(prevEvents => prevEvents.map(event => 
        event.id === id ? { ...event, isFavorited: !event.isFavorited } : event
      ));
    }
  }, []);

  // Lọc và sắp xếp dữ liệu
  const filterAndSortData = useCallback((data) => {
    if (!Array.isArray(data)) return [];
    
    // Lọc theo từ khóa tìm kiếm
    let filteredData = data.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Lọc theo danh mục
    if (categoryFilter !== 'all') {
      filteredData = filteredData.filter(item => item.category === categoryFilter);
    }
    
    // Sắp xếp
    if (sortBy === 'newest') {
      filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filteredData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'mostLiked') {
      filteredData.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'mostCommented') {
      filteredData.sort((a, b) => b.comments - a.comments);
    } else if (sortBy === 'mostViewed') {
      filteredData.sort((a, b) => b.views - a.views);
    }
    
    // Thêm thông tin category vào mỗi item
    return filteredData.map(item => ({
      ...item,
      categoryObj: forumCategories.find(cat => cat.id === item.category) || { name: 'Unknown' }
    }));
  }, [searchTerm, categoryFilter, sortBy]);

  const filteredPosts = useMemo(() => filterAndSortData(posts), [filterAndSortData, posts]);
  const filteredQuestions = useMemo(() => filterAndSortData(questions), [filterAndSortData, questions]);
  const filteredEvents = useMemo(() => filterAndSortData(events), [filterAndSortData, events]);

  // Format date
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }, []);

  return {
    loading,
    tabValue,
    posts,
    questions,
    events,
    searchTerm,
    filterAnchorEl,
    sortBy,
    categoryFilter,
    filteredPosts,
    filteredQuestions,
    filteredEvents,
    forumCategories, // Đảm bảo forumCategories được trả về từ hook
    handleTabChange,
    handleSearchChange,
    handleFilterClick,
    handleFilterClose,
    handleSortChange,
    handleCategoryChange,
    handleToggleLike,
    handleToggleFavorite,
    formatDate
  };
};