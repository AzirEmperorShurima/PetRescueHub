import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, IconButton, Avatar, Chip } from '@mui/material';
import { Close as CloseIcon, Send as SendIcon, Chat as ChatIcon } from '@mui/icons-material';
import { useAuth } from '../../../../components/contexts/AuthContext';
import './ChatbotWidget.css';
import axios from 'axios';
import logo from '../../../../assets/images/logo.svg';

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
        <div 
          className="chatbot-button" 
          onClick={() => setIsOpen(true)}
        >
          <ChatIcon className="chatbot-icon" />
          <span className="chatbot-tooltip">Cần giúp đỡ? Chat với trợ lý AI 24/7</span>
        </div>
      )}

      {isOpen && (
        <div 
          className="chatbot-widget"
          ref={chatbotRef}
          onMouseDown={handleMouseDown}
        >
          <div className="chatbot-header">
            <Avatar className="chatbot-avatar" src={logo}/>
            <Typography variant="subtitle1" className="chatbot-name">Pet Assistant</Typography>
            <IconButton className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

            <Box className="chatbot-messages">
              {messages.map((message) => (
                <Box key={message.id} className={`message-container ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                  {message.sender === 'bot' && <Avatar className="message-avatar" src={logo} />}
                  <Box className="message-content">
                    {message.text && <Typography className="message-text">{message.text}</Typography>}
                    {message.suggestions && (
                      <Box className="message-suggestions">
                        {message.suggestions.map((suggestion, index) => (
                          <Chip key={index} label={suggestion} onClick={() => handleSuggestionClick(suggestion)} clickable />
                        ))}
                      </Box>
                    )}
                    <Typography variant="caption" className="message-time">{formatTime(message.timestamp)}</Typography>
                  </Box>
                  {message.sender === 'user' && <Avatar className="message-avatar user-avatar">U</Avatar>}
                </Box>
              ))}

              {isTyping && (
                <Box className="message-container bot-message">
                  <Avatar className="message-avatar" src={logo} />
                  <Box className="message-content typing-content">
                    <Box className="typing-indicator">
                      <span></span><span></span><span></span>
                    </Box>
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Box className="chatbot-input">
              <TextField
                fullWidth
                placeholder="Nhập tin nhắn..."
                variant="outlined"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <IconButton color="primary" onClick={handleSendMessage} disabled={inputValue.trim() === ''}>
                      <SendIcon />
                    </IconButton>
                  )
                }}
              />
            </Box>

            <Box className="chatbot-footer">
              <Typography variant="caption">Powered by Pet Assistant - 24/7 Support</Typography>
            </Box>
          </div>
        )}
      </>
  );
};

export default ChatbotWidget;