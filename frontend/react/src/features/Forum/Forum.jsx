import React from 'react';
import { Link } from 'react-router-dom';
import './Forum.css';

const Forum = () => {
  const topics = [
    { id: 1, title: 'Cách chăm sóc chó con', posts: 15, date: '2023-10-01' },
    { id: 2, title: 'Kinh nghiệm nhận nuôi mèo', posts: 8, date: '2023-10-02' },
    { id: 3, title: 'Thảo luận về thức ăn cho thú cưng', posts: 20, date: '2023-10-03' },
  ];

  return (
    <div className="forum-page">
      <header className="forum-header text-center">
        <h1>Diễn đàn</h1>
        <p className="lead">Chia sẻ và thảo luận về các chủ đề liên quan đến thú cưng.</p>
      </header>
      <section className="forum-content container">
        <div className="topics-list">
          {topics.map((topic) => (
            <div key={topic.id} className="topic-item">
              <h3>
                <Link to={`/forum/${topic.id}`} className="topic-link">
                  {topic.title}
                </Link>
              </h3>
              <p>{topic.posts} bài viết | Ngày đăng: {topic.date}</p>
            </div>
          ))}
        </div>
        <div className="create-topic text-end">
          <Link to="/forum/new" className="btn btn-primary">
            Tạo chủ đề mới
          </Link>
        </div>
        <nav className="pagination-nav mt-4" aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className="page-item"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
          </ul>
        </nav>
      </section>
    </div>
  );
};

export default Forum;