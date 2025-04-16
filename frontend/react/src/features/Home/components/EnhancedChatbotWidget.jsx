import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, IconButton, Avatar, CircularProgress, Chip } from '@mui/material';
import { Close as CloseIcon, Send as SendIcon, Chat as ChatIcon, Mic as MicIcon, Image as ImageIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import './EnhancedChatbotWidget.css';

const EnhancedChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Thêm tin nhắn chào mừng khi component được mount
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý AI của Pet Rescue Hub. Tôi có thể giúp gì cho bạn về cứu hộ, chăm sóc thú cưng hoặc các câu hỏi khẩn cấp?',
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
    
    setTimeout(() => {
      setMessages([welcomeMessage]);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, suggestionMessage]);
      }, 1000);
    }, 500);
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
      
      // Thêm gợi ý sau khi bot trả lời
      if (Math.random() > 0.5) {
        setTimeout(() => {
          const suggestionMessage = {
            id: messages.length + 3,
            suggestions: getRelatedSuggestions(inputValue),
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prevMessages => [...prevMessages, suggestionMessage]);
        }, 1000);
      }
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
  
  // Xử lý khi người dùng sử dụng voice input
  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      
      // Giả lập voice recognition
      setTimeout(() => {
        setIsListening(false);
        setInputValue('Tôi cần thông tin về cách chăm sóc chó con mới nhận nuôi');
      }, 2000);
    } else {
      setIsListening(false);
    }
  };
  
  // Hàm trả về câu trả lời của bot dựa trên tin nhắn của người dùng
  const getBotResponse = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    
    if (lowerCaseMessage.includes('cứu hộ')) {
      return 'Để báo cáo trường hợp cứu hộ, bạn có thể sử dụng tính năng "Gửi yêu cầu cứu hộ" trên trang chủ hoặc gọi đến số hotline 1900-xxxx. Trong trường hợp khẩn cấp, hãy cung cấp địa chỉ chính xác và mô tả tình trạng của thú cưng. Đội cứu hộ của chúng tôi hoạt động 24/7 và sẽ phản hồi trong thời gian sớm nhất.';
    } else if (lowerCaseMessage.includes('chăm sóc')) {
      return 'Để chăm sóc thú cưng mới, bạn cần đảm bảo cung cấp đủ thức ăn, nước uống, và một không gian an toàn. Bạn nên đưa thú cưng đi khám thú y để kiểm tra sức khỏe và tiêm phòng đầy đủ. Đối với chó con, cần cho ăn 3-4 lần/ngày, còn mèo con 2-3 lần/ngày. Đảm bảo thú cưng được vận động đầy đủ và có thời gian nghỉ ngơi. Bạn có thể tìm thêm thông tin chi tiết trong mục Hướng dẫn chăm sóc thú cưng trên trang web của chúng tôi.';
    } else if (lowerCaseMessage.includes('khẩn cấp')) {
      return 'Trong trường hợp khẩn cấp, hãy gọi ngay đến số hotline 1900-xxxx. Chúng tôi có đội ngũ cứu hộ 24/7 sẵn sàng hỗ trợ. Hãy giữ bình tĩnh và cung cấp thông tin chính xác về vị trí và tình trạng của thú cưng. Nếu thú cưng bị thương, hãy cố gắng sơ cứu ban đầu theo hướng dẫn trong mục "Sơ cứu khẩn cấp" trên trang web của chúng tôi trước khi đội cứu hộ đến.';
    } else if (lowerCaseMessage.includes('nhận nuôi')) {
      return 'Quy trình nhận nuôi thú cưng tại Pet Rescue Hub bao gồm: Đăng ký thông tin cá nhân, phỏng vấn đánh giá, kiểm tra điều kiện sống, và ký kết cam kết chăm sóc. Chúng tôi yêu cầu người nhận nuôi phải trên 18 tuổi, có khả năng tài chính và thời gian để chăm sóc thú cưng. Sau khi hoàn tất, bạn sẽ được hướng dẫn chi tiết về cách chăm sóc thú cưng mới. Bạn có thể tìm hiểu thêm tại mục Nhận nuôi trên trang web của chúng tôi.';
    } else if (lowerCaseMessage.includes('quyên góp') || lowerCaseMessage.includes('ủng hộ')) {
      return 'Cảm ơn bạn đã quan tâm đến việc quyên góp! Bạn có thể quyên góp cho Pet Rescue Hub thông qua nhiều hình thức: chuyển khoản ngân hàng, ví điện tử, hoặc quyên góp hiện vật như thức ăn, thuốc men, và vật dụng cho thú cưng. Mọi đóng góp, dù lớn hay nhỏ, đều rất có ý nghĩa với chúng tôi và các thú cưng đang cần sự giúp đỡ. Vui lòng truy cập trang Quyên góp để biết thêm chi tiết.';
    } else if (lowerCaseMessage.includes('tình nguyện viên')) {
      return 'Để trở thành tình nguyện viên của Pet Rescue Hub, bạn cần đăng ký thông tin cá nhân, tham gia buổi định hướng, và chọn lĩnh vực phù hợp với kỹ năng của bạn. Chúng tôi có nhiều vị trí như: hỗ trợ cứu hộ, chăm sóc thú cưng tại trung tâm, tổ chức sự kiện, truyền thông, và vận động quyên góp. Bạn có thể đăng ký tại mục Tình nguyện viên trên trang web của chúng tôi.';
    } else {
      return 'Cảm ơn bạn đã liên hệ với Pet Rescue Hub. Tôi có thể giúp bạn với các thông tin về cứu hộ, chăm sóc thú cưng, quy trình nhận nuôi, quyên góp, hoặc các trường hợp khẩn cấp. Bạn cũng có thể tìm hiểu thêm về các sự kiện sắp tới hoặc cách trở thành tình nguyện viên. Bạn cần hỗ trợ gì?';
    }
  };
  
  // Hàm trả về các gợi ý liên quan dựa trên tin nhắn của người dùng
  const getRelatedSuggestions = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    
    if (lowerCaseMessage.includes('cứu hộ')) {
      return [
        'Quy trình cứu hộ',
        'Báo cáo trường hợp khẩn cấp',
        'Liên hệ đội cứu hộ'
      ];
    } else if (lowerCaseMessage.includes('chăm sóc')) {
      return [
        'Chăm sóc chó con',
        'Chăm sóc mèo con',
        'Thức ăn phù hợp',
        'Lịch tiêm phòng'
      ];
    } else if (lowerCaseMessage.includes('khẩn cấp')) {
      return [
        'Sơ cứu thú cưng',
        'Số hotline cứu hộ',
        'Bệnh viện thú y gần đây'
      ];
    } else if (lowerCaseMessage.includes('nhận nuôi')) {
      return [
        'Danh sách thú cưng cần nhà',
        'Điều kiện nhận nuôi',
        'Chi phí nhận nuôi',
        'Hồ sơ nhận nuôi'
      ];
    } else {
      return [
        'Cách cứu hộ thú cưng',
        'Chăm sóc thú cưng mới',
        'Quyên góp',
        'Trở thành tình nguyện viên'
      ];
    }
  };
  
  // Format thời gian
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Animation variants
  const chatbotButtonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 500, damping: 30 }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const chatbotWidgetVariants = {
    hidden: { scale: 0, opacity: 0, originX: 1, originY: 1 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 500, damping: 30 }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 500, damping: 30 }
    }
  };

  return (
    <>
      {/* Chatbot Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            className="chatbot-button"
            onClick={() => setIsOpen(true)}
            variants={chatbotButtonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChatIcon className="chatbot-icon" />
            <span className="chatbot-tooltip">Cần giúp đỡ? Chat với trợ lý AI 24/7</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chatbot Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chatbot-widget"
            variants={chatbotWidgetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Box className="chatbot-header">
              <Box className="chatbot-header-info">
                <Avatar className="chatbot-avatar" src="https://i.pravatar.cc/150?img=3" />
                <Box>
                  <Typography variant="subtitle1" className="chatbot-name">Pet Rescue AI Assistant</Typography>
                  <Box className="chatbot-status-container">
                    <span className="status-dot"></span>
                    <Typography variant="caption" className="chatbot-status">Online | Hỗ trợ 24/7</Typography>
                  </Box>
                </Box>
              </Box>
              <IconButton 
                className="chatbot-close-btn" 
                onClick={() => setIsOpen(false)}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Box className="chatbot-messages" id="chatbot-messages">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div 
                    key={message.id} 
                    className={`message-container ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
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
                            <Chip
                              key={index}
                              label={suggestion}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="suggestion-chip"
                              clickable
                            />
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
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div 
                    className="message-container bot-message"
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Avatar className="message-avatar" src="https://i.pravatar.cc/150?img=3" />
                    <Box className="message-content typing-content">
                      <Box className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </Box>
                    </Box>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </Box>
            
            <Box className="chatbot-input">
              <TextField
                fullWidth
                placeholder="Nhập tin nhắn..."
                variant="outlined"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isListening}
                InputProps={{
                  endAdornment: (
                    <Box className="input-actions">
                      <IconButton 
                        color="primary" 
                        onClick={handleVoiceInput}
                        className={isListening ? 'listening' : ''}
                      >
                        {isListening ? <CircularProgress size={24} /> : <MicIcon />}
                      </IconButton>
                      <IconButton 
                        color="primary" 
                        onClick={handleSendMessage}
                        disabled={inputValue.trim() === ''}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  )
                }}
              />
            </Box>
            
            <Box className="chatbot-footer">
              <Typography variant="caption" className="powered-by">
                Powered by Pet Rescue AI - Hỗ trợ 24/7
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedChatbotWidget;