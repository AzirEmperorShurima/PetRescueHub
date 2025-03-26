import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Tabs, 
  Tab, 
  Divider, 
  Paper,
  useTheme,
  alpha,
  Button // Add Button import
} from '@mui/material';
import { 
  Article as PostIcon, 
  QuestionAnswer as QuestionIcon, 
  Event as EventIcon,
  Add as AddIcon // Add AddIcon import
} from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import ForumSkeleton from './components/ForumSkeleton';
import ForumCard from './components/ForumCard';
import ForumSearch from './components/ForumSearch';
import ForumActions from './components/ForumActions';
import { forumPosts, forumQuestions, forumEvents, forumCategories } from '../../mocks';
import './Forum.css';

const Forum = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    handleFilterClose();
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    handleFilterClose();
  };

  const handleCreatePost = () => {
    navigate('/forum/post/create');
  };

  const handleCreateQuestion = () => {
    navigate('/forum/question/create');
  };

  const handleCreateEvent = () => {
    navigate('/forum/event/create');
  };

  const handleToggleLike = (id, type) => {
    // Trong thực tế, bạn sẽ gọi API để like/unlike
    if (type === 'post') {
      setPosts(posts.map(post => 
        post.id === id ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post
      ));
    } else if (type === 'question') {
      setQuestions(questions.map(question => 
        question.id === id ? { ...question, isLiked: !question.isLiked, likes: question.isLiked ? question.likes - 1 : question.likes + 1 } : question
      ));
    } else if (type === 'event') {
      setEvents(events.map(event => 
        event.id === id ? { ...event, isLiked: !event.isLiked, likes: event.isLiked ? event.likes - 1 : event.likes + 1 } : event
      ));
    }
  };

  const handleToggleFavorite = (id, type) => {
    // Trong thực tế, bạn sẽ gọi API để favorite/unfavorite
    if (type === 'post') {
      setPosts(posts.map(post => 
        post.id === id ? { ...post, isFavorited: !post.isFavorited } : post
      ));
    } else if (type === 'question') {
      setQuestions(questions.map(question => 
        question.id === id ? { ...question, isFavorited: !question.isFavorited } : question
      ));
    } else if (type === 'event') {
      setEvents(events.map(event => 
        event.id === id ? { ...event, isFavorited: !event.isFavorited } : event
      ));
    }
  };

  // Lọc và sắp xếp dữ liệu
  const filterAndSortData = (data) => {
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
    
    return filteredData;
  };

  const filteredPosts = filterAndSortData(posts);
  const filteredQuestions = filterAndSortData(questions);
  const filteredEvents = filterAndSortData(events);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <Box className="forum-page">
      <Container maxWidth="lg">
        <Box className="forum-header" textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            Diễn đàn thú cưng
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Chia sẻ kinh nghiệm, đặt câu hỏi và tham gia các sự kiện về thú cưng
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper elevation={1} className="forum-sidebar">
              <Box p={2}>
                <Typography variant="h6" gutterBottom>
                  Danh mục
                </Typography>
                <Box className="forum-categories">
                  {forumCategories.map((category) => (
                    <Button
                      key={category.id}
                      fullWidth
                      variant={categoryFilter === category.id ? 'contained' : 'text'}
                      color={categoryFilter === category.id ? 'primary' : 'inherit'}
                      size="small"
                      onClick={() => setCategoryFilter(category.id)}
                      sx={{ justifyContent: 'flex-start', textAlign: 'left', mb: 1 }}
                    >
                      {category.name}
                    </Button>
                  ))}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Tạo mới
                </Typography>
                <Box className="forum-create-buttons">
                  <ForumActions 
                    onCreatePost={handleCreatePost}
                    onCreateQuestion={handleCreateQuestion}
                    onCreateEvent={handleCreateEvent}
                    displayStyle="vertical" // Thêm prop để hiển thị theo chiều dọc
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Thống kê
                </Typography>
                <Box className="forum-stats">
                  <Typography variant="body2">
                    <strong>Bài viết:</strong> {posts.length}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Câu hỏi:</strong> {questions.length}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Sự kiện:</strong> {events.length}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Thành viên tích cực:</strong> 125
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          {/* Main content */}
          <Grid item xs={12} md={9}>
            <Box className="forum-main">
              {/* Search and filter */}
              <ForumSearch 
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filterAnchorEl={filterAnchorEl}
                onFilterClick={handleFilterClick}
                onFilterClose={handleFilterClose}
                onSortChange={handleSortChange}
                onCategoryChange={handleCategoryChange}
                sortBy={sortBy}
                categoryFilter={categoryFilter}
                categories={forumCategories}
                displayStyle="horizontal" // Thêm prop để hiển thị theo chiều ngang
              />
              
              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="forum tabs">
                  <Tab label={`Bài viết (${filteredPosts.length})`} />
                  <Tab label={`Câu hỏi (${filteredQuestions.length})`} />
                  <Tab label={`Sự kiện (${filteredEvents.length})`} />
                </Tabs>
              </Box>
              
              {/* Tab content */}
              {loading ? (
                <ForumSkeleton />
              ) : (
                <>
                  {/* Posts tab */}
                  {tabValue === 0 && (
                    <Box className="forum-posts-list">
                      {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                          <ForumCard 
                            key={post.id}
                            item={post} 
                            type="post" 
                            categories={forumCategories}
                            onToggleLike={handleToggleLike}
                            onToggleFavorite={handleToggleFavorite}
                            formatDate={formatDate}
                          />
                        ))
                      ) : (
                        <Box textAlign="center" py={4}>
                          <Typography variant="h6">Không có bài viết nào</Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleCreatePost}
                            sx={{ mt: 2 }}
                          >
                            Tạo bài viết mới
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}
                  
                  {/* Questions tab */}
                  {tabValue === 1 && (
                    <Box className="forum-questions-list">
                      {filteredQuestions.length > 0 ? (
                        filteredQuestions.map(question => (
                          <ForumCard 
                            key={question.id}
                            item={question} 
                            type="question" 
                            categories={forumCategories}
                            onToggleLike={handleToggleLike}
                            onToggleFavorite={handleToggleFavorite}
                            formatDate={formatDate}
                          />
                        ))
                      ) : (
                        <Box textAlign="center" py={4}>
                          <Typography variant="h6">Không có câu hỏi nào</Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleCreateQuestion}
                            sx={{ mt: 2 }}
                          >
                            Đặt câu hỏi mới
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}
                  
                  {/* Events tab */}
                  {tabValue === 2 && (
                    <Box className="forum-events-list">
                      {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                          <ForumCard 
                            key={event.id}
                            item={event} 
                            type="event" 
                            categories={forumCategories}
                            onToggleLike={handleToggleLike}
                            onToggleFavorite={handleToggleFavorite}
                            formatDate={formatDate}
                          />
                        ))
                      ) : (
                        <Box textAlign="center" py={4}>
                          <Typography variant="h6">Không có sự kiện nào</Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleCreateEvent}
                            sx={{ mt: 2 }}
                          >
                            Tạo sự kiện mới
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Forum;
