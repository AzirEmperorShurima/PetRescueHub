import React from 'react';
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
  Button
} from '@mui/material';
import { 
  Article as PostIcon, 
  QuestionAnswer as QuestionIcon, 
  Event as EventIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../../components/contexts/AuthContext';
import ForumSkeleton from '../../features/Forum/components/ForumSkeleton';
import ForumCard from '../../features/Forum/components/ForumCard';
import ForumSearch from '../../features/Forum/components/ForumSearch';
import ForumActions from '../../features/Forum/components/ForumActions';
import { useForum } from '../../components/hooks/useForum';
import './Forum.css';

const Forum = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Sử dụng custom hook
  const {
    loading,
    tabValue,
    posts,
    questions,
    events,
    filteredPosts,
    filteredQuestions,
    filteredEvents,
    forumCategories,
    searchTerm,
    filterAnchorEl,
    sortBy,
    categoryFilter,
    handleTabChange,
    handleSearchChange,
    handleFilterClick,
    handleFilterClose,
    handleSortChange,
    handleCategoryChange,
    handleToggleLike,
    handleToggleFavorite,
    formatDate
  } = useForum();

  const handleCreatePost = () => {
    navigate('/forum/post/create');
  };

  const handleCreateQuestion = () => {
    navigate('/forum/question/create');
  };

  const handleCreateEvent = () => {
    navigate('/forum/event/create');
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
                    onCreatePost={handleCreatePost}
                    onCreateQuestion={handleCreateQuestion}
                    onCreateEvent={handleCreateEvent}
                    displayStyle="vertical"
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
                displayStyle="horizontal"
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
                  {/* Tab 0: Posts */}
                  {tabValue === 0 && (
                    <Box className="forum-posts">
                      {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                          <ForumCard
                            key={post.id}
                            item={post}
                            type="post"
                            categories={forumCategories}
                            onToggleLike={() => handleToggleLike(post.id, 'post')}
                            onToggleFavorite={() => handleToggleFavorite(post.id, 'post')}
                            formatDate={formatDate}
                            onClick={() => navigate(`/forum/post/${post.id}`)}
                          />
                        ))
                      ) : (
                        <Typography variant="body1" textAlign="center" py={4}>
                          Không có bài viết nào phù hợp với tìm kiếm của bạn.
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {/* Tab 1: Questions */}
                  {tabValue === 1 && (
                    <Box className="forum-questions">
                      {filteredQuestions.length > 0 ? (
                        filteredQuestions.map((question) => (
                          <ForumCard
                            key={question.id}
                            item={question}
                            type="question"
                            onToggleLike={() => handleToggleLike(question.id, 'question')}
                            onToggleFavorite={() => handleToggleFavorite(question.id, 'question')}
                            formatDate={formatDate}
                            onClick={() => navigate(`/forum/question/${question.id}`)}
                          />
                        ))
                      ) : (
                        <Typography variant="body1" textAlign="center" py={4}>
                          Không có câu hỏi nào phù hợp với tìm kiếm của bạn.
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {/* Tab 2: Events */}
                  {tabValue === 2 && (
                    <Box className="forum-events">
                      {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                          <ForumCard
                            key={event.id}
                            item={event}
                            type="event"
                            onToggleLike={() => handleToggleLike(event.id, 'event')}
                            onToggleFavorite={() => handleToggleFavorite(event.id, 'event')}
                            formatDate={formatDate}
                            onClick={() => navigate(`/forum/event/${event.id}`)}
                          />
                        ))
                      ) : (
                        <Typography variant="body1" textAlign="center" py={4}>
                          Không có sự kiện nào phù hợp với tìm kiếm của bạn.
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