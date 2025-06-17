// Import statements
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/animations.css';
import {Box,Container,Heading,Text,Grid,GridItem,Tabs,TabList,TabPanels,Tab,TabPanel,Divider,VStack,HStack,Button,useColorModeValue,Card,CardBody,
} from '@chakra-ui/react'
import CreatePost from '../../features/Forum/CreatePost';
import { useAuth } from '../../components/contexts/AuthContext';
import ForumSkeleton from '../../features/Forum/components/ForumSkeleton';
import ForumCard from '../../features/Forum/components/ForumCard';
import ForumSearch from '../../features/Forum/components/ForumSearch';
import ForumActions from '../../features/Forum/components/ForumActions';
import { useForum } from '../../components/hooks/useForum';
import ScrollToTopButton from '../../components/button/ScrollToTopButton';
import './Forum.css';

const Forum = () => {
  // Navigation
  const navigate = useNavigate();
  const { user } = useAuth();

  const requireLogin = (action) => {
    if (!user) {
      // Nếu là hành động xem (view), cho phép tiếp tục mà không cần đăng nhập
      if (action === 'view') {
        return true;
      }
      
      // Lưu đường dẫn hiện tại để sau khi đăng nhập có thể quay lại
      const currentPath = window.location.pathname;
      // navigate('/auth/login', { state: { returnUrl: currentPath } });
      return false;
    }
    return true;
  };

  // Chakra UI color mode
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Add missing state variables
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [currentPostType, setCurrentPostType] = useState('ForumPost');

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
    handleToggleReaction: originalHandleToggleReaction,
    handleToggleFavorite,
    formatDate,
    setPosts,
    setQuestions,
    setEvents,
    setFindLostPet
  } = useForum();

  // Safe data handling
  const safeCategories = categories || [];
  const safePosts = posts || [];
  const safeQuestions = questions || [];
  const safeEvents = events || [];
  const safeFindPet = findLostPet || [];

  const allPosts = [...safePosts, ...safeQuestions, ...safeEvents, ...safeFindPet];

  // Improved handleToggleReaction with proper state updates
  // Cập nhật handleToggleReaction để kiểm tra đăng nhập trước khi thực hiện hành động
  const handleToggleReaction = async (postId, userReaction, reactions) => {
    // Kiểm tra đăng nhập trước khi thực hiện hành động
    if (!requireLogin('reaction')) return;

    try {
      // Gọi API để toggle reaction (nếu có trong originalHandleToggleReaction)
      if (originalHandleToggleReaction) {
        await originalHandleToggleReaction(postId, userReaction, reactions);
      }

      // Cập nhật state cho tất cả các loại post
      const updatePostInArray = (prevArray) => 
        prevArray.map(post =>
          post._id === postId || post.id === postId
            ? { ...post, userReaction, reactions }
            : post
        );

      // Cập nhật Posts
      if (setPosts) {
        setPosts(prevPosts => updatePostInArray(prevPosts));
      }

      // Cập nhật Questions
      if (setQuestions) {
        setQuestions(prevQuestions => updatePostInArray(prevQuestions));
      }

      // Cập nhật Events
      if (setEvents) {
        setEvents(prevEvents => updatePostInArray(prevEvents));
      }

      // Cập nhật FindLostPet
      if (setFindLostPet) {
        setFindLostPet(prevFindPet => updatePostInArray(prevFindPet));
      }

    } catch (error) {
      console.error('Error toggling reaction:', error);
      // Có thể thêm toast notification để thông báo lỗi
    }
  };

  // Improved handleToggleFavorite with proper state updates
  const handleToggleFavoriteImproved = async (postId, isFavorited) => {
    // Kiểm tra đăng nhập trước khi thực hiện hành động
    if (!requireLogin('favorite')) return;

    try {
      // Gọi API để toggle favorite
      if (handleToggleFavorite) {
        await handleToggleFavorite(postId);
      }

      // Cập nhật state cho tất cả các loại post
      const updateFavoriteInArray = (prevArray) => 
        prevArray.map(post =>
          post._id === postId || post.id === postId
            ? { ...post, isFavorited: !post.isFavorited }
            : post
        );

      // Cập nhật tất cả các state arrays
      if (setPosts) setPosts(prevPosts => updateFavoriteInArray(prevPosts));
      if (setQuestions) setQuestions(prevQuestions => updateFavoriteInArray(prevQuestions));
      if (setEvents) setEvents(prevEvents => updateFavoriteInArray(prevEvents));
      if (setFindLostPet) setFindLostPet(prevFindPet => updateFavoriteInArray(prevFindPet));

    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

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

  const getPostType = () => {
    // Implementation needed
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

  const listPostType = {
    Questions: "Question",
    Events: "EventPost",
    FindLostPet: "FindLostPetPost",
    ForumPost: "ForumPost"
  }

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

  // Add missing handlers
  const handleShowCreatePost = (type) => {
    if (!requireLogin('create_post')) return;
    
    setCurrentPostType(type);
    setShowCreatePost(true);
    setShowCreateQuestion(false);
  };

  const handleShowCreateQuestion = () => {
    if (!requireLogin('create_question')) return;
    
    setCurrentPostType('Question');
    setShowCreateQuestion(true);
    setShowCreatePost(false);
  };

  const handleCloseCreateForms = () => {
    setShowCreatePost(false);
    setShowCreateQuestion(false);
  };

  // Add handlers for edit, delete, and report
  const handleEdit = (postId) => {
    if (!requireLogin('edit')) return;
    navigate(`/forum/edit/${postId}`);
  };

  const handleDelete = async (postId) => {
    if (!requireLogin('delete')) return;
    
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        const response = await apiService.forum.posts.delete(postId);
        if (response && response.status === 200) {
          // Cập nhật state để xóa bài viết
          setPosts(prev => prev.filter(p => p._id !== postId));
          setQuestions(prev => prev.filter(p => p._id !== postId));
          setEvents(prev => prev.filter(p => p._id !== postId));
          setFindLostPet(prev => prev.filter(p => p._id !== postId));
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleReport = async (postId) => {
    if (!requireLogin('report')) return;
    
    try {
      await apiService.forum.posts.report(postId);
      alert('Đã báo cáo bài viết thành công');
    } catch (error) {
      console.error('Error reporting post:', error);
    }
  };

  // Thêm hàm kiểm tra quyền admin
  const isAdmin = user && Array.isArray(user.roles)
    ? user.roles.some(r => (typeof r === 'string' ? (r === 'admin' || r === 'super_admin') : (r.name === 'admin' || r.name === 'super_admin')))
    : false;

  // JSX
  return (
    <Box className="forum-page" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.xl" py={6}>
        {showCreatePost && (
          <CreatePost postType={currentPostType} onClose={handleCloseCreateForms} />
        )}
        {!showCreatePost && (
          <>
            <Box className="forum-header animate-fadeIn" textAlign="center" mb={8}>
              <Heading as="h1" size="2xl" mb={4} className="forum-title">
                Diễn đàn thú cưng
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Chia sẻ kinh nghiệm, đặt câu hỏi và tham gia các sự kiện về thú cưng
              </Text>
            </Box>
            <ForumSearch
              categoryFilter={categoryFilter}
            />
            <Grid templateColumns={{ base: "1fr", md: "300px 1fr" }} gap={6}>
              {/* Sidebar */}
              <GridItem>
                <Card className="forum-sidebar animate-slideInLeft" bg={bg} shadow="sm">
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      {/* Categories Section */}
                      <Box>
                        <Heading size="md" mb={4}>
                          Danh mục
                        </Heading>
                        <VStack spacing={2} align="stretch" className="forum-categories">
                          {safeCategories.map(category => (
                            <Button
                              key={category.id}
                              variant={categoryFilter === category.id ? 'solid' : 'ghost'}
                              colorScheme={categoryFilter === category.id ? 'blue' : 'gray'}
                              size="sm"
                              justifyContent="flex-start"
                              onClick={() => handleCategoryChange(category.id)}
                            >
                              {category.name}
                            </Button>
                          ))}
                        </VStack>
                      </Box>

                      <Divider />

                      {/* Create Actions Section */}
                      <Box>
                        <Heading size="md" mb={4}>
                          Tạo mới
                        </Heading>
                        <Box className="forum-create-buttons">
                          <ForumActions
                            isAuthenticated={user}
                            onCreatePost={handleShowCreatePost}
                            PostType={listPostType}
                          />
                        </Box>
                      </Box>

                      <Divider />

                      {/* Stats Section */}
                      {isAdmin && (
                        <Box>
                          <Heading size="md" mb={4}>
                            Thống kê
                          </Heading>
                          <VStack spacing={2} align="stretch" className="forum-stats">
                            <HStack justify="space-between">
                              <Text fontWeight="semibold">Bài viết:</Text>
                              <Text>{safePosts.length}</Text>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontWeight="semibold">Câu hỏi:</Text>
                              <Text>{safeQuestions.length}</Text>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontWeight="semibold">Sự kiện:</Text>
                              <Text>{safeEvents.length}</Text>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontWeight="semibold">Tìm thú đi lạc:</Text>
                              <Text>{safeFindPet.length}</Text>
                            </HStack>
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>

              {/* Main content */}
              <GridItem>
                <Box className="forum-main">
                  {/* Tabs */}
                  <Tabs
                    index={tabValue}
                    onChange={handleTabChange}
                    variant="line"
                    colorScheme="blue"
                    mb={6}
                  >
                    <TabList borderBottom="1px" borderColor={borderColor}>
                      <Tab>Bài viết</Tab>
                      <Tab>Câu hỏi</Tab>
                      <Tab>Sự kiện</Tab>
                      <Tab>Thú đi lạc</Tab>
                    </TabList>

                    <TabPanels>
                      {/* Posts Tab */}
                      <TabPanel p={0} pt={6}>
                        {loading ? (
                          <ForumSkeleton />
                        ) : (
                          <VStack spacing={1} className="forum-posts">
                            {allPosts.length > 0 ? (
                              allPosts.map(post => (
                                <ForumCard
                                  key={post._id}
                                  item={post}
                                  type={post.postType}
                                  categories={safeCategories}
                                  onToggleLike={(userReaction, reactions) => 
                                    handleToggleReaction(post._id, userReaction, reactions)
                                  }
                                  onToggleFavorite={() => handleToggleFavoriteImproved(post._id)}
                                  formatDate={formatDate}
                                  onClick={() => navigate(`/forum/post/${post._id}`)}
                                  currentUser={user}
                                  isOwner={user && (user.id === post.authorId || user._id === post.authorId)}
                                  onEdit={() => handleEdit(post._id)}
                                  onDelete={() => handleDelete(post._id)}
                                  onReport={() => handleReport(post._id)}
                                />
                              ))
                            ) : (
                              <Text textAlign="center" py={8} color={textColor}>
                                Không có bài viết nào phù hợp với tìm kiếm của bạn.
                              </Text>
                            )}
                          </VStack>
                        )}
                      </TabPanel>

                      {/* Questions Tab */}
                      <TabPanel p={0} pt={6}>
                        {loading ? (
                          <ForumSkeleton />
                        ) : (
                          <VStack spacing={4} className="forum-questions">
                            {safeQuestions.length > 0 ? (
                              safeQuestions.map(question => (
                                <ForumCard
                                  key={question._id}
                                  item={question}
                                  type={question.postType}
                                  categories={safeCategories}
                                  onToggleLike={(userReaction, reactions) => 
                                    handleToggleReaction(question._id, userReaction, reactions)
                                  }
                                  onToggleFavorite={() => handleToggleFavoriteImproved(question._id)}
                                  formatDate={formatDate}
                                  onClick={() => navigate(`/forum/question/${question._id}`)}
                                  currentUser={user}
                                  isOwner={user && (user.id === question.authorId || user._id === question.authorId)}
                                  onEdit={() => handleEdit(question._id)}
                                  onDelete={() => handleDelete(question._id)}
                                  onReport={() => handleReport(question._id)}
                                />
                              ))
                            ) : (
                              <Text textAlign="center" py={8} color={textColor}>
                                Không có câu hỏi nào phù hợp với tìm kiếm của bạn.
                              </Text>
                            )}
                          </VStack>
                        )}
                      </TabPanel>

                      {/* Events Tab */}
                      <TabPanel p={0} pt={6}>
                        {loading ? (
                          <ForumSkeleton />
                        ) : (
                          <VStack spacing={4} className="forum-events">
                            {safeEvents.length > 0 ? (
                              safeEvents.map(event => (
                                <ForumCard
                                  key={event._id}
                                  item={event}
                                  type={event.postType}
                                  categories={safeCategories}
                                  onToggleLike={(userReaction, reactions) => 
                                    handleToggleReaction(event._id, userReaction, reactions)
                                  }
                                  onToggleFavorite={() => handleToggleFavoriteImproved(event._id)}
                                  formatDate={formatDate}
                                  onClick={() => navigate(`/forum/event/${event._id}`)}
                                  currentUser={user}
                                  isOwner={user && (user.id === event.authorId || user._id === event.authorId)}
                                  onEdit={() => handleEdit(event._id)}
                                  onDelete={() => handleDelete(event._id)}
                                  onReport={() => handleReport(event._id)}
                                />
                              ))
                            ) : (
                              <Text textAlign="center" py={8} color={textColor}>
                                Không có sự kiện nào phù hợp với tìm kiếm của bạn.
                              </Text>
                            )}
                          </VStack>
                        )}
                      </TabPanel>

                      {/* Find Lost Pet Tab */}
                      <TabPanel p={0} pt={6}>
                        {loading ? (
                          <ForumSkeleton />
                        ) : (
                          <VStack spacing={4} className="forum-findpets">
                            {safeFindPet.length > 0 ? (
                              safeFindPet.map(findPet => (
                                <ForumCard
                                  key={findPet._id}
                                  item={findPet}
                                  type={findPet.postType}
                                  categories={safeCategories}
                                  onToggleLike={(userReaction, reactions) => 
                                    handleToggleReaction(findPet._id, userReaction, reactions)
                                  }
                                  onToggleFavorite={() => handleToggleFavoriteImproved(findPet._id)}
                                  formatDate={formatDate}
                                  onClick={() => navigate(`/forum/findLostPet/${findPet._id}`)}
                                  currentUser={user}
                                  isOwner={user && (user.id === findPet.authorId || user._id === findPet.authorId)}
                                  onEdit={() => handleEdit(findPet._id)}
                                  onDelete={() => handleDelete(findPet._id)}
                                  onReport={() => handleReport(findPet._id)}
                                />
                              ))
                            ) : (
                              <Text textAlign="center" py={8} color={textColor}>
                                Không có bài viết tìm thú cưng nào phù hợp với tìm kiếm của bạn.
                              </Text>
                            )}
                          </VStack>
                        )}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>
              </GridItem>
            </Grid>
          </>
        )}
        <ScrollToTopButton />
      </Container>
    </Box>
  );
};

export default Forum;

// Sửa useForum hook để xử lý lỗi khi không có người dùng đăng nhập
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

    // ... rest of the existing code ...
  } catch (err) {
    console.error('Error fetching posts:', err);
    // Không hiển thị thông báo lỗi cho người dùng khi không đăng nhập
    // Chỉ log lỗi và tiếp tục với mảng rỗng
    setPosts([]);
    setQuestions([]);
    setEvents([]);
    setFindLostPet([]);
  } finally {
    setLoading(false);
  }
};