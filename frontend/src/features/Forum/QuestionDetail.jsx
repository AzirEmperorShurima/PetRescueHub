import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardBody,
  Heading,
  Text,
  IconButton,
  Button,
  Avatar,
  HStack,
  VStack,
  Divider,
  Box,
  Flex,
  Badge,
  useColorModeValue,
  ChakraProvider,
  extendTheme,
  Spinner
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useAuth } from '../../components/contexts/AuthContext';
import { questionDetailMock, answersMock } from '../../mocks/questionDetailMock';
import { motion } from 'framer-motion';

// Custom Components (adapted for Chakra UI)
import ActionMenu from '../../components/common/interactions/ActionMenu';
import LikeButton from '../../components/common/interactions/LikeButton';
import CommentForm from '../../components/common/interactions/CommentForm';
import ShareButton from './components/common/ShareButton';
import TagList from './components/common/TagList';

const colors = {
  primary: '#D34F81', // From RescueSuccess context
  secondary: '#757575', // MUI text.secondary
  success: '#4caf50', // MUI success
  background: '#f5f5f5', // MUI Paper background
  border: '#e0e0e0' // MUI Paper border
};

const theme = extendTheme({
  colors,
  components: {
    Card: {
      baseStyle: {
        bg: 'white',
        borderRadius: 'lg',
        border: '1px solid',
        borderColor: 'border'
      }
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        color: 'gray.800'
      }
    },
    Text: {
      baseStyle: {
        color: 'gray.800'
      }
    },
    Button: {
      baseStyle: {
        _hover: { transform: 'scale(1.05)', transition: 'all 0.2s' }
      }
    }
  }
});

