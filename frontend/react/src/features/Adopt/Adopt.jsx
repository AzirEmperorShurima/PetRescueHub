import React from 'react';
import { Link } from 'react-router-dom';
import './Adopt.css';

const Adopt = () => {
  const pets = [
    { id: 1, name: 'Buddy', age: '2 tuổi', description: 'Chó Golden Retriever thân thiện.', image: 'https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg' },
    { id: 2, name: 'Whiskers', age: '1 tuổi', description: 'Mèo Xiêm đáng yêu.', image: 'https://images.pexels.com/photos/4587993/pexels-photo-4587993.jpeg' },
  ];

  return (
    <div className="adopt-page">
      <header className="adopt-header text-center">
        <h1>Nhận nuôi</h1>
        <p className="lead">Tìm kiếm người bạn đồng hành mới cho gia đình bạn.</p>
      </header>
      <section className="adopt-content container">
        <div className="pet-list">
          {pets.map((pet) => (
            <div key={pet.id} className="pet-item">
              <img src={pet.image} alt={pet.name} className="pet-image" />
              <div className="pet-info">
                <h3>{pet.name}</h3>
                <p><strong>Tuổi:</strong> {pet.age}</p>
                <p>{pet.description}</p>
                <Link to={`/adopt/${pet.id}`} className="btn btn-primary">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Adopt;