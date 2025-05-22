import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Text,
  Input,
  Button,
  IconButton,
  Avatar,
  Flex,
  Tag,
  useColorModeValue,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { CloseIcon, ChatIcon } from '@chakra-ui/icons';
import { FiSend } from 'react-icons/fi';
import { useAuth } from '../../../../components/contexts/AuthContext';
import axios from 'axios';
import logo from '../../../../assets/images/logo.svg';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatbotRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const headerBgColor = useColorModeValue('blue.500', 'blue.400');
  const headerTextColor = 'white';
  const botMessageBg = useColorModeValue('gray.100', 'gray.700');
  const userMessageBg = useColorModeValue('blue.100', 'blue.700');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý AI của Pet Rescue Hub. Tôi có thể giúp bạn về cứu hộ, chăm sóc thú cưng hoặc các câu hỏi khẩn cấp!',
      sender: 'bot',
      timestamp: new Date()
    };

    const suggestionMessage = {
      id: 2,
      suggestions: [
        'Cách cứu hộ thú cưng',
        'Chăm sóc thú cưng mới',
        'Báo cáo trường hợp khẩn cấp',
        'Quy trình nhận nuôi'
      ],
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages([welcomeMessage, suggestionMessage]);
  }, []);

  // Xử lý kéo thả chatbot
  const handleMouseDown = (e) => {
    if (e.target.closest('.chatbot-header')) {
      isDragging.current = true;
      const rect = chatbotRef.current.getBoundingClientRect();
      offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging.current && chatbotRef.current) {
      requestAnimationFrame(() => {
        if (!isDragging.current) return;
        const x = Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - chatbotRef.current.offsetWidth));
        const y = Math.max(0, Math.min(e.clientY - offset.current.y, window.innerHeight - chatbotRef.current.offsetHeight));
        chatbotRef.current.style.left = `${x}px`;
        chatbotRef.current.style.top = `${y}px`;
        chatbotRef.current.style.right = 'auto';
        chatbotRef.current.style.bottom = 'auto';
      });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
  
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
  
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);
  
    try {
      // Thay đổi URL API thành localhost hoặc URL phù hợp với môi trường của bạn
      const res = await axios.post('http://localhost:5000/chat', {
        message: inputValue
      });
  
      const botResponse = {
        id: messages.length + 2,
        text: res.data.response || 'Không có phản hồi từ AI.',
        sender: 'bot',
        timestamp: new Date()
      };
  
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const botResponse = {
        id: messages.length + 2,
        text: 'Lỗi kết nối tới máy chủ.',
        sender: 'bot',
        timestamp: new Date()
      };
  
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    const userMessage = {
      id: messages.length + 1,
      text: suggestion,
      sender: 'user',
      timestamp: new Date()
    };
  
    setMessages([...messages, userMessage]);
    setIsTyping(true);
  
    // Sử dụng hàm getBotResponse để lấy phản hồi thay vì gọi API
    setTimeout(() => {
      const botResponseText = getBotResponse(suggestion);
      const relatedSuggestions = getRelatedSuggestions(suggestion);
      
      const botResponse = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Thêm tin nhắn gợi ý liên quan nếu có
      if (relatedSuggestions && relatedSuggestions.length > 0) {
        const suggestionsMessage = {
          id: messages.length + 3,
          suggestions: relatedSuggestions,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, suggestionsMessage]);
      }
      
      setIsTyping(false);
    }, 1000); // Giả lập độ trễ phản hồi 1 giây
  };

  const getBotResponse = (message) => {
    const lower = message.toLowerCase();
    if (lower.includes('cứu hộ')) {
      return 'Báo cáo trường hợp cứu hộ bằng tính năng trên trang chủ hoặc gọi hotline 1900-xxxx.';
    } else if (lower.includes('chăm sóc')) {
      return 'Chăm sóc thú cưng bao gồm chỉnh dịh dỡ sinh, thức ăn, và tiêm phòng đầy đủ.';
    } else if (lower.includes('khẩn cấp')) {
      return 'Trong khẩn cấp, hãy gọi ngay hotline và cung cấp địa chỉ, tình trạng.';
    } else if (lower.includes('nhận nuôi')) {
      return 'Quy trình nhận nuôi gồm đăng ký, đánh giá, ký cam kết.';
    } else {
      return 'Tôi có thể hỗ trợ bạn với thông tin về cứu hộ, chăm sóc, nhận nuôi thú cưng.';
    }
  };

  const getRelatedSuggestions = (message) => {
    const lower = message.toLowerCase();
    if (lower.includes('cứu hộ')) {
      return ['Báo cáo khẩn cấp', 'Liên hệ đội cứu hộ'];
    } else if (lower.includes('chăm sóc')) {
      return ['Thức ăn cho thú cưng', 'Lịch tiêm phòng'];
    } else if (lower.includes('khẩn cấp')) {
      return ['Sơ cứu thú cưng', 'Số hotline'];
    } else if (lower.includes('nhận nuôi')) {
      return ['Chi phí nhận nuôi', 'Hồ sơ nhận nuôi'];
    } else {
      return ['Cách cứu hộ thú cưng', 'Chăm sóc thú cưng mới'];
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Chỉ render component nếu user đã đăng nhập
  if (!user) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <Box
          position="fixed"
          bottom="20px"
          right="20px"
          zIndex="999"
          onClick={() => setIsOpen(true)}
          className="chatbot-button"
        >
          <IconButton
            icon={<ChatIcon />}
            colorScheme="blue"
            isRound
            size="lg"
            _hover={{ transform: 'scale(1.1)' }}
            transition="all 0.2s"
            aria-label="Open chat"
          />
          <Box
            position="absolute"
            right="60px"
            bottom="10px"
            bg="white"
            boxShadow="md"
            p="2"
            borderRadius="md"
            className="chatbot-tooltip"
            display="none"
            _groupHover={{ display: 'block' }}
            maxWidth="200px"
          >
            <Text fontSize="sm">Cần giúp đỡ? Chat với trợ lý AI 24/7</Text>
          </Box>
        </Box>
      )}

      {isOpen && (
        <Box
          position="fixed"
          bottom="20px"
          right="20px"
          width="350px"
          height="500px"
          bg={bgColor}
          borderRadius="lg"
          boxShadow="xl"
          zIndex="999"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          ref={chatbotRef}
          onMouseDown={handleMouseDown}
          className="chatbot-widget"
        >
          <Flex
            p="3"
            align="center"
            bg={headerBgColor}
            color={headerTextColor}
            className="chatbot-header"
            cursor="grab"
          >
            <Avatar src={logo} size="sm" />
            <Text ml="2" fontWeight="bold" flex="1">
              Pet Assistant
            </Text>
            <IconButton
              icon={<CloseIcon />}
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            />
          </Flex>

          <Box
            flex="1"
            overflowY="auto"
            p="3"
            className="chatbot-messages"
          >
            {messages.map((message) => (
              <Flex
                key={message.id}
                justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                mb="4"
                className={`message-container ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.sender === 'bot' && (
                  <Avatar src={logo} size="sm" mr="2" />
                )}
                <Box maxWidth="80%">
                  {message.text && (
                    <Box
                      bg={message.sender === 'user' ? userMessageBg : botMessageBg}
                      p="3"
                      borderRadius="lg"
                      className="message-text"
                    >
                      <Text>{message.text}</Text>
                    </Box>
                  )}
                  {message.suggestions && (
                    <Flex wrap="wrap" mt="2" gap="2" className="message-suggestions">
                      {message.suggestions.map((suggestion, index) => (
                        <Tag
                          key={index}
                          size="md"
                          variant="subtle"
                          colorScheme="blue"
                          cursor="pointer"
                          onClick={() => handleSuggestionClick(suggestion)}
                          _hover={{ bg: 'blue.100' }}
                        >
                          {suggestion}
                        </Tag>
                      ))}
                    </Flex>
                  )}
                  <Text fontSize="xs" color="gray.500" mt="1" textAlign={message.sender === 'user' ? 'right' : 'left'}>
                    {formatTime(message.timestamp)}
                  </Text>
                </Box>
                {message.sender === 'user' && (
                  <Avatar size="sm" ml="2" name="User" bg="blue.500" />
                )}
              </Flex>
            ))}

            {isTyping && (
              <Flex mb="4" align="flex-start">
                <Avatar src={logo} size="sm" mr="2" />
                <Box
                  bg={botMessageBg}
                  p="3"
                  borderRadius="lg"
                  className="typing-content"
                >
                  <Flex gap="1" className="typing-indicator">
                    <Box
                      h="2"
                      w="2"
                      borderRadius="full"
                      bg="blue.500"
                      animation="bounce 1s infinite"
                      style={{ animationDelay: '0s' }}
                    />
                    <Box
                      h="2"
                      w="2"
                      borderRadius="full"
                      bg="blue.500"
                      animation="bounce 1s infinite"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <Box
                      h="2"
                      w="2"
                      borderRadius="full"
                      bg="blue.500"
                      animation="bounce 1s infinite"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </Flex>
                </Box>
              </Flex>
            )}
            <Box ref={messagesEndRef} />
          </Box>

          <Box p="3" borderTop="1px" borderColor="gray.200" className="chatbot-input">
            <InputGroup>
              <Input
                placeholder="Nhập tin nhắn..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                pr="10"
              />
              <InputRightElement>
                <IconButton
                  icon={<FiSend />}
                  size="sm"
                  colorScheme="blue"
                  variant="ghost"
                  isDisabled={inputValue.trim() === ''}
                  onClick={handleSendMessage}
                  aria-label="Send message"
                />
              </InputRightElement>
            </InputGroup>
          </Box>

          <Box p="2" textAlign="center" borderTop="1px" borderColor="gray.200" className="chatbot-footer">
            <Text fontSize="xs" color="gray.500">
              Powered by Pet Assistant - 24/7 Support
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatbotWidget;