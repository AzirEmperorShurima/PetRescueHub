import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Rating } from '@mui/material';
import './TestimonialsSection.css';

const TestimonialsSection = ({ testimonials }) => {
  return (
    <section className="testimonials-section">
      <Container className="text-center">
        <h2 className="section-title">Đánh giá từ cộng đồng</h2>
        <p className="section-subtitle">Những chia sẻ từ người nhận nuôi và tình nguyện viên</p>
        <Row>
          {testimonials.map((testimonial) => (
            <Col lg={4} md={6} sm={12} key={testimonial.id} className="mb-4">
              <div className="testimonial-card">
                <p className="testimonial-content">{testimonial.content}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    <img src={testimonial.avatar} alt={testimonial.name} />
                  </div>
                  <div className="testimonial-info">
                    <div className="testimonial-name">{testimonial.name}</div>
                    <div className="testimonial-rating">
                      <Rating value={testimonial.rating} readOnly size="small" />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default TestimonialsSection;