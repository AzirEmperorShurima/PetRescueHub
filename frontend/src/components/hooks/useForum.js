import { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/api.service';
import debounce from 'lodash.debounce';

export const useForum = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [posts, setPosts] = useState([]);

  // Debounce search để giảm spam API
  const debouncedFetch = useCallback(
    debounce((search, sort, category) => {
      fetchPosts(search, sort, category);
    }, 500),
    []
  );

  // Khi mount hoặc sort/category thay đổi → fetch ngay
  // useEffect(() => {
  //   fetchPosts(searchTerm, sortBy, categoryFilter);
  // }, [sortBy, categoryFilter]);

  // Khi searchTerm thay đổi → debounce rồi fetch
  useEffect(() => {
    debouncedFetch(searchTerm, sortBy, categoryFilter);
    return debouncedFetch.cancel;
  }, [searchTerm, sortBy, categoryFilter, debouncedFetch]);

  // Hàm chính gọi API lấy posts
  const fetchPosts = async (sort) => {
    setLoading(true);
    try {
      const params = { };
      const res = await apiService.forum.posts.getAll(params);
      console.log(res.data);
      setPosts(res.data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleSearchChange = useCallback(e => setSearchTerm(e.target.value), []);
  const handleSortChange   = useCallback(val => setSortBy(val), []);
  const handleCategoryChange = useCallback(cat => setCategoryFilter(prev => prev === cat ? '' : cat), []);

  return {
    loading,
    posts,
    searchTerm,
    sortBy,
    categoryFilter,
    handleSearchChange,
    handleSortChange,
    handleCategoryChange,
  };
};