const MotionBox = motion(Box);

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [answers, setAnswers] = useState([]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const answerBg = useColorModeValue('#f5f5f5', 'gray.700');
  const acceptedBg = useColorModeValue('#e8f5e9', 'green.900');

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          setQuestion(questionDetailMock);
          setLikeCount(8);
          setAnswers(answersMock);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching question details:', error);
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleAnswerSubmit = (answerText) => {
    const newAnswer = {
      id: Date.now(),
      author: user?.name || 'Người dùng ẩn danh',
      avatar: user?.avatar || 'https://i.pravatar.cc/150?img=8',
      content: answerText,
      createdAt: new Date().toISOString(),
      userId: user?.id || 'anonymous',
      isAccepted: false
    };
    setAnswers([...answers, newAnswer]);
  };

  const handleDeleteAnswer = (answerId) => {
    setAnswers(answers.filter(answer => answer.id !== answerId));
  };

  const handleEditAnswer = (answer) => {
    console.log('Edit answer:', answer);
  };

  const handleAcceptAnswer = (answerId) => {
    setAnswers(answers.map(answer => ({
      ...answer,
      isAccepted: answer.id === answerId
    })));
    setQuestion({
      ...question,
      solved: true
    });
  };

  const handleEditQuestion = () => {
    console.log('Edit question:', question);
  };

  const handleDeleteQuestion = () => {
    console.log('Delete question:', question);
    navigate('/forum');
  };

  const handleReportQuestion = () => {
    console.log('Report question:', question);
  };

  if (loading) {
    return (
      <Container maxW="container.md" py={6}>
        <Flex justify="center" my={6}>
          <Spinner size="lg" color="primary" />
        </Flex>
      </Container>
    );
  }

  if (!question) {
    return (
      <Container maxW="container.md" py={6}>
        <VStack spacing={4} textAlign="center" my={6}>
          <Text fontSize="xl" fontWeight="bold">
            Không tìm thấy câu hỏi
          </Text>
          <Button
            bg="primary"
            color="white"
            onClick={() => navigate('/forum')}
            _hover={{ bg: '#b71c50' }}
            size="lg"
          >
            Quay lại diễn đàn
          </Button>
        </VStack>
      </Container>
    );
  }

  const isOwner = user?.id === question.authorId;

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.md" py={6}>
        <Card
          bg={bgColor}
          shadow="md"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            bgGradient: 'linear(to-r, primary, pink.300)',
            borderTopRadius: 'lg'
          }}
        >
          <CardBody p={{ base: 4, md: 6 }}>
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <Flex justify="space-between" align="center">
                <HStack>
                  <IconButton
                    icon={<FaArrowLeft />}
                    onClick={() => navigate('/forum')}
                    variant="ghost"
                    aria-label="Quay lại diễn đàn"
                  />
                  <Heading size="lg">{question.title}</Heading>
                </HStack>
                <HStack>
                  {question.solved && (
                    <Badge colorScheme="green" display="flex" alignItems="center">
                      <FaCheckCircle style={{ marginRight: '4px' }} />
                      Đã giải quyết
                    </Badge>
                  )}
                  <ActionMenu
                    onEdit={isOwner ? handleEditQuestion : null}
                    onDelete={isOwner ? handleDeleteQuestion : null}
                    onReport={!isOwner ? handleReportQuestion : null}
                    isOwner={isOwner}
                  />
                </HStack>
              </Flex>

              <Divider borderColor={borderColor} />

              {/* Author Info */}
              <HStack spacing={3}>
                <Avatar src={question.authorAvatar} name={question.author} size="md" />
                <VStack align="start" spacing={0}>
                  <Text fontSize="md" fontWeight="medium">
                    {question.author}
                  </Text>
                  <Text fontSize="sm" color="secondary">
                    {dayjs(question.date).locale('vi').format('DD/MM/YYYY HH:mm')}
                  </Text>
                </VStack>
              </HStack>

              {/* Content */}
              <Text fontSize="md" whiteSpace="pre-line">
                {question.content}
              </Text>

              {/* Tags */}
              <TagList tags={question.tags} />

              {/* Actions */}
              <HStack spacing={4}>
                <LikeButton liked={liked} likeCount={likeCount} onLike={handleLike} />
                <ShareButton url={window.location.href} title={question.title} />
              </HStack>

              <Divider borderColor={borderColor} />

              {/* Answers */}
              <VStack align="stretch" spacing={4}>
                <Heading size="md">{answers.length} Câu trả lời</Heading>
                {answers.map((answer) => (
                  <MotionBox
                    key={answer.id}
                    bg={answer.isAccepted ? acceptedBg : answerBg}
                    p={4}
                    borderRadius="md"
                    border="1px"
                    borderColor={borderColor}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Flex justify="space-between" align="flex-start">
                      <HStack spacing={3} mb={2}>
                        <Avatar src={answer.avatar} name={answer.author} size="sm" />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="medium">
                            {answer.author}
                          </Text>
                          <Text fontSize="xs" color="secondary">
                            {dayjs(answer.createdAt).locale('vi').format('DD/MM/YYYY HH:mm')}
                          </Text>
                        </VStack>
                      </HStack>
                      <HStack>
                        {answer.isAccepted && (
                          <Badge colorScheme="green" display="flex" alignItems="center" fontSize="xs">
                            <FaCheckCircle style={{ marginRight: '4px' }} />
                            Câu trả lời được chấp nhận
                          </Badge>
                        )}
                        {isOwner && !question.solved && !answer.isAccepted && (
                          <Button
                            colorScheme="green"
                            size="sm"
                            leftIcon={<FaCheckCircle />}
                            onClick={() => handleAcceptAnswer(answer.id)}
                          >
                            Chấp nhận
                          </Button>
                        )}
                        <ActionMenu
                          onEdit={user?.id === answer.userId ? () => handleEditAnswer(answer) : null}
                          onDelete={user?.id === answer.userId ? () => handleDeleteAnswer(answer.id) : null}
                          onReport={user?.id !== answer.userId ? () => console.log('Report answer:', answer) : null}
                          isOwner={user?.id === answer.userId}
                        />
                      </HStack>
                    </Flex>
                    <Text fontSize="md" whiteSpace="pre-line">
                      {answer.content}
                    </Text>
                  </MotionBox>
                ))}
              </VStack>

              {/* Answer Form */}
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Thêm câu trả lời của bạn</Heading>
                <CommentForm
                  onSubmit={handleAnswerSubmit}
                  userAvatar={user?.avatar}
                  placeholder="Viết câu trả lời của bạn..."
                  buttonText="Gửi câu trả lời"
                />
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </ChakraProvider>
  );
};

export default QuestionDetail;