// Import statements
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/animations.css';
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  Card,
  CardBody,
} from '@chakra-ui/react'
import CreatePost from '../../features/Forum/CreatePost';
import CreateQuestion from '../../features/Forum/CreateQuestion';
import { useAuth } from '../../components/contexts/AuthContext';
import ForumSkeleton from '../../features/Forum/components/ForumSkeleton';
import ForumCard from '../../features/Forum/components/ForumCard';
import ForumSearch from '../../features/Forum/components/ForumSearch';
import ForumActions from '../../features/Forum/components/ForumActions';
import { useForum } from '../../components/hooks/useForum';
import './Forum.css';

const Forum = () => {
  // Navigation
  const navigate = useNavigate();
  const { user } = useAuth();

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
    setCurrentPostType(type);
    setShowCreatePost(true);
    setShowCreateQuestion(false);
  };

  const handleShowCreateQuestion = () => {
    setCurrentPostType('Question');
    setShowCreateQuestion(true);
    setShowCreatePost(false);
  };

  const handleCloseCreateForms = () => {
    setShowCreatePost(false);
    setShowCreateQuestion(false);
  };

  // JSX
  return (
    <Box className="forum-page" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.xl" py={6}>
        {showCreatePost && (
          <CreatePost postType={currentPostType} onClose={handleCloseCreateForms} />
        )}
        {showCreateQuestion && (
          <CreateQuestion onClose={handleCloseCreateForms} />
        )}
        
        {!showCreatePost && !showCreateQuestion && (
          <>
            <Box className="forum-header animate-fadeIn" textAlign="center" mb={8}>
              <Heading as="h1" size="2xl" mb={4} className="forum-title">
                Diễn đàn thú cưng
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Chia sẻ kinh nghiệm, đặt câu hỏi và tham gia các sự kiện về thú cưng
              </Text>
            </Box>

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
                            onCreatePost={() => handleShowCreatePost('ForumPost')}
                            onCreateQuestion={() => handleShowCreateQuestion('Question')}
                            onCreateEvent={() => handleShowCreatePost('EventPost')}
                            onFindLostPet={() => handleShowCreatePost('FindLostPetPost')}
                            PostType={listPostType}
                          />
                        </Box>
                      </Box>
                      
                      <Divider />

                      {/* Stats Section */}
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
                        </VStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
              
              {/* Main content */}
              <GridItem>
                <Box className="forum-main">
                  {/* Search and filter - commented out as in original */}
                  {/* <ForumSearch
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    filterAnchorEl={filterAnchorEl}
                    onFilterClick={handleFilterClick}
                    onFilterClose={handleFilterClose}
                    onSortChange={handleSortChange}
                    onCategoryChange={handleCategoryChange}
                    sortBy={sortBy}
                    categoryFilter={categoryFilter}
                    categories={safeCategories}
                    displayStyle="horizontal"
                  /> */}

                  {/* Tabs */}
                  <Tabs 
                    index={tabValue} 
                    onChange={handleTabChange} 
                    variant="line" 
                    colorScheme="blue"
                    mb={6}
                  >
                    <TabList borderBottom="1px" borderColor={borderColor}>
                      <Tab>Bài viết ({safePosts.length})</Tab>
                      <Tab>Câu hỏi ({safeQuestions.length})</Tab>
                      <Tab>Sự kiện ({safeEvents.length})</Tab>
                      <Tab>Thú đi lạc ({safeFindPet.length})</Tab>
                    </TabList>

                    <TabPanels>
                      {/* Posts Tab */}
                      <TabPanel p={0} pt={6}>
                        {loading ? (
                          <ForumSkeleton />
                        ) : (
                          <VStack spacing={4} className="forum-posts">
                            {safePosts.length > 0 ? (
                              safePosts.map(post => (
                                <ForumCard
                                  key={post._id}
                                  item={post}
                                  type={post.postType}
                                  categories={safeCategories}
                                  onToggleLike={() => handleToggleLike(post._id, 'post')}
                                  onToggleFavorite={() => handleToggleFavorite(post._id, 'post')}
                                  formatDate={formatDate}
                                  onClick={() => navigate(`/forum/post/${post._id}`)}
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
                                  type="question"
                                  categories={safeCategories}
                                  onToggleLike={() => handleToggleLike(question._id, 'question')}
                                  onToggleFavorite={() => handleToggleFavorite(question._id, 'question')}
                                  formatDate={formatDate}
                                  onClick={() => navigate(`/forum/question/${question._id}`)}
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
                                  type="event"
                                  categories={safeCategories}
                                  onToggleLike={() => handleToggleLike(event._id, 'event')}
                                  onToggleFavorite={() => handleToggleFavorite(event._id, 'event')}
                                  formatDate={formatDate}
                                  onClick={() => navigate(`/forum/event/${event._id}`)}
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
                                  type="findLostPet"
                                  categories={safeCategories}
                                  onToggleLike={() => handleToggleLike(findPet._id, 'findLostPet')}
                                  onToggleFavorite={() => handleToggleFavorite(findPet._id, 'findLostPet')}
                                  formatDate={formatDate}
                                  onClick={() => navigate(`/forum/findLostPet/${findPet._id}`)}
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
      </Container>
    </Box>
  );
};

export default Forum;