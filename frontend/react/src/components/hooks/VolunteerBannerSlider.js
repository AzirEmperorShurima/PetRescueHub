import { useEffect, useState } from 'react';
import { volunteerImages } from '../../config/LinkImage.config';

const VolunteerBannerSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Preload images for smoother transitions
  useEffect(() => {
    volunteerImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    // Thiết lập interval để thay đổi ảnh nền
    const interval = setInterval(() => {
      // Bắt đầu quá trình chuyển đổi
      setIsTransitioning(true);
      
      // Cập nhật nextImageIndex trước
      setNextImageIndex((prevIndex) => 
        prevIndex === volunteerImages.length - 1 ? 0 : prevIndex + 1
      );
      
      // Đợi một chút để CSS transition bắt đầu
      setTimeout(() => {
        // Sau đó cập nhật currentImageIndex
        setCurrentImageIndex((prevIndex) => 
          prevIndex === volunteerImages.length - 1 ? 0 : prevIndex + 1
        );
        
        // Kết thúc quá trình chuyển đổi sau khi animation hoàn tất
        setTimeout(() => {
          setIsTransitioning(false);
        }, 2500);
      }, 500);
    }, 6000); // Tăng thời gian hiển thị mỗi ảnh lên 6 giây

    // Cleanup interval khi component unmount
    return () => clearInterval(interval);
  }, []);

  // Áp dụng ảnh nền hiện tại và trạng thái chuyển đổi cho phần tử .volunteer-banner
  useEffect(() => {
    const bannerElement = document.querySelector('.volunteer-banner');
    if (bannerElement) {
      // Thiết lập ảnh hiện tại
      bannerElement.style.setProperty(
        '--current-volunteer-image', 
        `url('${volunteerImages[currentImageIndex]}')`
      );
      
      // Thiết lập ảnh tiếp theo cho hiệu ứng crossfade
      bannerElement.style.setProperty(
        '--next-volunteer-image', 
        `url('${volunteerImages[nextImageIndex]}')`
      );
      
      // Thiết lập trạng thái chuyển đổi
      if (isTransitioning) {
        bannerElement.classList.add('transitioning');
      } else {
        bannerElement.classList.remove('transitioning');
      }
    }
  }, [currentImageIndex, nextImageIndex, isTransitioning]);

  return null; // Component này không render UI
};

export default VolunteerBannerSlider;