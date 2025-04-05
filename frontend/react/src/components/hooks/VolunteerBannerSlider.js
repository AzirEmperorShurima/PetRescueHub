import { useEffect, useState } from 'react';

// Mảng chứa các ảnh đẹp về tình nguyện viên với thú cưng
const volunteerImages = [
  'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?q=80&w=2000&auto=format', // Người với mèo
  'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2000&auto=format', // Người với chó
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2000&auto=format', // Tình nguyện viên tại trung tâm cứu hộ
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2000&auto=format', // Nhóm tình nguyện viên
  'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?q=80&w=2000&auto=format', // Chăm sóc thú cưng
];

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