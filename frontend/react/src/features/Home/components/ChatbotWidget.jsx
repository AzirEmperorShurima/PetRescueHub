import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, Avatar } from '@mui/material';
import { Close as CloseIcon, Send as SendIcon, Chat as ChatIcon } from '@mui/icons-material';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Thêm tin nhắn chào mừng khi component được mount
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý ảo của Pet Rescue Hub. Tôi có thể giúp gì cho bạn về cứu hộ, chăm sóc thú cưng hoặc các câu hỏi khẩn cấp?',
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
  
  // Xử lý khi người dùng gửi tin nhắn
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Thêm tin nhắn của người dùng vào danh sách
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Giả lập bot đang trả lời
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Xử lý khi người dùng nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Xử lý khi người dùng chọn gợi ý
  const handleSuggestionClick = (suggestion) => {
    // Thêm tin nhắn của người dùng vào danh sách
    const userMessage = {
      id: messages.length + 1,
      text: suggestion,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setIsTyping(true);
    
    // Giả lập bot đang trả lời
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(suggestion),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Hàm trả về câu trả lời của bot dựa trên tin nhắn của người dùng
  const getBotResponse = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    
    if (lowerCaseMessage.includes('cứu hộ')) {
      return 'Để báo cáo trường hợp cứu hộ, bạn có thể sử dụng tính năng "Gửi yêu cầu cứu hộ" trên trang chủ hoặc gọi đến số hotline 1900-xxxx. Trong trường hợp khẩn cấp, hãy cung cấp địa chỉ chính xác và mô tả tình trạng của thú cưng.';
    } else if (lowerCaseMessage.includes('chăm sóc')) {
      return 'Để chăm sóc thú cưng mới, bạn cần đảm bảo cung cấp đủ thức ăn, nước uống, và một không gian an toàn. Bạn nên đưa thú cưng đi khám thú y để kiểm tra sức khỏe và tiêm phòng đầy đủ. Bạn có thể tìm thêm thông tin chi tiết trong mục Hướng dẫn chăm sóc thú cưng trên trang web của chúng tôi.';
    } else if (lowerCaseMessage.includes('khẩn cấp')) {
      return 'Trong trường hợp khẩn cấp, hãy gọi ngay đến số hotline 1900-xxxx. Chúng tôi có đội ngũ cứu hộ 24/7 sẵn sàng hỗ trợ. Hãy giữ bình tĩnh và cung cấp thông tin chính xác về vị trí và tình trạng của thú cưng.';
    } else if (lowerCaseMessage.includes('nhận nuôi')) {
      return 'Quy trình nhận nuôi thú cưng tại Pet Rescue Hub bao gồm: Đăng ký thông tin cá nhân, phỏng vấn đánh giá, kiểm tra điều kiện sống, và ký kết cam kết chăm sóc. Sau khi hoàn tất, bạn sẽ được hướng dẫn chi tiết về cách chăm sóc thú cưng mới. Bạn có thể tìm hiểu thêm tại mục Nhận nuôi trên trang web của chúng tôi.';
    } else {
      return 'Cảm ơn bạn đã liên hệ với Pet Rescue Hub. Tôi có thể giúp bạn với các thông tin về cứu hộ, chăm sóc thú cưng, quy trình nhận nuôi hoặc các trường hợp khẩn cấp. Bạn cần hỗ trợ gì?';
    }
  };
  
  // Format thời gian
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      {/* Chatbot Button */}
      <Box 
        className={`chatbot-button ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <ChatIcon className="chatbot-icon" />
        <span className="chatbot-tooltip">Cần giúp đỡ? Chat với trợ lý 24/7</span>
      </Box>
      
      {/* Chatbot Widget */}
      <Box className={`chatbot-widget ${isOpen ? 'open' : ''}`}>
        <Box className="chatbot-header">
          <Box className="chatbot-header-info">
            <Avatar className="chatbot-avatar" src="https://i.pravatar.cc/150?img=3" />
            <Box>
              <Typography variant="subtitle1" className="chatbot-name">Pet Rescue Assistant</Typography>
              <Typography variant="caption" className="chatbot-status">Online | Hỗ trợ 24/7</Typography>
            </Box>
          </Box>
          <IconButton className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box className="chatbot-messages">
          {messages.map((message) => (
            <Box 
              key={message.id} 
              className={`message-container ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              {message.sender === 'bot' && (
                <Avatar className="message-avatar" src="https://i.pravatar.cc/150?img=3" />
              )}
              
              <Box className="message-content">
                {message.text && (
                  <Typography className="message-text">{message.text}</Typography>
                )}
                
                {message.suggestions && (
                  <Box className="message-suggestions">
                    {message.suggestions.map((suggestion, index) => (
                      <Button 
                        key={index} 
                        variant="outlined" 
                        size="small" 
                        className="suggestion-btn"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </Box>
                )}
                
                <Typography variant="caption" className="message-time">
                  {formatTime(message.timestamp)}
                </Typography>
              </Box>
              
              {message.sender === 'user' && (
                <Avatar className="message-avatar user-avatar">U</Avatar>
              )}
            </Box>
          ))}
          
          {isTyping && (
            <Box className="message-container bot-message">
              <Avatar className="message-avatar" src="https://i.pravatar.cc/150?img=3" />
              <Box className="message-content">
                <Box className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </Box>
              </Box>
            </Box>
          )}
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
                <IconButton 
                  color="primary" 
                  onClick={handleSendMessage}
                  disabled={inputValue.trim() === ''}
                >
                  <SendIcon />
                </IconButton>
              )
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default ChatbotWidget;