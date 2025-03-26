export const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Mỗi thú cưng đều xứng đáng có một mái ấm',
    description: 'Hãy cùng chúng tôi mang lại tương lai tươi sáng cho những người bạn bốn chân'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Cứu hộ - Chăm sóc - Tìm mái ấm mới',
    description: 'Mỗi năm chúng tôi giúp hàng trăm thú cưng tìm được gia đình mới'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Trở thành tình nguyện viên',
    description: 'Tham gia cùng chúng tôi trong hành trình cứu trợ và bảo vệ thú cưng'
  }
];

// Kiểm tra file mocks/homeMock.js:

// Cập nhật tên icon nếu cần
export const services = [
  {
    id: 1,
    icon: 'pets',
    title: 'Nhận nuôi',
    description: 'Tìm kiếm người bạn đồng hành mới từ danh sách thú cưng đang chờ được nhận nuôi',
    link: '/adopt'
  },
  {
    id: 2,
    // Thay đổi từ 'volunteer' sang 'handshake'
    icon: 'handshake',
    title: 'Quyên góp',
    description: 'Đóng góp để giúp chúng tôi cứu trợ và chăm sóc nhiều thú cưng hơn nữa',
    link: '/donate'
  },
  {
    id: 3,
    icon: 'emergency',
    title: 'Cứu hộ',
    description: 'Báo cáo trường hợp thú cưng cần được cứu hộ khẩn cấp',
    link: '/rescue'
  },
  {
    id: 4,
    icon: 'event',
    title: 'Sự kiện',
    description: 'Tham gia các sự kiện nhận nuôi và hoạt động cộng đồng',
    link: '/event'
  }
];

export const recentRescues = [
  {
    id: 1,
    title: 'Cứu hộ đàn chó con bị bỏ rơi',
    description: 'Đàn 5 chú chó con bị bỏ rơi trong thùng giấy đã được cứu hộ thành công',
    image: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    date: '2 ngày trước'
  },
  {
    id: 2,
    title: 'Giải cứu mèo mắc kẹt trên cây',
    description: 'Chú mèo bị mắc kẹt trên cây cao 10m đã được đội cứu hộ giải cứu an toàn',
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    date: '1 tuần trước'
  },
  {
    id: 3,
    title: 'Cứu hộ chó bị thương sau tai nạn',
    description: 'Chú chó bị thương sau tai nạn giao thông đã được điều trị và đang hồi phục tốt',
    image: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    date: '2 tuần trước'
  }
];

export const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content: 'Tôi đã nhận nuôi bé Luna từ Pet Rescue Hub và đó là quyết định tuyệt vời nhất. Cảm ơn đội ngũ đã giúp tôi tìm được người bạn đồng hành tuyệt vời này.',
    rating: 5
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: 'https://i.pravatar.cc/150?img=5',
    content: 'Đội cứu hộ đã phản ứng rất nhanh khi tôi báo cáo về một chú chó bị bỏ rơi. Họ rất chuyên nghiệp và tận tâm với công việc.',
    rating: 5
  },
  {
    id: 3,
    name: 'Lê Văn C',
    avatar: 'https://i.pravatar.cc/150?img=8',
    content: 'Tôi đã tham gia làm tình nguyện viên được 6 tháng và đây là trải nghiệm vô cùng ý nghĩa. Được giúp đỡ những thú cưng khó khăn là niềm vui lớn của tôi.',
    rating: 5
  }
];

export const stats = [
  {
    id: 1,
    value: 500,
    label: 'Thú cưng được cứu hộ',
    icon: 'pets'
  },
  {
    id: 2,
    value: 300,
    label: 'Thú cưng tìm được mái ấm mới',
    icon: 'home'
  },
  {
    id: 3,
    value: 100,
    label: 'Tình nguyện viên',
    icon: 'people'
  },
  {
    id: 4,
    value: 50,
    label: 'Sự kiện mỗi năm',
    icon: 'event'
  }
];

// Make sure the default export includes all the named exports
const homeMock = {
  heroSlides,
  services,
  recentRescues,
  testimonials,
  stats
};

export default homeMock;