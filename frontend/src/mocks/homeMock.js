import banner1 from '../assets/images/banner1.jpg';
import banner2 from '../assets/images/banner2.jpg';
import banner3 from '../assets/images/banner3.jpg';
import banner4 from '../assets/images/banner4.jpg';

export const heroSlides = [
  {
    id: 1,
    image: banner3,
    title: 'Lan Tỏa Lòng Trắc Ẩn: Cứu Giúp Một Thú Cưng, Thay Đổi Một Cuộc Đời!',
    description: 'Hãy cùng chúng tôi mang đến một tương lai tươi sáng cho những người bạn bốn chân đáng yêu.',
    bgColor: '#e2e8f0'
  },
  {
    id: 2,
    image: banner1,
    title: 'Khám Phá Tình Yêu Vô Điều Kiện: Hãy Nhận Nuôi Một Thú Cưng Ngay Hôm Nay!',
    description: 'Tìm kiếm người bạn đồng hành hoàn hảo và mang niềm vui về nhà bằng cách chọn nhận nuôi thay vì mua sắm.',
    bgColor: '#FFF4D6'
  },
  {
    id: 3,
    image: banner2,
    title: 'Khám Phá Tình Yêu Vô Điều Kiện: Hãy Nhận Nuôi Một Thú Cưng Ngay Hôm Nay!',
    description: 'Tìm kiếm người bạn đồng hành hoàn hảo và mang niềm vui về nhà bằng cách chọn nhận nuôi thay vì mua sắm.',
    bgColor: '#FCEBED'
  },
  {
    id: 4,
    image: banner4,
    title: 'Thay Đổi Cuộc Đời: Chọn Nhận Nuôi, Chọn Yêu Thương!',
    description: 'Tạo nên một dấu ấn ý nghĩa bằng cách nhận nuôi một thú cưng đang cần, và trở thành một phần trong hành trình kỳ diệu của chúng hướng tới một tương lai tốt đẹp hơn.'
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