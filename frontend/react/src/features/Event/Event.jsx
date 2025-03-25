import React from 'react';
import { Link } from 'react-router-dom';
import './Event.css';

const Event = () => {
  const events = [
    { id: 1, name: 'Ngày nhận nuôi thú cưng', date: '2023-11-15', location: 'Công viên XYZ', description: 'Gặp gỡ và nhận nuôi các thú cưng đáng yêu.' },
    { id: 2, name: 'Hội thảo chăm sóc thú cưng', date: '2023-12-01', location: 'Trung tâm ABC', description: 'Học cách chăm sóc thú cưng từ các chuyên gia.' },
  ];

  return (
    <div className="event-page">
      <header className="event-header text-center">
        <h1>Sự kiện</h1>
        <p className="lead">Tham gia các sự kiện để hỗ trợ và tìm hiểu về cứu hộ thú cưng.</p>
      </header>
      <section className="event-content container">
        <div className="event-list">
          {events.map((event) => (
            <div key={event.id} className="event-item">
              <h3>{event.name}</h3>
              <p><strong>Ngày:</strong> {event.date}</p>
              <p><strong>Địa điểm:</strong> {event.location}</p>
              <p>{event.description}</p>
              <Link to={`/event/${event.id}/register`} className="btn btn-primary">
                Đăng ký tham gia
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Event;