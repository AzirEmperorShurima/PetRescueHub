import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import apiService from '../../services/api.service';
import { useAuth } from '../contexts/AuthContext';

export const useEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const toast = useToast();
  const { user } = useAuth();

  // Fetch events (using forum post API with postType filter)
  const fetchEvents = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await apiService.forum.posts.getAll({
        ...params,
        postType: 'EventPost',
        limit: 100
      });

      const eventsList = response.data?.data || [];
      
      // Set featured event (assuming the first approved event with highest engagement)
      const featured = eventsList.find(event => 
        event.status === 'approved' && event.featured
      ) || eventsList[0];
      
      setFeaturedEvent(featured);
      setEvents(eventsList);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách sự kiện',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Toggle reaction (like)
  const handleToggleReaction = async (postId, userReaction, reactions) => {
    if (!user) {
      toast({
        title: 'Cần đăng nhập',
        description: 'Vui lòng đăng nhập để thực hiện chức năng này',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Update events state optimistically
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === postId
            ? { ...event, userReaction, reactions }
            : event
        )
      );

      // Update featured event if needed
      if (featuredEvent?._id === postId) {
        setFeaturedEvent(prev => ({
          ...prev,
          userReaction,
          reactions
        }));
      }
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật reaction',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (postId) => {
    if (!user) {
      toast({
        title: 'Cần đăng nhập',
        description: 'Vui lòng đăng nhập để thực hiện chức năng này',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Update events state optimistically
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === postId
            ? { ...event, isFavorited: !event.isFavorited }
            : event
        )
      );

      // Update featured event if needed
      if (featuredEvent?._id === postId) {
        setFeaturedEvent(prev => ({
          ...prev,
          isFavorited: !prev.isFavorited
        }));
      }

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật trạng thái yêu thích',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái yêu thích',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Format date helper
  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Không xác định';
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    featuredEvent,
    handleToggleReaction,
    handleToggleFavorite,
    formatDate,
    fetchEvents
  };
}; 