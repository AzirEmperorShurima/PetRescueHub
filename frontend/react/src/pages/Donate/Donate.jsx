import React, { useState } from 'react';
import './Donate.css';

const Donate = () => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Cảm ơn ${name} đã quyên góp ${amount} VNĐ!`);
    // Xử lý gửi dữ liệu (gọi API nếu cần)
  };

  return (
    <div className="donate-page">
      <header className="donate-header text-center">
        <h1>Quyên góp</h1>
        <p className="lead">Hỗ trợ chúng tôi để cứu giúp nhiều thú cưng hơn.</p>
      </header>
      <section className="donate-content container">
        <form onSubmit={handleSubmit} className="donate-form">
          <div className="form-group">
            <label htmlFor="amount">Số tiền (VNĐ)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Họ và tên</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Gửi quyên góp
          </button>
        </form>
      </section>
    </div>
  );
};

export default Donate;