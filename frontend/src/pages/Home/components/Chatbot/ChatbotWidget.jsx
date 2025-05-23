import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import { FiSend } from 'react-icons/fi';
import { useAuth } from '../../../../components/contexts/AuthContext';
import axios from 'axios';
import logo from '../../../../assets/images/logo.svg';
import chatIcon from '../../../../assets/images/chaticon.svg';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatbotRef = useRef(null);
  const chatButtonRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const startTime = useRef(0);

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

  // Xử lý kéo thả chatbot widget
  const handleWidgetMouseDown = (e) => {
    if (e.target.closest('.chatbot-header')) {
      isDragging.current = false;
      startTime.current = Date.now();
      const rect = chatbotRef.current.getBoundingClientRect();
      offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      e.preventDefault();

      // Thêm event listeners khi bắt đầu kéo widget
      document.addEventListener('mousemove', handleWidgetMouseMove);
      document.addEventListener('mouseup', handleWidgetMouseUp);
    }
  };

  const handleWidgetMouseMove = (e) => {
    if (startTime.current && chatbotRef.current) {
      // Chỉ bắt đầu kéo nếu đã giữ chuột quá 100ms hoặc đã di chuyển
      if (!isDragging.current) {
        const timeDiff = Date.now() - startTime.current;
        const moveX = Math.abs(e.clientX - (chatbotRef.current.getBoundingClientRect().left + offset.current.x));
        const moveY = Math.abs(e.clientY - (chatbotRef.current.getBoundingClientRect().top + offset.current.y));

        if (timeDiff > 100 || moveX > 5 || moveY > 5) {
          isDragging.current = true;
        }
      }

      if (isDragging.current) {
        requestAnimationFrame(() => {
          const x = Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - chatbotRef.current.offsetWidth));
          const y = Math.max(0, Math.min(e.clientY - offset.current.y, window.innerHeight - chatbotRef.current.offsetHeight));
          chatbotRef.current.style.left = `${x}px`;
          chatbotRef.current.style.top = `${y}px`;
          chatbotRef.current.style.right = 'auto';
          chatbotRef.current.style.bottom = 'auto';
        });
      }
    }
  };

  const handleWidgetMouseUp = () => {
    startTime.current = 0;
    isDragging.current = false;
    
    // Xóa event listeners khi kết thúc kéo widget
    document.removeEventListener('mousemove', handleWidgetMouseMove);
    document.removeEventListener('mouseup', handleWidgetMouseUp);
  };

  // Xử lý kéo thả nút chat
  const handleButtonMouseDown = (e) => {
    startTime.current = Date.now();
    isDragging.current = false;
    const rect = chatButtonRef.current.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
    
    // Thêm event listeners khi bắt đầu kéo nút chat
    document.addEventListener('mousemove', handleButtonMouseMove);
    document.addEventListener('mouseup', handleButtonMouseUp);
  };

  const handleButtonMouseMove = (e) => {
    if (startTime.current && chatButtonRef.current) {
      // Chỉ bắt đầu kéo nếu đã giữ chuột quá 100ms hoặc đã di chuyển
      if (!isDragging.current) {
        const timeDiff = Date.now() - startTime.current;
        const moveX = Math.abs(e.clientX - (chatButtonRef.current.getBoundingClientRect().left + offset.current.x));
        const moveY = Math.abs(e.clientY - (chatButtonRef.current.getBoundingClientRect().top + offset.current.y));

        if (timeDiff > 100 || moveX > 5 || moveY > 5) {
          isDragging.current = true;
        }
      }

      if (isDragging.current) {
        requestAnimationFrame(() => {
          const x = Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - chatButtonRef.current.offsetWidth));
          const y = Math.max(0, Math.min(e.clientY - offset.current.y, window.innerHeight - chatButtonRef.current.offsetHeight));
          chatButtonRef.current.style.left = `${x}px`;
          chatButtonRef.current.style.top = `${y}px`;
          chatButtonRef.current.style.right = 'auto';
          chatButtonRef.current.style.bottom = 'auto';
        });
      }
    }
  };

  const handleButtonMouseUp = (e) => {
    if (!isDragging.current && Date.now() - startTime.current < 200) {
      setIsOpen(true);
    }
    startTime.current = 0;
    isDragging.current = false;
    
    // Xóa event listeners khi kết thúc kéo nút chat
    document.removeEventListener('mousemove', handleButtonMouseMove);
    document.removeEventListener('mouseup', handleButtonMouseUp);
  };

  // Xóa useEffect cho document event listeners vì chúng được thêm và xóa trong các hàm xử lý sự kiện

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
          ref={chatButtonRef}
          onMouseDown={handleButtonMouseDown}
        >
          <img src={chatIcon} alt="Chat" className="chatbot-icon" style={{ pointerEvents: 'none' }} />
          <div className="chatbot-tooltip">
            <span>Cần giúp đỡ? Chat với trợ lý AI 24/7</span>
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="chatbot-widget"
          ref={chatbotRef}
          onMouseDown={handleWidgetMouseDown}
        >
          <div className="chatbot-header">
            <img src={logo} alt="Pet Assistant" className="chatbot-avatar" />
            <span className="chatbot-name">Pet Assistant</span>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-container ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.sender === 'bot' && (
                  <img src={logo} alt="Bot" className="message-avatar" />
                )}
                <div className="message-content-wrapper">
                  {message.text && (
                    <div className="message-content">
                      <p className="message-text">{message.text}</p>
                    </div>
                  )}
                  {message.suggestions && (
                    <div className="message-suggestions">
                      {message.suggestions.map((suggestion, index) => (
                        <span
                          key={index}
                          className="suggestion-tag"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                {message.sender === 'user' && (
                  <div className="user-avatar message-avatar">
                    {user.displayName ? user.displayName.charAt(0) : 'U'}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="message-container bot-message">
                <img src={logo} alt="Bot" className="message-avatar" />
                <div className="message-content typing-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <div className="input-group">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="message-input"
              />
              <button 
                className={`send-button ${inputValue.trim() === '' ? 'disabled' : ''}`}
                disabled={inputValue.trim() === ''}
                onClick={handleSendMessage}
              >
                <FiSend />
              </button>
            </div>
          </div>

          <div className="chatbot-footer">
            <span className="footer-text">
              Powered by Pet Assistant - 24/7 Support
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;