import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  forumPosts,
  forumQuestions,
  forumEvents,
  forumCategories
} from '../../mocks/forum'; // Đảm bảo đường dẫn import chính xác

export const useForum = () => {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [posts, setPosts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [events, setEvents] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  // 1. Fetch data once
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // mock API calls
        setPosts(forumPosts);
        setQuestions(forumQuestions);
        setEvents(forumEvents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Handlers (memoized)
  const handleTabChange = useCallback((_, newVal) => setTabValue(newVal), []);
  const handleSearchChange = useCallback(e => setSearchTerm(e.target.value), []);

  const handleFilterClick = useCallback(e => setFilterAnchorEl(e.currentTarget), []);
  const handleFilterClose = useCallback(() => setFilterAnchorEl(null), []);

  const handleSortChange = useCallback((option) => {
    setSortBy(option);
    setFilterAnchorEl(null);
  }, []);

  const handleCategoryChange = useCallback((cat) => {
    setCategoryFilter(cat);
    setFilterAnchorEl(null);
  }, []);

  const handleToggleLike = useCallback((id, type) => {
    const toggle = (arr, setter) =>
      setter(arr.map(item =>
        item.id === id
          ? { 
              ...item,
              isLiked: !item.isLiked,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1
            }
          : item
      ));
    if (type === 'post') toggle(posts, setPosts);
    if (type === 'question') toggle(questions, setQuestions);
    if (type === 'event') toggle(events, setEvents);
  }, [posts, questions, events]);

  const handleToggleFavorite = useCallback((id, type) => {
    const toggle = (arr, setter) =>
      setter(arr.map(item =>
        item.id === id
          ? { ...item, isFavorited: !item.isFavorited }
          : item
      ));
    if (type === 'post') toggle(posts, setPosts);
    if (type === 'question') toggle(questions, setQuestions);
    if (type === 'event') toggle(events, setEvents);
  }, [posts, questions, events]);

  // 3. Filter & sort chung (memoized)
  const filterAndSort = useCallback((items, dateKey = 'createdAt') => {
    let result = [...items];

    // search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(i =>
        i.title.toLowerCase().includes(term) ||
        (i.content || i.description).toLowerCase().includes(term)
      );
    }

    // category
    if (categoryFilter !== 'all') {
      result = result.filter(i => i.category === categoryFilter);
    }

    // sort
    result.sort((a, b) => {
      if (sortBy === 'newest')   return new Date(b[dateKey]) - new Date(a[dateKey]);
      if (sortBy === 'oldest')   return new Date(a[dateKey]) - new Date(b[dateKey]);
      if (sortBy === 'mostLiked') return (b.likes || 0) - (a.likes || 0);
      if (sortBy === 'mostCommented') return (b.comments || 0) - (a.comments || 0);
      if (sortBy === 'mostViewed') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'popular') {
        const popA = (a.likes||0) + (a.comments||0) + (a.attendees||0);
        const popB = (b.likes||0) + (b.comments||0) + (b.attendees||0);
        return popB - popA;
      }
      return 0;
    });

    // attach categoryObj
    return result.map(item => ({
      ...item,
      categoryObj:
        forumCategories.find(c => c.id === item.category) || { name: 'Unknown' }
    }));
  }, [searchTerm, categoryFilter, sortBy]);

  // 4. Memo kết quả
  const filteredPosts = useMemo(() => filterAndSort(posts), [filterAndSort, posts]);
  const filteredQuestions = useMemo(() => filterAndSort(questions), [filterAndSort, questions]);
  const filteredEvents = useMemo(() => filterAndSort(events, 'date'), [filterAndSort, events]);

  // 5. Format date
  const formatDate = useCallback(d =>
    new Date(d).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  , []);

  return {
    loading,
    tabValue,
    searchTerm,
    filterAnchorEl,
    sortBy,
    categoryFilter,
    categories: forumCategories, // Chỉ export một biến để tránh nhầm lẫn
    // Xóa dòng forumCategories để tránh trùng lặp
    
    // outputs
    posts: filteredPosts,
    questions: filteredQuestions,
    events: filteredEvents,

    // actions
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
