import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Image, useColorModeValue } from '@chakra-ui/react';
import { FaPaw, FaHeart, FaCalendarAlt, FaHome } from 'react-icons/fa';
import vetIcon from '../../assets/images/vet.svg';
import styles from './RescueButton.module.css';

const RescueButton = () => {
  const navigate = useNavigate();
  const rescueBtnRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const iconColor = useColorModeValue('#e85fb0', '#e85fb0');

  // Rescue button drag handlers with optimized throttling
  const handleMouseDown = (e) => {
    if (rescueBtnRef.current) {
      isDragging.current = true;
      const rect = rescueBtnRef.current.getBoundingClientRect();
      offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      e.preventDefault(); // Ngăn chặn hành vi mặc định
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging.current && rescueBtnRef.current) {
      // Using requestAnimationFrame for performance optimization
      requestAnimationFrame(() => {
        if (!isDragging.current) return;
        const x = Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - rescueBtnRef.current.offsetWidth));
        const y = Math.max(0, Math.min(e.clientY - offset.current.y, window.innerHeight - rescueBtnRef.current.offsetHeight));
        rescueBtnRef.current.style.left = `${x}px`;
        rescueBtnRef.current.style.top = `${y}px`;
        rescueBtnRef.current.style.right = 'auto';
        rescueBtnRef.current.style.bottom = 'auto';
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
    }
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
    >
      <Text className={styles.rescueBtn__text}>Báo cáo cứu hộ</Text>
      <Image src={vetIcon} alt="Báo cáo cứu hộ" />
      <Box className={styles.rescueBtn__iconContainer}>
        <Box className={`${styles.rescueBtn__icon} ${styles['rescueBtn__icon--1']}`}>
          <FaPaw color={iconColor} />
        </Box>
        <Box className={`${styles.rescueBtn__icon} ${styles['rescueBtn__icon--2']}`}>
          <FaHeart color={iconColor} />
        </Box>
        <Box className={`${styles.rescueBtn__icon} ${styles['rescueBtn__icon--3']}`}>
          <FaCalendarAlt color={iconColor} />
        </Box>
        <Box className={`${styles.rescueBtn__icon} ${styles['rescueBtn__icon--4']}`}>
          <FaHome color={iconColor} />
        </Box>
      </Box>
    </Box>
  );
};

export default RescueButton;