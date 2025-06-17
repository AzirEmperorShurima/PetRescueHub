import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Image, useColorModeValue } from '@chakra-ui/react';
import rescuseIcon from '../../assets/images/rescuseIcon.svg';
import styles from './RescueButton.module.css';

const RescueButton = () => {
  const navigate = useNavigate();
  const rescueBtnRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const startTime = useRef(0);

  // Rescue button drag handlers with optimized throttling
  const handleMouseDown = (e) => {
    if (rescueBtnRef.current) {
      startTime.current = Date.now();
      isDragging.current = false;
      const rect = rescueBtnRef.current.getBoundingClientRect();
      offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      e.preventDefault(); // Ngăn chặn hành vi mặc định
    }
  };

  const handleMouseMove = (e) => {
    if (startTime.current && rescueBtnRef.current) {
      // Chỉ bắt đầu kéo nếu đã giữ chuột quá 100ms hoặc đã di chuyển
      if (!isDragging.current) {
        const timeDiff = Date.now() - startTime.current;
        const moveX = Math.abs(e.clientX - (rescueBtnRef.current.getBoundingClientRect().left + offset.current.x));
        const moveY = Math.abs(e.clientY - (rescueBtnRef.current.getBoundingClientRect().top + offset.current.y));

        if (timeDiff > 100 || moveX > 5 || moveY > 5) {
          isDragging.current = true;
        }
      }

      if (isDragging.current) {
        // Using requestAnimationFrame for performance optimization
        requestAnimationFrame(() => {
          const x = Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - rescueBtnRef.current.offsetWidth));
          const y = Math.max(0, Math.min(e.clientY - offset.current.y, window.innerHeight - rescueBtnRef.current.offsetHeight));
          rescueBtnRef.current.style.left = `${x}px`;
          rescueBtnRef.current.style.top = `${y}px`;
          rescueBtnRef.current.style.right = 'auto';
          rescueBtnRef.current.style.bottom = 'auto';
        });
      }
    }
  };

  const handleMouseUp = () => {
    startTime.current = 0;
  };

  const handleClick = () => {
    if (!isDragging.current) {
      navigate('/rescue');
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <Box
      className={styles.rescueBtn}
      ref={rescueBtnRef}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={{ left: '20px', right: 'auto' }}
    >
      <Image
        src={rescuseIcon}
        alt="Báo cáo cứu hộ"
        className={styles.rescueBtn__icon}
      />
      <Box className={styles.rescueBtn__pulse}></Box>
  
      {/* CHUYỂN tooltip ra sau cùng để không bị đè */}
      <Box className={styles.rescueBtn__tooltip}>
        Báo cáo cứu hộ khẩn cấp ngay tại đây!
      </Box>
    </Box>
  );
};

export default RescueButton;