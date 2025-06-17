import React, { useState } from 'react';
import axios from 'axios';

function Chatbot() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://127.0.0.1:5000/chat', {
        message: message
      });

      setResponse(res.data.response);
    } catch (error) {
      console.error('Error calling API:', error);
      setResponse('Lỗi kết nối tới máy chủ.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Chatbot Sơ cứu Động vật</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập câu hỏi..."
          style={{ width: '100%', padding: '10px' }}
        />
        <button type="submit" style={{ marginTop: '10px' }}>Gửi</button>
      </form>

      {response && (
        <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '10px' }}>
          <strong>Trả lời:</strong> {response}
        </div>
      )}
    </div>
  );
}

export default Chatbot;
