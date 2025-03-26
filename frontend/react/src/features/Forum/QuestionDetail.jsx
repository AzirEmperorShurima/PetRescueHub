import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Divider, 
  IconButton,
  Avatar,
  Chip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';

// Import các components dùng chung
import { 
  LikeButton, 
  CommentForm, 
  CommentList, 
  ShareButton, 
  TagList,
  ActionMenu
} from '../../components/common';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      setLoading(true);
      try {
        // Trong thực tế, bạn sẽ gọi API thực sự
        // const response = await api.get(`/forum/questions/${id}`);
        // setQuestion(response.data);
        
        // Dữ liệu mẫu
        setTimeout(() => {
          const mockQuestion = {
            id: parseInt(id),
            title: 'Làm thế nào để huấn luyện mèo đi vệ sinh đúng chỗ?',
            content: 'Mèo nhà mình mới 3 tháng tuổi, làm thế nào để huấn luyện bé đi vệ sinh đúng chỗ?\n\nMình đã thử đặt khay cát ở nhiều vị trí khác nhau nhưng bé vẫn không sử dụng. Mong mọi người chia sẻ kinh nghiệm.',
            author: 'Trần Thị B',
            authorAvatar: 'https://i.pravatar.cc/150?img=5',
            authorId: 'user2',
            date: '2023-11-09T14:20:00',
            tags: ['mèo', 'huấn luyện', 'vệ sinh'],
            solved: false
          };
          setQuestion(mockQuestion);
          setLikeCount(8);
          
          // Mock answers
          setAnswers([
            {
              id: 1,
              author: 'Nguyễn Văn A',
              avatar: 'https://i.pravatar.cc/150?img=1',
              content: 'Bạn nên đặt khay cát ở nơi yên tĩnh, tránh xa khu vực ăn uống của mèo. Mỗi khi thấy mèo có dấu hiệu muốn đi vệ sinh (như đào đào, quay quay), hãy nhẹ nhàng đặt bé vào khay cát.',
              createdAt: '2023-11-10T08:30:00',
              userId: 'user1',
              isAccepted: false
            },
            {
              id: 2,
              author: 'Lê Văn C',
              avatar: 'https://i.pravatar.cc/150?img=8',
              content: 'Mèo thường thích khay cát sạch. Hãy vệ sinh khay cát thường xuyên và sử dụng cát không mùi. Ngoài ra, bạn có thể thử sử dụng phun xịt thu hút mèo đến khay cát.',
              createdAt: '2023-11-11T14:20:00',
              userId: 'user3',
              isAccepted: false
            }
          ]);
          
          setLoading(false);
        }, 1000);
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
    // Xử lý chỉnh sửa câu trả lời
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
    // Xử lý chỉnh sửa câu hỏi
    console.log('Edit question:', question);
  };

  const handleDeleteQuestion = () => {
    // Xử lý xóa câu hỏi
    console.log('Delete question:', question);
    navigate('/forum');
  };

  const handleReportQuestion = () => {
    // Xử lý báo cáo câu hỏi
    console.log('Report question:', question);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>Đang tải...</Typography>
        </Box>
      </Container>
    );
  }

  if (!question) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">Không tìm thấy câu hỏi</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/forum')}
            sx={{ mt: 2 }}
          >
            Quay lại diễn đàn
          </Button>
        </Box>
      </Container>
    );
  }

  const isOwner = user?.id === question.authorId;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/forum')} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
              {question.title}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {question.solved && (
              <Chip 
                icon={<CheckCircleIcon />} 
                label="Đã giải quyết" 
                color="success" 
                sx={{ mr: 1 }} 
              />
            )}
            
            <ActionMenu
              onEdit={isOwner ? handleEditQuestion : null}
              onDelete={isOwner ? handleDeleteQuestion : null}
              onReport={!isOwner ? handleReportQuestion : null}
              isOwner={isOwner}
            />
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar src={question.authorAvatar} alt={question.author} sx={{ width: 40, height: 40, mr: 1 }} />
          <Box>
            <Typography variant="subtitle1">{question.author}</Typography>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(question.date), 'dd/MM/yyyy HH:mm', { locale: vi })}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
          {question.content}
        </Typography>
        
        <TagList tags={question.tags} sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <LikeButton 
            liked={liked} 
            likeCount={likeCount} 
            onLike={handleLike} 
          />
          <ShareButton 
            url={window.location.href} 
            title={question.title} 
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          {answers.length} Câu trả lời
        </Typography>
        
        {answers.map((answer) => (
          <Paper key={answer.id} elevation={0} sx={{ p: 2, mb: 2, bgcolor: answer.isAccepted ? '#e8f5e9' : '#f5f5f5', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar src={answer.avatar} alt={answer.author} sx={{ width: 32, height: 32, mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2">{answer.author}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(answer.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {answer.isAccepted && (
                  <Chip 
                    icon={<CheckCircleIcon />} 
                    label="Câu trả lời được chấp nhận" 
                    color="success" 
                    size="small"
                    sx={{ mr: 1 }} 
                  />
                )}
                
                {isOwner && !question.solved && !answer.isAccepted && (
                  <Button 
                    variant="outlined" 
                    color="success" 
                    size="small" 
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleAcceptAnswer(answer.id)}
                    sx={{ mr: 1 }}
                  >
                    Chấp nhận
                  </Button>
                )}
                
                <ActionMenu
                  onEdit={user?.id === answer.userId ? handleEditAnswer.bind(null, answer) : null}
                  onDelete={user?.id === answer.userId ? handleDeleteAnswer.bind(null, answer.id) : null}
                  onReport={user?.id !== answer.userId ? () => console.log('Report answer:', answer) : null}
                  isOwner={user?.id === answer.userId}
                />
              </Box>
            </Box>
            
            <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
              {answer.content}
            </Typography>
          </Paper>
        ))}
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thêm câu trả lời của bạn
          </Typography>
          
          <CommentForm 
            onSubmit={handleAnswerSubmit} 
            userAvatar={user?.avatar} 
            placeholder="Viết câu trả lời của bạn..."
            buttonText="Gửi câu trả lời"
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default QuestionDetail;