// Import statements
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/animations.css';
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
  Button
} from '@mui/material';
import { useAuth } from '../../components/contexts/AuthContext';
import ForumSkeleton from '../../features/Forum/components/ForumSkeleton';
import ForumCard from '../../features/Forum/components/ForumCard';
import ForumSearch from '../../features/Forum/components/ForumSearch';
import ForumActions from '../../features/Forum/components/ForumActions';
import { useForum } from '../../components/hooks/useForum';
import './Forum.css';

const Forum = () => {
  // Theme & Navigation
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Refs
  const searchDebounceRef = useRef(null);
  const filterDebounceRef = useRef(null);

  // Custom hooks
  const {
    loading,
    posts,
    questions,
    events,
    findLostPet,
    tabValue,
    searchTerm,
    filterAnchorEl,
    sortBy,
    categoryFilter,
    categories,
    handleTabChange,
    handleSearchChange: originalHandleSearchChange,
    handleFilterClick,
    handleFilterClose,
    handleSortChange: originalHandleSortChange,
    handleCategoryChange: originalHandleCategoryChange,
    handleToggleLike,
    handleToggleFavorite,
    formatDate
  } = useForum();

  // Safe data handling
  const safeCategories = categories || [];
  const safePosts = posts || [];
  const safeQuestions = questions || [];
  const safeEvents = events || [];
  const safeFindPet = findLostPet || [];

  // Event handlers
  const handleSearchChange = (e) => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      originalHandleSearchChange(e);
    }, 500);
  };

  const handleSortChange = (value) => {
    if (filterDebounceRef.current) {
      clearTimeout(filterDebounceRef.current);
    }
    filterDebounceRef.current = setTimeout(() => {
      originalHandleSortChange(value);
    }, 300);
  };

  const handleCategoryChange = (categoryId) => {
    if (filterDebounceRef.current) {
      clearTimeout(filterDebounceRef.current);
    }
    filterDebounceRef.current = setTimeout(() => {
      originalHandleCategoryChange(categoryId);
    }, 300);
  };

  // Data loading functions
  const loadPosts = async () => {
    // Implement loadPosts logic
  };

  const loadQuestions = async () => {
    // Implement loadQuestions logic
  };

  const loadEvents = async () => {
    // Implement loadEvents logic
  };

  const loadFindLostPet = async () => {
    // Implement loadFindLostPet logic
  };

  // Effects
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      if (filterDebounceRef.current) {
        clearTimeout(filterDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (tabValue === 0) {
      loadPosts();
    } else if (tabValue === 1) {
      loadQuestions();
    } else if (tabValue === 2) {
      loadEvents();
    } else if (tabValue === 3) {
      loadFindLostPet();
    }
  }, [tabValue]);

  // JSX
  return (
    <Box className="forum-page">
      <Container maxWidth="lg">
        <Box className="forum-header animate-fadeIn" textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom className="forum-title">
            Diễn đàn thú cưng
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Chia sẻ kinh nghiệm, đặt câu hỏi và tham gia các sự kiện về thú cưng
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper elevation={1} className="forum-sidebar animate-slideInLeft">
              <Box p={2}>
                <Typography variant="h6" gutterBottom>
                  Danh mục
                </Typography>
                <Box className="forum-categories">
                  {safeCategories.map(category => (
                    <Button
                      key={category.id}
                      fullWidth
                      variant={categoryFilter === category.id ? 'containedFCB' : 'text'}
                      color={categoryFilter === category.id ? 'primary' : 'inherit'}
                      size="small"
                      onClick={() => handleCategoryChange(category.id)}
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
                    isAuthenticated={!!user}
                    onCreatePost={() => navigate('/forum/post/create')}
                    onCreateQuestion={() => navigate('/forum/question/create')}
                    onCreateEvent={() => navigate('/event/create')}
                    onFindLostPet={() => navigate('/lost-pets/create')}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Thống kê
                </Typography>
                <Box className="forum-stats">
                  <Typography variant="body2">
                    <strong>Bài viết:</strong> {safePosts.length}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Câu hỏi:</strong> {safeQuestions.length}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Sự kiện:</strong> {safeEvents.length}
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
                onSearchChange={handleSearchChange} // Sử dụng hàm debounced
                filterAnchorEl={filterAnchorEl}
                onFilterClick={handleFilterClick}
                onFilterClose={handleFilterClose}
                onSortChange={handleSortChange} // Sử dụng hàm debounced
                onCategoryChange={handleCategoryChange} // Sử dụng hàm debounced
                sortBy={sortBy}
                categoryFilter={categoryFilter}
                categories={safeCategories}
                displayStyle="horizontal"
              />

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="forum tabs">
                  <Tab label={`Bài viết (${safePosts.length})`} />
                  <Tab label={`Câu hỏi (${safeQuestions.length})`} />
                  <Tab label={`Sự kiện (${safeEvents.length})`} />
                  <Tab label={`Thú đi lạc (${safeFindPet.length})`} />
                </Tabs>
              </Box>

              {/* Tab content */}
              {loading ? (
                <ForumSkeleton />
              ) : (
                <>
                  {tabValue === 0 && (
                    <Box className="forum-posts">
                      {safePosts.length > 0 ? (
                        safePosts.map(post => (
                          <ForumCard
                            key={post._id}
                            item={post}
                            type="post"
                            categories={safeCategories}
                            onToggleLike={() => handleToggleLike(post._id, 'post')}
                            onToggleFavorite={() => handleToggleFavorite(post._id, 'post')}
                            formatDate={formatDate}
                            onClick={() => navigate(`/forum/post/${post._id}`)}
                          />
                        ))
                      ) : (
                        <Typography variant="body1" textAlign="center" py={4}>
                          Không có bài viết nào phù hợp với tìm kiếm của bạn.
                        </Typography>
                      )}
                    </Box>
                  )}

                  {tabValue === 1 && (
                    <Box className="forum-questions">
                      {safeQuestions.length > 0 ? (
                        safeQuestions.map(question => (
                          <ForumCard
                            key={question._id}
                            item={question}
                            type="question"
                            categories={safeCategories}
                            onToggleLike={() => handleToggleLike(question._id, 'question')}
                            onToggleFavorite={() => handleToggleFavorite(question._id, 'question')}
                            formatDate={formatDate}
                            onClick={() => navigate(`/forum/question/${question._id}`)}
                          />
                        ))
                      ) : (
                        <Typography variant="body1" textAlign="center" py={4}>
                          Không có câu hỏi nào phù hợp với tìm kiếm của bạn.
                        </Typography>
                      )}
                    </Box>
                  )}

                  {tabValue === 2 && (
                    <Box className="forum-events">
                      {safeEvents.length > 0 ? (
                        safeEvents.map(event => (
                          <ForumCard
                            key={event._id}
                            item={event}
                            type="event"
                            categories={safeCategories}
                            onToggleLike={() => handleToggleLike(event._id, 'event')}
                            onToggleFavorite={() => handleToggleFavorite(event._id, 'event')}
                            formatDate={formatDate}
                            onClick={() => navigate(`/forum/event/${event._id}`)}
                          />
                        ))
                      ) : (
                        <Typography variant="body1" textAlign="center" py={4}>
                          Không có sự kiện nào phù hợp với tìm kiếm của bạn.
                        </Typography>
                      )}
                    </Box>
                  )}
                  {tabValue === 3 && (
                    <Box className="forum-findpets">
                      {safeFindPet.length > 0 ? (
                        safeFindPet.map(findPet => (
                          <ForumCard
                            key={findPet._id}
                            item={findPet}
                            type="findLostPet"
                            categories={safeCategories}
                            onToggleLike={() => handleToggleLike(findPet._id, 'findLostPet')}
                            onToggleFavorite={() => handleToggleFavorite(findPet._id, 'findLostPet')}
                            formatDate={formatDate}
                            onClick={() => navigate(`/forum/findLostPet/${findPet._id}`)}
                          />
                        ))
                      ) : (
                        <Typography variant="body1" textAlign="center" py={4}>
                          Không có bài viết tìm thú cưng nào phù hợp với tìm kiếm của bạn.
                        </Typography>
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
