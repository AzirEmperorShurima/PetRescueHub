import { useState, useEffect } from 'react';
import { eventDetailMock, eventCommentsMock } from '../../mocks/eventDetailMock';

export const useEventDetail = (eventId) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        // In a real app, you would call an API
        // const response = await api.get(`/events/${eventId}`);
        // setEvent(response.data);
        
        // Using mock data
        setTimeout(() => {
          setEvent(eventDetailMock);
          setLikeCount(15);
          setComments(eventCommentsMock);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    // In a real app, you would call an API to update the like status
  };

  const handleCommentSubmit = (commentText) => {
    const newComment = {
      id: Date.now().toString(),
      author: 'Current User',
      authorAvatar: '/path/to/avatar.jpg',
      content: commentText,
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    setComments([newComment, ...comments]);
    // In a real app, you would call an API to add the comment
  };

  return {
    event,
    loading,
    liked,
    likeCount,
    comments,
    handleLike,
    handleCommentSubmit
  };
};